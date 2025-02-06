"use client"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CheckSquare,
  Users,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Clock,
  GroupIcon as TeamIcon,
  Code,
  ClipboardList,
  PieChart,
  BarChart,
  DollarSign,
  Search,
  UserCheck,
  MessageSquare,
  Github
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedDottedBackground } from "../../components/AnimatedDottedBackground"
import projects from "../../data/projects.json"
import React from "react"

const tagColors = {
  orange: "#f24e1e",
  coral: "#ff7262",
  purple: "#a259ff",
  blue: "#1abcfe",
  green: "#0acf83",
}

const accentColor = "#FFCC01"
const blackColor = "#000000"

type ProjectPageProps = {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    overview: string;
    timeline: string;
    teamSize: string;
    techStack: Record<string, string[] | undefined>;
    tags?: string[];
    challenges?: string[];
    solutions?: string[];
    challengesImage?: string;
    solutionsImage?: string;
    resultsImage?: string;
    problemSpace?: {
      description?: string;
      targetAudience?: string;
      marketSize?: string;
      image?: string;
      keyStats?: { value: string; label: string }[];
      mobileScreens?: { image: string; description: string }[];
    };
    architecture?: {
      diagram: string;
      description: string;
    };
    codeSnippets?: {
      title: string;
      code: string;
    }[];
    overviewImage?: string;
    results?: Record<string, any>;
    technicalInsights?: string[];
    projectManagement: string[];
    customerDiscovery?: {
      process: string;
      validationMethods: string;
      keyInsights: string[];
      image1?: string;
      image2?: string;
      painpointSolution?: string;
    };
    projectLink?: string;
    mobileScreens?: { image: string; description: string }[];
    githubLink?: string;
    // Add other properties as needed
  };
  nextProject: {
    id: string;
    title: string;
    image?: string;
  };
};

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const project = projects.find((p) => p.id === id) as ProjectPageProps['project'];

  if (!project) {
    notFound();
  }

  const projectIndex = projects.findIndex((p) => p.id === id);
  const nextProject = projects[(projectIndex + 1) % projects.length];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"])

  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const renderTags = (tags: string[] | undefined) => {
    if (!tags) return null;
    return tags.map((tag, index) => {
      // Track tag rendering event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'render_tag', {
          event_category: 'Tag',
          event_label: tag,
        });
      }

      return (
        <span
          key={`${tag}-${index}`}
          className="px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: Object.values(tagColors)[index % Object.values(tagColors).length] }}
        >
          {tag}
        </span>
      );
    });
  };

  return (
    <>
      <div className="bg-[#f3f3f3] min-h-screen">
        {/* Hero Section */}
        <motion.section ref={ref} className="relative h-screen overflow-hidden">
          <motion.div style={{ y: backgroundY }} className="absolute inset-0 md:rounded-t-[30px] overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              style={{ objectFit: 'cover' }}
              className="z-0 md:rounded-t-[30px]" // Apply 100px rounded corners to the top on desktop
            />
            <div
              className="absolute inset-0 z-10 md:rounded-t-[30px]"
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.1))',
              }}
            />
          </motion.div>

          <AnimatedDottedBackground />

          <div className="relative z-20 flex flex-col justify-center items-center h-full text-white max-w-6xl mx-auto px-4">
            <motion.div style={{ y: textY }} className="text-left">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">{project.title}</h1>
              <p className="text-base sm:text-lg md:text-2xl mb-8 text-gray-200 max-w-auto mx-auto">{project.description}</p>
              <div className="flex flex-wrap justify-left gap-3">
                {renderTags(project.tags)}
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <ChevronRight className="w-6 h-6 rotate-90" />
            </motion.div>
          </div>
        </motion.section>


        {/* Project Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section id="overview" className="mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-gray-800 text-left">OVERVIEW</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
                <div className="space-y-6">
                  <p className="text-md text-gray-700">{project.overview}</p>
                  <Button asChild className="w-full hover:bg-yellow-500 rounded-none" style={{ backgroundColor: 'black' }}>
                    <a
                      href={project.projectLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2"
                      onClick={() => {
                        // Track project link click event
                        if (typeof window !== 'undefined' && window.gtag) {
                          window.gtag('event', 'click_project_link', {
                            event_category: 'Link',
                            event_label: project.title,
                          });
                        }
                      }}
                    >
                      Visit Project <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>

                  {project.githubLink && (
                    <Button asChild className="w-full hover:bg-gray-800 rounded-none mt-4" style={{ backgroundColor: '#333' }}>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2"
                        onClick={() => {
                          // Track GitHub link click event
                          if (typeof window !== 'undefined' && window.gtag) {
                            window.gtag('event', 'click_github_link', {
                              event_category: 'Link',
                              event_label: project.title,
                            });
                          }
                        }}
                      >
                        View on GitHub <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="relative overflow-visible rounded-3xl">
                  <Image
                    src={project.overviewImage || "/placeholder.svg"}
                    alt={project.title}
                    layout="responsive"
                    width={620}
                    height={432}
                    className="object-contain rounded-3xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-0 shadow-sm rounded-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start mb-4">
                      <Clock className="w-6 h-6 text-gray-500 mr-2" />
                      <h3 className="text-2xl font-semibold">Timeline</h3>
                    </div>
                    <p className="text-lg text-gray-900">{project.timeline}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start mb-4">
                      <TeamIcon className="w-6 h-6 text-gray-500 mr-2" />
                      <h3 className="text-2xl font-semibold">Team Size</h3>
                    </div>
                    <p className="text-lg text-gray-900">{project.teamSize}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start mb-4">
                      <Code className="w-6 h-6 text-gray-500 mr-2" />
                      <h3 className="text-2xl font-semibold">Tech Stack</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(project.techStack).map(([category, technologies]) =>
                        technologies ? technologies.map((tech) => (
                          <span
                            key={`${category}-${tech}`}
                            className="px-3 py-1 bg-gray-100 rounded-full text-lg text-gray-900"
                          >
                            {tech}
                          </span>
                        )) : null
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </motion.div>

          {/* Problem Space Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section id="problem-space" className="mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-gray-800 text-left">PROBLEM SPACE</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-4">
                <div className="space-y-6">
                  <p className="text-md text-gray-700">
                    {project.problemSpace?.description || "Problem space description not available."}
                  </p>
                  <div className="flex justify-center items-center">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="bg-white border-0 shadow-sm rounded-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <Users className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="font-semibold">Target Audience</h3>
                          </div>
                          <p className="text-gray-900 mt-2">{project.problemSpace?.targetAudience || "N/A"}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white border-0 shadow-sm rounded-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <TrendingUp className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="font-semibold">Market Size</h3>
                          </div>
                          <p className="text-gray-900 mt-2">{project.problemSpace?.marketSize || "N/A"}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl">
                  <Image
                    src={project.problemSpace?.image || project.image || "/placeholder.svg"}
                    alt="Problem Space Visualization"
                    layout="responsive"
                    width={1200}
                    height={1200}
                    objectFit="cover"
                    className="rounded-3xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.problemSpace?.keyStats?.map((stat, index) => (
                  <Card key={index} className="bg-white border-0 shadow-sm rounded-lg">
                    <CardContent className="p-4 flex flex-col justify-center items-center h-full">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-4">
                          </div>
                          <div>
                            <p className="text-4xl font-bold text-blue-600 mb-2 text-center">{stat.value}</p>
                            <p className="text-xs text-gray-900 text-center">{stat.label}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Customer Discovery and Validation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section id="customer-discovery" className="mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-gray-800 text-left">DISCOVERY</h2>

              {/* Horizontal Cards with Equal Height */}
              <div className="flex flex-col md:flex-row gap-8 items-stretch mb-8">
                <Card className="bg-white border-0 shadow-sm rounded-lg">
                  <CardContent className="p-6 h-full">
                    <div className="flex items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Discovery Process</h3>
                        <p className="text-gray-900">
                          {project.customerDiscovery?.process}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-lg">
                  <CardContent className="p-6 h-full">
                    <div className="flex items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Validation Methods</h3>
                        <p className="text-gray-900">
                          {project.customerDiscovery?.validationMethods}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Images Side by Side */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative overflow-hidden rounded-2xl flex-1">
                  <Image
                    src={project.customerDiscovery?.image1 || "/placeholder.svg"}
                    alt="Discovery Image 1"
                    layout="responsive"
                    width={1200}
                    height={600}
                    className="object-cover"
                  />
                </div>
                {project.customerDiscovery?.image2 && (
                  <div className="relative overflow-hidden rounded-2xl flex-1">
                    <Image
                      src={project.customerDiscovery.image2}
                      alt="Discovery Image 2"
                      layout="responsive"
                      width={1200}
                      height={600}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                {project.customerDiscovery?.keyInsights.map((insight, index) => (
                  <Card key={index} className="bg-white border-0 shadow-sm rounded-lg">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <Lightbulb className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-sm sm:text-base text-gray-900">
                          {insight}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Painpoints Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section id="challenges" className="mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-gray-800 text-left">PAINPOINTS</h2>

              {/* Image at the Top */}
              <div className="relative overflow-hidden rounded-2xl mb-8">
                <Image
                  src={project.challengesImage || "/placeholder.svg"}
                  alt="Challenges Image"
                  layout="responsive"
                  width={1200}
                  height={600}
                  className="object-cover"
                />
              </div>

             

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                {project.challenges?.map((challenge, index) => (
                  <Card key={index} className="bg-white border-0 shadow-sm rounded-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-2">Painpoint {index + 1}</h3>
                          <p className="text-gray-900">{challenge}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </motion.div>

           {/* Conditionally render the painpoint solution image at the bottom */}
           {project.customerDiscovery?.painpointSolution && (
                <div className="relative overflow-hidden rounded-2xl mt-8 mb-16">
                  <Image
                    src={project.customerDiscovery.painpointSolution}
                    alt="Painpoint Solution Image"
                    layout="responsive"
                    width={1200}
                    height={600}
                    className="object-cover"
                  />

                </div>
              )}

          {/* Solutions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section id="solutions" className="mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-gray-800 text-left">PRODUCT DESIGN</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {project.solutions?.map((solution, index) => (
                    <Card key={index} className="bg-white border-0 shadow-sm rounded-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <Lightbulb className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-2">Feature {index + 1}</h3>
                            <p className="text-gray-900">{solution}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="relative overflow-visible rounded-3xl">
                  <Image
                    src={project.solutionsImage || project.image || "/placeholder.svg"}
                    alt="Solution visualization"
                    layout="responsive"
                    width={700}
                    height={500}
                    className="object-cover h-full rounded-3xl max-w-[450px] mx-auto"
                  />
                </div>
              </div>
            </section>

            {/* Mobile Screens Section (Only If Available) */}
            {project.mobileScreens && project.mobileScreens.length > 0 && (
                <section className="py-16 bg-transparent">
                  <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 md:flex-nowrap md:justify-between">
                      {project.mobileScreens.slice(0, 3).map((screen, index) => (
                        <motion.div
                          key={index}
                          className="relative w-[250px] md:w-[300px] h-auto shadow-lg rounded-3xl overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Image
                            src={screen.image}
                            alt={screen.description}
                            width={300}
                            height={600}
                            className="object-cover w-full h-auto"
                          />
                          <p className="mt-2 text-center text-gray-700 mt-4 mb-2 ">{screen.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
          </motion.div>

          {/* Tech Stack Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section id="tech-stack" className="mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-gray-800 text-left">TECH STACK</h2>
              <Tabs defaultValue="frontend" className="w-full">
                <TabsList className="w-full justify-start mb-6 flex space-x-2">
                  {Object.keys(project.techStack).map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-all border border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black hover:bg-gray-100"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                  <TabsTrigger
                    value="architecture"
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all border border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black hover:bg-gray-100"
                  >
                    Architecture
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all border border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black hover:bg-gray-100"
                  >
                    Code Snippets
                  </TabsTrigger>
                </TabsList>
                {Object.entries(project.techStack).map(([category, technologies]) =>
                  technologies ? (
                    <TabsContent key={category} value={category}>
                      <Card className="bg-white border-0 shadow-sm rounded-lg">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4 capitalize">{category} Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {technologies.map((tech) => (
                              <span key={tech} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ) : null
                )}
                <TabsContent value="architecture">
                  <Card className="bg-white border-0 shadow-sm rounded-lg">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Architecture Diagram</h3>
                      <div className="bg-gray-50 p-6 rounded-lg mb-4">
                        <pre className="overflow-auto">{project.architecture?.diagram}</pre>
                      </div>
                      <p className="mt-4 text-gray-900">{project.architecture?.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="code">
                  <Card className="bg-white border-0 shadow-sm rounded-lg">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Key Code Snippets</h3>
                      <div className="space-y-4">
                        {project.codeSnippets?.map((snippet, index) => (
                          <div key={index}>
                            <h4 className="font-semibold mb-2">{snippet.title}</h4>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code className="text-sm">{snippet.code}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section id="results" className="mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-gray-800 text-left">RESULTS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {Object.entries(project.results || {}).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="bg-white border-0 shadow-sm rounded-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <CheckSquare className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="text-base font-semibold capitalize mb-1">{key}</h3>
                              <span className="text-sm font-medium text-gray-900">{value}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <div className="relative overflow-visible rounded-3xl">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="w-full h-full"
                  >
                    <Image
                      src={project.resultsImage || project.image || "/placeholder.svg"}
                      alt="Project Results"
                      layout="responsive"
                      width={1200}
                      height={800}
                      objectFit="cover"
                      className="rounded-3xl max-w-[600px] mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-left text-white p-6">
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </motion.div>

          {/* Learnings Section */}
          <section id="learnings" className="mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-gray-800 text-left">LEARNINGS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Insights */}
              <Card className="bg-white border-0 shadow-sm rounded-lg">
                <CardContent className="p-8">
                  <div className="flex items-start mb-4">
                    <Lightbulb className="w-6 h-6 text-gray-500 mr-2" />
                    <h3 className="text-xl sm:text-2xl font-semibold">Technical Insights</h3>
                  </div>
                  <ul className="space-y-2">
                    {project.technicalInsights?.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <CheckSquare className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-sm sm:text-base text-gray-900">{insight}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Project Management */}
              <Card className="bg-white border-0 shadow-sm rounded-lg">
                <CardContent className="p-8">
                  <div className="flex items-start mb-4">
                    <ClipboardList className="w-6 h-6 text-gray-500 mr-2" />
                    <h3 className="text-xl sm:text-2xl font-semibold">Project Management</h3>
                  </div>
                  <ul className="space-y-2">
                    {project.projectManagement.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckSquare className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-sm sm:text-base text-gray-900">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Next Project Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section className="relative py-16 mt-16 h-full">
              <div className="absolute inset-0 z-0 h-full">
                <Image
                  src={nextProject.image || "/placeholder.svg"}
                  alt={nextProject.title}
                  fill
                  className="object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              <div className="max-w-6xl mx-auto px-4 relative z-10 h-full flex items-center justify-center">
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "16px", color: "#fff" }}>Explore More Projects</h2>
                  <Button
                    asChild
                    size="lg"
                    style={{ backgroundColor: "#000", borderRadius: "0", padding: "16px 32px", color: "#fff", textAlign: "center", textDecoration: "none", transition: "background-color 0.3s", whiteSpace: "normal", width: "100%" }}
                  >
                    <Link
                      href={`/projects/${nextProject.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/projects/${nextProject.id}`;
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });

                        // Track next project navigation event
                        if (typeof window !== 'undefined' && window.gtag) {
                          window.gtag('event', 'navigate_next_project', {
                            event_category: 'Navigation',
                            event_label: nextProject.title,
                          });
                        }
                      }}
                      style={{ display: "block", width: "100%" }}
                    >
                      <span style={{ marginRight: "8px" }}>Next Project: {nextProject.title}</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div
                className="absolute inset-0 z-1 rounded-3xl"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.2 ), rgba(0, 0, 0, 0.3) )',
                }}
              />
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
}

