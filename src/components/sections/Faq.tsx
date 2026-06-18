"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface FaqItem {
  value: string
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    value: "tiempo",
    question: "¿Cuánto tarda en estar listo el sitio?",
    answer:
      "Depende del paquete: Express está listo en 5–7 días hábiles, Business en 10–14 días y Store en 14–21 días. El plazo empieza cuando nos receptamos toda la información necesaria.",
  },
  {
    value: "hosting",
    question: "¿El hosting y el dominio están incluidos?",
    answer:
      "No están incluidos en el precio del desarrollo. Te asesoramos para que los contrates vos directamente — así el sitio es 100% tuyo sin depender de nosotros.",
  },
  {
    value: "administracion",
    question: "¿Cómo administro el contenido una vez que está publicado?",
    answer:
      "Te entregamos acceso al panel de administración y una guía de uso. Podés actualizar textos, imágenes y productos sin tocar código ni necesitar ayuda técnica.",
  },
  {
    value: "mercadopago",
    question: "¿Puedo integrar Mercado Pago para cobrar online?",
    answer:
      "Sí, el paquete Store incluye integración con Mercado Pago. Solo necesitás tener tu cuenta vendedor activa y nosotros conectamos el checkout al sitio.",
  },
  {
    value: "soporte",
    question: "¿Qué pasa si necesito ayuda después del lanzamiento?",
    answer:
      "Incluimos 30 días de soporte post-lanzamiento sin costo. Después podés contratar un plan de mantenimiento mensual o consultar cambios puntuales por hora.",
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="px-4 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Preguntas frecuentes
          </p>
          <h2
            id="faq-heading"
            className="font-display text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            ¿Tenés dudas?
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
            Las preguntas que más nos hacen antes de arrancar. Si no encontrás
            la tuya, escribinos.
          </p>
        </div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          className={cn(
            "w-full rounded-xl border border-border bg-surface",
            "divide-y divide-border overflow-hidden"
          )}
          aria-label="Preguntas frecuentes"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border-0 px-5 sm:px-6"
            >
              <AccordionTrigger className="py-5 text-base font-semibold text-foreground hover:no-underline hover:text-accent transition-colors duration-150">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                <p className="max-w-[65ch] pb-1">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
