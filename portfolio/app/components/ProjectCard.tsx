import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  imageUrl: string
  projectUrl: string
}

export default function ProjectCard({ title, description, imageUrl, projectUrl }: ProjectCardProps) {
  return (
    <a
      href={projectUrl}
      className="group block bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </a>
  )
}

