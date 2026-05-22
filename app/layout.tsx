import './globals.css';

export const metadata = {
  title: 'NexDrop',
  description: 'Cloud file transfer and storage platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <div id="main">{children}</div>
      </body>
    </html>
  );
}
