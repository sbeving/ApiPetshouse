export const metadata = {
  title: 'Odoo API Proxy',
  description: 'Next.js API proxy for Odoo Online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
