import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'DineFlow | One Platform. Complete Restaurant Control.',
  description: 'Complete Cloud-Based Restaurant Management SaaS Platform: QR Ordering, Waiter POS, Kitchen Display System (KDS), Multi-Branch Management & Analytics.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F8FA] text-[#252B36] antialiased">
        {children}
      </body>
    </html>
  );
}
