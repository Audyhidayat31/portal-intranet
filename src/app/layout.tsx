import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Intranet Perpustakaan Nasional RI",
  description: "Pusat Informasi Internal, Layanan Kedinasan, dan Interaksi Pegawai Perpustakaan Nasional Republik Indonesia",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-[#f8f9fa]">
        {children}
      </body>
    </html>
  );
}

