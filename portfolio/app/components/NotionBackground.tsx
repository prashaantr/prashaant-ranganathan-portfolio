"use client"

import React from "react"
import { motion } from "framer-motion"

const shapes = [
  { type: "circle", size: 60, color: "#FF9900", top: "10%", left: "5%" },
  { type: "square", size: 80, color: "#2ECC71", top: "20%", right: "10%" },
  { type: "triangle", size: 70, color: "#9B51E0", bottom: "15%", left: "15%" },
  { type: "circle", size: 100, color: "#0066FF", bottom: "10%", right: "5%" },
  { type: "square", size: 50, color: "#FF73FA", top: "40%", left: "20%" },
]

export function NotionBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          style={{
            width: shape.size,
            height: shape.size,
            borderRadius: shape.type === "circle" ? "50%" : shape.type === "square" ? "10%" : "0",
            background: shape.color,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom,
          }}
          animate={{
            y: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 5 + index,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {shape.type === "triangle" && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

