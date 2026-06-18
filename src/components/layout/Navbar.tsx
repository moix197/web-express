"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { buildWhatsAppUrl, RESERVE_CALL_WA_MESSAGE } from "@/lib/contact"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/content/site"
import { NAV_LINKS } from "@/components/layout/nav-links"

const ctaHref = buildWhatsAppUrl("", RESERVE_CALL_WA_MESSAGE, siteConfig)

export function Navbar() {
  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-40 h-20",
        "bg-background/80 backdrop-blur-md border-b border-border",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand */}
        <a
          href="#inicio"
          className="font-display text-lg font-black uppercase tracking-tight text-foreground transition-colors duration-150 hover:text-accent"
        >
          {siteConfig.name}
        </a>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="hidden md:flex gap-6">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="default" size="default">
            <a href={ctaHref} target="_blank" rel="noopener noreferrer">
              Reservá una llamada
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
