import { Search, Layout, Code2, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: string
  icon: React.ElementType
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: Search,
    title: "Descubrimiento",
    description:
      "Entendemos tu negocio, tus objetivos y tu público. Definimos qué necesitás antes de escribir una línea de código.",
  },
  {
    number: "02",
    icon: Layout,
    title: "Diseño",
    description:
      "Creamos la estructura visual del sitio: wireframes, paleta de colores y tipografías alineadas con tu marca.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Construcción",
    description:
      "Desarrollamos el sitio con tecnología moderna, rápida y optimizada para SEO y dispositivos móviles.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Lanzamiento",
    description:
      "Publicamos el sitio, configuramos el dominio y te entregamos todo listo para recibir clientes.",
  },
]

function StepCard({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon
  const isLast = index === STEPS.length - 1

  return (
    <li className="relative flex flex-row gap-5 lg:flex-col lg:gap-6">
      {/* Connector line (hidden on last item) */}
      {!isLast && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-8 left-8 h-[calc(100%-2rem)] w-px bg-border",
            "lg:top-8 lg:left-auto lg:h-px lg:w-[calc(100%-3rem+1rem)]",
            "lg:translate-x-[calc(3rem-0.5px)]"
          )}
        />
      )}

      {/* Number badge + icon */}
      <div className="relative z-10 flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-accent/40 bg-surface ring-1 ring-accent/20 lg:h-14 lg:w-14">
        <span
          className="font-display text-xs font-black leading-none tracking-widest text-accent"
          aria-hidden="true"
        >
          {step.number}
        </span>
        <Icon
          className="mt-1 size-4 text-accent"
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="pt-1 lg:pt-0">
        <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">
          {step.title}
        </h3>
        <p className="mt-1.5 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>
      </div>
    </li>
  )
}

export function Process() {
  return (
    <section
      id="proceso"
      aria-labelledby="process-heading"
      className="px-4 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Cómo trabajamos
          </p>
          <h2
            id="process-heading"
            className="font-display text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Del brief al lanzamiento
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
            Un proceso claro y sin sorpresas. Sabés en qué etapa estamos en
            todo momento.
          </p>
        </div>

        {/* Steps: vertical on mobile, horizontal on lg */}
        <ol
          aria-label="Etapas del proceso"
          className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-0"
        >
          {STEPS.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  )
}
