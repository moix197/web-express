import type { Metadata } from "next"
import { DM_Sans, Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig } from "@/content/site"
import { services } from "@/content/services"
import { buildLocalBusinessSchema, buildServiceSchema } from "@/lib/schema"
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton"
import { Navbar } from "@/components/layout/Navbar"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
})

const title = `${siteConfig.name} — ${siteConfig.tagline}`
const description =
  "Creamos sitios web profesionales, rápidos y optimizados para que tu negocio crezca en internet. Diseño web, tiendas online y branding en Argentina."

export const metadata: Metadata = {
  metadataBase: siteConfig.metadataBase,
  title: {
    template: `%s | ${siteConfig.name}`,
    default: title,
  },
  description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "es_AR",
    title,
    description,
    url: siteConfig.metadataBase.toString(),
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/opengraph-image" }],
  },
  alternates: {
    canonical: siteConfig.metadataBase.toString(),
  },
}

const localBusinessSchema = buildLocalBusinessSchema()
const servicesSchema = services.map(buildServiceSchema)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-AR"
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
          <Navbar />
          {children}
          <WhatsAppFloatingButton />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
      </body>
    </html>
  )
}
