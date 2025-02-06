"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TypeWriter } from "./components/TypeWriter"
import projects from "./data/projects.json"
import { AnimatedDottedBackground } from "./components/AnimatedDottedBackground"
import { HeroShapes } from "./components/HeroShapes"
import { DottedBackground } from "./components/DottedBackground"

const founderCodeSnippet = `function buildStartup(vision) {
  // Zero to One Product Development
  const startup = {
    idea: brainstormIdeas(vision),
    prototype: createPrototype(),
    initialFeedback: gatherInitialFeedback()
  };

  while (!validateProductMarketFit(startup.initialFeedback)) {
    startup.prototype = iteratePrototype(startup.prototype, startup.initialFeedback);
    startup.initialFeedback = gatherInitialFeedback();
  }

  return launchProduct(startup.prototype);
}`

const categories = ["All", "Venture", "AI & Research", "UX/UI Design", "Growth & Strategy"]

const categoryColors: Record<string, string> = {
  Venture: "#f24e1e",
  "AI & Research": "#ff7262",
  "UX/UI Design": "#a259ff",
  "Growth & Strategy": "#1abcfe",
  All: "#0acf83",
}

declare global {
  interface Window {
    Calendly: any;
    gtag?: (event: string, action: string, params: object) => void;
  }
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isTyping, setIsTyping] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)
  const calendlyRef = useRef(null)

  const filteredProjects = projects.filter(
    (project) => selectedCategory === "All" || project.categories.includes(selectedCategory),
  )

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)

    // Track category selection event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_category', {
        event_category: 'Category',
        event_label: category,
      })
    }
  }

  const handleProjectClick = (projectId: string) => {
    // Track project click event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_project', {
        event_category: 'Project',
        event_label: projectId,
      })
    }
  }

  const handleConnectClick = () => {
    // Track "Let's Connect" button click event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_connect', {
        event_category: 'Button',
        event_label: "Let's Connect",
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false)
      setTimeout(() => {
        setIsTyping(true)
        setCurrentLine(0)
      }, 1000)
    }, founderCodeSnippet.length * 30)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Append Calendly widget CSS
    const link = document.createElement("link")
    link.href = "https://assets.calendly.com/assets/external/widget.css"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    // Append Calendly widget script
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    script.onload = () => {
      window.Calendly.initBadgeWidget({
        url: 'https://calendly.com/prashaant-rn/15-min-intro-meeting',
        text: 'Book My Calendar!',       
        color: '#6600ff',
        textColor: '#ffffff',
        position: 'left',
      })

      // Force override with custom CSS
      const style = document.createElement('style')
      style.innerHTML = `
        .calendly-badge-widget {
          left: 20px !important;
          right: auto !important;
        }
      `
      document.head.appendChild(style)
    }
    document.body.appendChild(script)

    // Cleanup function to remove the script and link when the component unmounts
    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-4 overflow-hidden">
          <AnimatedDottedBackground />
          <HeroShapes />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h1
                className="font-bold mb-6"
                style={{
                  fontSize: '4rem',
                  lineHeight: '1.1',
                  letterSpacing: '-0.05em'
                }}
              >
                Designer, Developer and Founder
              </h1>
              <p
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                style={{
                  lineHeight: '1.6',
                  letterSpacing: '-0.01em',
                }}
              >
                Bridging design, AI, and product strategy to build digital experiences that matter.
              </p>
            </div>

            {/* Code Terminal */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-8">
              <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-2xl border border-gray-800 transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-mono text-gray-400">founder.ts</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                </div>
                <div className="p-6 font-mono text-sm h-[300px] overflow-hidden">
                  <TypeWriter text={founderCodeSnippet} delay={30} />
                </div>
              </div>
            </motion.div>

            {/* Connect Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-16"
            >
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base bg-black hover:bg-green-500 text-white transition-colors"
                asChild
                onClick={handleConnectClick}
              >
                <a href="mailto:prashran@stanford.edu"
                  style={{ backgroundColor: 'black' }}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-full px-8 py-6 text-base text-white transition-colors hover:bg-gray-800">
                  Let's Connect
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 px-4 relative">
          <AnimatedDottedBackground />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black mb-6 leading-tight">
                Things I have Built.
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                A showcase of ventures, products, and experiments
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? `bg-[${categoryColors[category]}] text-white`
                        : `bg-[${categoryColors[category]}]/20 text-gray-600 hover:bg-[${categoryColors[category]}]/40`
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category ? categoryColors[category] : `${categoryColors[category]}20`,
                      color: selectedCategory === category ? "white" : "",
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Project */}
            {selectedCategory === "All" && (
              <div className="mb-16 hidden sm:block">
                {projects[0] && (
                  <Link href={`/projects/${projects[0].id}`} className="block group" onClick={() => handleProjectClick(projects[0].id)}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative w-full rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[500px] flex flex-col sm:h-auto sm:aspect-[4/3] sm:block lg:h-[600px] lg:aspect-[16/9]"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={projects[0].image || "/placeholder.svg"}
                          alt={projects[0].title}
                          layout="fill"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-black/70 text-white">
                          <div className="flex items-center gap-2 mb-4">
                            {projects[0].categories.map((category, idx) => (
                              <span
                                key={idx}
                                className="text-sm font-medium px-3 py-1 rounded-full"
                                style={{
                                  backgroundColor: categoryColors[category],
                                  color: "white",
                                }}
                              >
                                {category}
                              </span>
                            ))}
                            <span className="text-sm opacity-80">{projects[0].date}</span>
                          </div>
                          <h3 className="text-3xl font-bold mb-2 text-white  group-hover:text-white transition-colors">
                            {projects[0].title}
                          </h3>
                          <p className="text-lg text-white/80 max-w-2xl">{projects[0].description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )}
              </div>
            )}

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {filteredProjects.slice(selectedCategory === "All" ? 1 : 0).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={`/projects/${project.id}`} onClick={() => handleProjectClick(project.id)}>
                      <article className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[500px] flex flex-col">
                        <div className="absolute top-2 right-2 z-10">
                          <div className="w-30 h-30 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                            <Image
                              src={`/images/logos/${project.id}.png`}
                              alt={`${project.title} logo`}
                              width={50}
                              height={50}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {project.categories.map((category, idx) => (
                              <span
                                key={idx}
                                className="text-xs font-medium px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: categoryColors[category],
                                  color: "white",
                                }}
                              >
                                {category}
                              </span>
                            ))}
                            <span className="text-sm text-gray-500">{project.date}</span>
                          </div>
                          <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 mb-4 flex-grow">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {Object.entries(project.techStack).flatMap(([category, technologies]) =>
                              technologies.slice(0, 3).map((tech: string) => (
                                <span
                                  key={`${category}-${tech}`}
                                  className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                                >
                                  {tech}
                                </span>
                              )),
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

           
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 bg-white text-gray-900 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Add geometric shapes */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-500 rounded-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-500 opacity-50 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-500 rounded-full opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500 opacity-50 transform -translate-x-1/2 translate-y-1/2 rotate-12"></div>
            <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-pink-500 rounded-full opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-orange-500 opacity-50 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-semibold mb-8">Let's Have a Quick Chat</h2>
            <p className="text-lg">
              Feel free to reach out to me at{" "}
              <a href="mailto:prashran@stanford.edu" className="text-blue-500 hover:underline">
                prashran@stanford.edu
              </a>
            </p>
          </div>
        </section>
      </div>

     
    </>
  )

}

