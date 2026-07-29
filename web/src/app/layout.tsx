import { Inter, Manrope } from 'next/font/google'

import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { Metadata } from 'next';
import { Navbar } from '@/components/ui/navbar';
import { getAuthenticatedAccount } from '@/lib/auth';

export const metadata: Metadata = {
  title: {
    default: "Tirol - Portal Abatimentos",
    template: `%s - Tirol - Portal Abatimentos`,
  },
  description: "Portal para solicitação de abatimentos na Tirol",
  icons: {
    icon: "/favicon.ico",
  },
};

const inter = Inter({
  subsets: [ 'latin' ],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: [ 'latin' ],
  variable: '--font-manrope',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const signedAccount = await getAuthenticatedAccount();

  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <main className="container flex flex-col h-screen m-auto p-3">
          <ThemeProvider>
            <Navbar initialAccount={signedAccount} />
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
