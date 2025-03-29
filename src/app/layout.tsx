import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import LogoutButton from "@/components/logoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxor Bidding System",
  description: "Luxor Bidding System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('auth_token');
  const isAuthenticated = !!authToken;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {isAuthenticated && (
          <header className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">Luxor Bidding System</h1>
              <nav className="flex items-center gap-4">
                <LogoutButton />
              </nav>
            </div>
          </header>
        )}

        <main className="flex-1 container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}