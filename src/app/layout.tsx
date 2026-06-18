import type { Metadata } from "next"
import { DM_Sans, Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { siteConfig } from "@/content/site"
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: siteConfig.metadataBase,
  title: siteConfig.name,
  description: siteConfig.tagline,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <WhatsAppFloatingButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
