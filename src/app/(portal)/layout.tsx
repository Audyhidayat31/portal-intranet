import React from 'react';
import { PortalNavbar } from '@/components/portal/Navbar';
import { PortalFooter } from '@/components/portal/Footer';
import { getFooterConfig } from '@/lib/footer';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialFooter = getFooterConfig();

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col bg-white">
      <PortalNavbar />
      <main className="flex-1">{children}</main>
      <PortalFooter initialData={initialFooter} />
    </div>
  );
}

