"use client"

import { useState, useEffect } from "react"

interface TypeWriterProps {
  text: string
  delay: number
}

export function TypeWriter({ text, delay }: TypeWriterProps) {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  // Split the text by newlines and preserve indentation
  const lines = currentText.split("\n").map((line, i) => (
    <div
      key={i}
      className="min-h-[1.5em] opacity-0 animate-fade-in"
      style={{
        animationDelay: `${i * 50}ms`,
        animationFillMode: "forwards",
      }}
    >
      <code className="text-[#D4D4D4]">
        {line.includes("//") ? (
          <>
            <span className="text-[#6A9955]">{line}</span>
          </>
        ) : (
          line.split(/([{}$$$$])/).map((part, j) => {
            if (part.match(/[{}$$$$]/)) {
              return (
                <span key={j} className="text-[#D4D4D4]">
                  {part}
                </span>
              )
            }
            if (part.match(/\b(const|let|var|function|return|await|if|true)\b/)) {
              return (
                <span key={j} className="text-[#569CD6]">
                  {part}
                </span>
              )
            }
            return <span key={j}>{part}</span>
          })
        )}
      </code>
    </div>
  ))

  return <div className="font-mono text-sm leading-relaxed overflow-hidden">{lines}</div>
}

