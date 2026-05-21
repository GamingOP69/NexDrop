import './globals.css';

export const metadata = {
  title: 'NexDrop',
  description: 'Cloud file transfer and storage platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
