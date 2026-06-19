"use client"

import { useState } from "react"
import { siteConfig } from "@/content/site"
import { buildWhatsAppUrl, buildMailtoUrl } from "@/lib/contact"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Contact() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const waHref = buildWhatsAppUrl(name, message, siteConfig)
  const mailHref = buildMailtoUrl(name, message, siteConfig)

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="section-invert border-t border-border bg-background px-4 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-2xl">
        {/* Section header */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Contacto
          </p>
          <h2
            id="contact-heading"
            className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Hablemos de tu proyecto
          </h2>
          <p className="mx-auto mt-4 max-w-[55ch] text-base leading-relaxed text-muted-foreground">
            Contanos de qué se trata y te respondemos a la brevedad — sin
            compromiso.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="space-y-5">
            {/* Name input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-name"
                className="text-sm font-medium text-foreground"
              >
                Tu nombre
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                placeholder="María García"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "transition-colors duration-150",
                  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
                )}
              />
            </div>

            {/* Message textarea */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-message"
                className="text-sm font-medium text-foreground"
              >
                Tu consulta
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Contanos brevemente de qué se trata tu proyecto o negocio..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={cn(
                  "w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "transition-colors duration-150",
                  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
                )}
              />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="accent"
                className="h-11 flex-1 px-6 text-base transition-colors duration-150 ease-out"
              >
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribinos por WhatsApp
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 flex-1 px-6 text-base transition-colors duration-150 ease-out"
              >
                <a href={mailHref}>
                  Mandanos un email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
