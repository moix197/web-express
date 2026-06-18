import { type SiteConfig } from "@/content/site"

const DEFAULT_WA_MESSAGE = "Hola, me gustaría saber más sobre sus servicios web."
const DEFAULT_EMAIL_SUBJECT = "Consulta desde web-express.com.ar"
const DEFAULT_EMAIL_BODY = "Hola, me gustaría saber más sobre sus servicios web."

/** Pre-filled WhatsApp message for the "Reservá una llamada" CTAs (Hero + floating button). */
export const RESERVE_CALL_WA_MESSAGE = "Hola, quiero reservar una llamada"

/**
 * Builds a wa.me deep-link URL with the contact message pre-filled.
 *
 * Uses encodeURIComponent on the composed text so special characters and
 * whitespace are safe for the query string. When both name and message are
 * empty the function falls back to DEFAULT_WA_MESSAGE so the generated URL
 * always has a non-empty `?text=` value (never `?text=undefined` or bare).
 */
export function buildWhatsAppUrl(
  name: string,
  message: string,
  config: SiteConfig,
): string {
  const trimmedName = name.trim()
  const trimmedMessage = message.trim()

  const text =
    trimmedName || trimmedMessage
      ? `${trimmedName ? `${trimmedName}: ` : ""}${trimmedMessage}`.trim()
      : DEFAULT_WA_MESSAGE

  return `https://wa.me/${config.whatsApp}?text=${encodeURIComponent(text)}`
}

/**
 * Builds a mailto: link with subject and body pre-filled.
 *
 * Uses encodeURIComponent on both subject and body. When both name and message
 * are empty the function falls back to DEFAULT_EMAIL_SUBJECT / DEFAULT_EMAIL_BODY
 * so the link is always usable without user input.
 */
export function buildMailtoUrl(
  name: string,
  message: string,
  config: SiteConfig,
): string {
  const trimmedName = name.trim()
  const trimmedMessage = message.trim()

  const subject = trimmedName
    ? `Consulta de ${trimmedName}`
    : DEFAULT_EMAIL_SUBJECT

  const body =
    trimmedName || trimmedMessage
      ? `${trimmedName ? `Nombre: ${trimmedName}\n\n` : ""}${trimmedMessage}`.trim()
      : DEFAULT_EMAIL_BODY

  return `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
