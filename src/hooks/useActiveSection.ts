"use client"

import { useEffect, useState } from "react"

const NAVBAR_HEIGHT = 80 // px, matches the h-20 navbar

export function getActiveSectionId(
  sectionTops: { id: string; top: number }[],
  lineOffset: number,
  isAtBottom: boolean,
): string {
  if (sectionTops.length === 0) return ""
  if (isAtBottom) return sectionTops[sectionTops.length - 1].id
  let active = sectionTops[0].id
  for (const { id, top } of sectionTops) {
    if (top <= lineOffset) active = id
    else break
  }
  return active
}

export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    let frame = 0

    function recompute() {
      const lineOffset = NAVBAR_HEIGHT + window.innerHeight * 0.3
      const sectionTops = ids
        .map((id) => {
          const el = document.getElementById(id)
          return el ? { id, top: el.getBoundingClientRect().top } : null
        })
        .filter((v): v is { id: string; top: number } => v !== null)
      const isAtBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4
      setActiveId(getActiveSectionId(sectionTops, lineOffset, isAtBottom))
    }

    function onScrollOrResize() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(recompute)
    }

    recompute()
    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
    }
  }, [ids])

  return activeId
}
