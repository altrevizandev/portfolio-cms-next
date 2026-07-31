import { Inter, Manrope } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/ui/navbar"
import { getAuthenticatedAccount } from "@/lib/auth"
import { getHomepage, getHomepageImageUrl } from "@/lib/homepage"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "André Lucas Trevizan — Software Developer",
    template: "%s — André Lucas Trevizan",
  },
  description: "Portfólio de André Lucas Trevizan, desenvolvedor de software.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "André Lucas Trevizan",
    title: "André Lucas Trevizan — Software Developer",
    description: "Produtos digitais construídos com propósito, do backend à experiência final.",
  },
  twitter: {
    card: "summary_large_image",
    title: "André Lucas Trevizan — Software Developer",
    description: "Produtos digitais construídos com propósito, do backend à experiência final.",
  },
  icons: {
    icon: { url: "/icon.svg", type: "image/svg+xml" },
  },
}

const inter = Inter({
  subsets: [ "latin" ],
  variable: "--font-inter",
  display: "swap",
})

const manrope = Manrope({
  subsets: [ "latin" ],
  variable: "--font-manrope",
  display: "swap",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [ signedAccount, homepage ] = await Promise.all([
    getAuthenticatedAccount(),
    getHomepage(),
  ])

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider>
          <Navbar
            initialAccount={signedAccount}
            avatarUrl={getHomepageImageUrl(homepage?.primary_photo)}
          />
          <main>{children}</main>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
