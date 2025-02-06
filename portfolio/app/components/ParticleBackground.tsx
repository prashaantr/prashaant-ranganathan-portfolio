"use client"

import { useCallback } from "react"
import Particles from "react-particles"
import type { Container, Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={{
        background: {
          color: {
            value: "#ffffff",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.3,
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        particles: {
          color: {
            value: ["#2D3A4B", "#3B82F6", "#64748B"],
          },
          links: {
            color: "#2D3A4B",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.4,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  )
}

