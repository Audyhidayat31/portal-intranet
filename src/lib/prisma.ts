import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getOptimizedDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Clean up channel_binding if present as it can cause issues with connection poolers
  url = url.replace(/[?&]channel_binding=[^&]*/g, '');

  // Ensure connect_timeout is set (minimum 30s for Neon cold-start wakeups)
  if (!url.includes('connect_timeout=')) {
    url += (url.includes('?') ? '&' : '?') + 'connect_timeout=30';
  }

  // Ensure pool_timeout is set
  if (!url.includes('pool_timeout=')) {
    url += '&pool_timeout=30';
  }

  // If using pooler hostname, ensure pgbouncer=true is present
  if (url.includes('-pooler') && !url.includes('pgbouncer=')) {
    url += '&pgbouncer=true';
  }

  // Limit connection pool size for Neon serverless pooler to prevent idle socket bloat
  if (!url.includes('connection_limit=')) {
    url += '&connection_limit=10';
  }

  return url;
}

const databaseUrl = getOptimizedDatabaseUrl();

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

  // Handle errors gracefully and filter transient closed connection logs from Neon serverless pooler
  client.$on('error' as never, (e: any) => {
    const msg = e?.message || String(e);
    if (
      msg.includes('kind: Closed') ||
      msg.includes('connection closed') ||
      msg.includes('Connection reset by peer')
    ) {
      // Expected transient disconnect from Neon serverless pooler when idle.
      // Prisma automatically re-establishes connection on the next incoming query.
      return;
    }
    console.error('Prisma Error:', msg);
  });

  client.$on('warn' as never, (e: any) => {
    const msg = e?.message || String(e);
    console.warn('Prisma Warning:', msg);
  });

  return client;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Execute a database operation with automatic retry on transient connection/cold-start errors.
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delayMs = 1500
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      const isConnError =
        error?.code === 'P1001' ||
        error?.code === 'P1017' || // Server has closed the connection
        error?.message?.includes("Can't reach database server") ||
        error?.message?.includes('connection closed') ||
        error?.message?.includes('kind: Closed') ||
        error?.message?.includes('Connection refused') ||
        error?.message?.includes('Connection reset by peer') ||
        error?.message?.includes('timed out');

      if (attempt <= maxRetries && isConnError) {
        console.warn(
          `[Prisma DB] Database cold-start / connection glitch. Retrying (${attempt}/${maxRetries}) in ${delayMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw error;
    }
  }
}
