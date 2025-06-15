import { Providers } from './providers';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'User Management System',
  description: 'Manage users, sessions and permissions',
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}  