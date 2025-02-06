"use client"

export function DottedBackground() {
  return (
    <div
      className="fixed inset-0 z-0 opacity-[0.15]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: "24px 24px",
      }}
    />
  )
}

