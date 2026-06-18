import { MessageCircle } from "lucide-react"
import { siteConfig } from "@/content/site"
import { cn } from "@/lib/utils"
import { buildWhatsAppUrl, RESERVE_CALL_WA_MESSAGE } from "@/lib/contact"

export function WhatsAppFloatingButton() {
  const waHref = buildWhatsAppUrl("", RESERVE_CALL_WA_MESSAGE, siteConfig)

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-30",
        "flex size-14 items-center justify-center rounded-full",
        "bg-[#25D366] text-white shadow-lg",
        "cursor-pointer transition-colors duration-150 ease-out",
        "hover:bg-[#1ebe5d]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
      )}
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  )
}
