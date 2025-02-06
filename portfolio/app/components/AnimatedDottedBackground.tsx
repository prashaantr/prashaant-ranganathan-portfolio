"use client"
import { motion } from "framer-motion"

export function AnimatedDottedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 2px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "24px 24px"],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  )
}

