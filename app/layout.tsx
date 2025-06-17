import { Providers } from "./providers";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata = {
  title: "用户管理",
  description: "用户管理",
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
        <div className="w-screen max-w-[1200px] flex justify-center m-auto">
          <Providers session={session}>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
