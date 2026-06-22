import { siteConfig } from "@/content/site"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "@/components/layout/nav-links"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      aria-label="Pie de página"
      className="border-t border-border bg-background px-4 py-12 sm:px-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Top row: brand + nav */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="flex items-center justify-center gap-2.5 font-display text-lg font-black tracking-tight text-foreground sm:justify-start">
              <img
                src="/logo_gold.svg"
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                className="size-9 shrink-0"
              />
              {siteConfig.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Navegación del pie de página">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={cn(
                      "text-sm text-muted-foreground",
                      "cursor-pointer transition-colors duration-150 hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded",
                    )}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border" />

        {/* Bottom row: copyright */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {siteConfig.domain}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
