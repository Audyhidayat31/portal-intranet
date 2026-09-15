import React from 'react';
import { PortalNavbar } from '@/components/portal/Navbar';
import { PortalFooter } from '@/components/portal/Footer';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalNavbar />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}
