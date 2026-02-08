import '../styles/globals.css';

export const metadata = {
  title: 'UTunes',
  description: 'Find your music people at UT',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
