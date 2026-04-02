import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CoffeeTrack",
  description: "Log coffee chats and track follow-ups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
        >
          <nav className="border-b border-gray-200 bg-white px-4">
            <div className="max-w-2xl mx-auto flex items-center gap-6 h-14">
              <Link href="/" className="font-semibold text-amber-700 text-sm">
                CoffeeTrack
              </Link>
              <Link href="/chats" className="text-sm text-gray-600 hover:text-gray-900">
                Chats
              </Link>
              <Link href="/followups" className="text-sm text-gray-600 hover:text-gray-900">
                Follow-ups
              </Link>
              <div className="ml-auto">
                <SignedIn>
                  <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="redirect">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Sign in
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
