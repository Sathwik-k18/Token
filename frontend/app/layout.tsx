export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>{children}</body>
    </html>
  );
}
