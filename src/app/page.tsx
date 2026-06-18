import type { Metadata } from "next"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Services } from "@/components/sections/Services"
import { Process } from "@/components/sections/Process"
import { Faq } from "@/components/sections/Faq"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"

export const metadata: Metadata = {
  title: "Sitios web profesionales para tu negocio",
}

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Process />
      <Faq />
      <Contact />
      <Footer />
    </main>
  )
}
