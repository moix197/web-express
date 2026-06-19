"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { buildWhatsAppUrl, RESERVE_CALL_WA_MESSAGE } from "@/lib/contact"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/content/site"
import { NAV_LINKS } from "@/components/layout/nav-links"
import { useActiveSection } from "@/hooks/useActiveSection"

const ctaHref = buildWhatsAppUrl("", RESERVE_CALL_WA_MESSAGE, siteConfig)
const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1))

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection(SECTION_IDS)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [isOpen])

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
          className="flex items-center gap-2.5 font-display text-lg font-black uppercase tracking-tight text-foreground transition-colors duration-150 hover:text-accent"
        >
          <img
            src="/logo_gold.svg"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            className="size-9 shrink-0"
          />
          {siteConfig.name}
        </a>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="hidden md:flex gap-6">
          {NAV_LINKS.map((link) => {
            const active = activeId === link.href.slice(1)
            return (
              <Button key={link.href} variant="ghost" size="sm" asChild>
                <a
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    active
                      ? "text-foreground underline decoration-2 underline-offset-4"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </a>
              </Button>
            )
          })}
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

        {/* Hamburger button */}
        <Button
          ref={hamburgerRef}
          variant="ghost"
          size="icon-sm"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          className="md:hidden"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </div>

      {/* Mobile dropdown panel */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden absolute top-full left-0 right-0 border-b border-border bg-background/95 backdrop-blur-md flex-col gap-2 px-4 py-4",
          isOpen ? "flex" : "hidden",
        )}
      >
        {NAV_LINKS.map((link) => {
          const active = activeId === link.href.slice(1)
          return (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <a
                href={link.href}
                aria-current={active ? "true" : undefined}
                className={cn(
                  active
                    ? "text-foreground underline decoration-2 underline-offset-4"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </Button>
          )
        })}
        <Button asChild variant="default" size="default">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
          >
            Reservá una llamada
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
