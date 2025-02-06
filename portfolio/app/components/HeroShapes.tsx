"use client"

import { useState, useEffect } from "react"

export function HeroShapes() {
  const [visibleShapes, setVisibleShapes] = useState(0)

  const shapes = [
    // Circles (border only)
    { type: "circle", color: "#FFCC01", size: 100, top: "10%", right: "10%" },
    { type: "circle", color: "#f24e1e", size: 120, bottom: "20%", right: "25%" },
    { type: "circle", color: "#ff7262", size: 90, top: "35%", left: "15%" },
    { type: "circle", color: "#a259ff", size: 110, bottom: "30%", left: "35%" },
    { type: "circle", color: "#1abcfe", size: 100, top: "25%", left: "45%" },
    { type: "circle", color: "#0acf83", size: 130, bottom: "15%", right: "40%" },

    // Squares
    { type: "square", color: "#FF6B6B", size: 95, top: "5%", left: "20%" },
    { type: "square", color: "#4ECDC4", size: 115, bottom: "10%", right: "15%" },
    { type: "square", color: "#FFA07A", size: 85, top: "50%", left: "5%" },
    { type: "square", color: "#20B2AA", size: 105, bottom: "40%", right: "5%" },

    // Squiggles
    { type: "squiggle", color: "#DDA0DD", width: 120, top: "60%", left: "30%" },
    { type: "squiggle", color: "#00CED1", width: 100, bottom: "5%", right: "20%" },
    { type: "squiggle", color: "#FF69B4", width: 110, top: "70%", right: "35%" },
    { type: "squiggle", color: "#32CD32", width: 90, bottom: "50%", left: "40%" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleShapes((prev) => (prev < shapes.length ? prev + 1 : prev))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.slice(0, visibleShapes).map((shape, index) => {
        if (shape.type === "circle") {
          return (
            <div
              key={index}
              className="absolute rounded-full border-4 animate-fade-in hover:scale-110 transition-transform duration-200"
              style={{
                top: shape.top,
                left: shape.left,
                right: shape.right,
                bottom: shape.bottom,
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                borderColor: shape.color,
              }}
            />
          )
        }

        if (shape.type === "square") {
          return (
            <div
              key={index}
              className="absolute animate-fade-in hover:scale-110 transition-transform duration-200"
              style={{
                top: shape.top,
                left: shape.left,
                right: shape.right,
                bottom: shape.bottom,
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                backgroundColor: shape.color,
                opacity: 0.2,
              }}
            />
          )
        }

        if (shape.type === "squiggle") {
          return (
            <svg
              key={index}
              width={shape.width}
              height={shape.width / 2}
              viewBox="0 0 120 60"
              className="absolute animate-fade-in"
              style={{
                top: shape.top,
                left: shape.left,
                right: shape.right,
                bottom: shape.bottom,
              }}
            >
              <path d="M0 30 Q30 0, 60 30 T120 30" stroke={shape.color} strokeWidth="4" fill="none" />
            </svg>
          )
        }
      })}
    </div>
  )
}

