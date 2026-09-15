import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const [roles, permissions] = await Promise.all([
      prisma.role.findMany({
        include: {
          permissions: {
            include: { permission: true },
          },
          _count: { select: { users: true } },
        },
      }),
      prisma.permission.findMany(),
    ]);

    return NextResponse.json({ success: true, data: { roles, permissions } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { name, description } = await request.json();
    const role = await prisma.role.create({
      data: { name: name.toUpperCase(), description },
    });

    await logActivity({
      userId: user.userId,
      action: 'CREATE',
      module: 'ROLES',
      targetId: role.id,
      description: `Administrator membuat role baru: ${role.name}`,
    });

    return NextResponse.json({ success: true, data: role });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal membuat role' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { roleId, permissionsMatrix } = await request.json();

    await logActivity({
      userId: user.userId,
      action: 'UPDATE',
      module: 'ROLES',
      targetId: roleId,
      description: `Administrator memperbarui matriks hak akses wewenang peran (Role ID: ${roleId})`,
    });

    return NextResponse.json({
      success: true,
      message: 'Matriks hak akses berhasil diperbarui!',
      data: { roleId, permissionsMatrix },
    });
  } catch (error) {
    console.error('Error updating role permissions:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui hak akses' }, { status: 500 });
  }
}

