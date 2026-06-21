import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata = {
  title: 'Dev Project Hub',
  description: 'Track what you are building',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
