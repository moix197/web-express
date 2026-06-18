"use client"

import { useEffect, useState } from "react"

export function getActiveSectionId(
  intersectingIds: string[],
  orderedIds: string[],
  isAtBottom: boolean,
): string {
  if (isAtBottom) return orderedIds[orderedIds.length - 1]
  for (const id of orderedIds) {
    if (intersectingIds.includes(id)) return id
  }
  return orderedIds[0]
}

export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const intersecting = new Set<string>()

    function recompute() {
      const isAtBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4
      setActiveId(getActiveSectionId([...intersecting], ids, isAtBottom))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id)
          } else {
            intersecting.delete(entry.target.id)
          }
        }
        recompute()
      },
      { rootMargin: "-80px 0px -60% 0px" },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    window.addEventListener("scroll", recompute, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", recompute)
    }
  }, [ids])

  return activeId
}
