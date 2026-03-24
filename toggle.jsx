"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ModeToggle({ compact = false }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"
  const nextLabel = isDark ? "Light" : "Dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${nextLabel.toLowerCase()}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`inline-flex items-center gap-2 rounded-full h-9 px-2 py-1 transition-colors dark:text-white text-sm`}
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors
        ${isDark ? "bg-black border-white/30" : "bg-white border-black/20"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full transition-transform
          ${isDark ? "translate-x-4 bg-white" : "translate-x-1 bg-black"}`}
        />
      </span>
      {!compact && <span className="select-none">{nextLabel}</span>}
    </button>
  )
}