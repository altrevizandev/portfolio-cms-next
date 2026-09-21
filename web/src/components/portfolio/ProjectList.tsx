import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getProjectImageUrl } from "@/lib/project-images"
import type { Project } from "@/types/project"

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="portfolio-project-list">
      {projects.map((project, index) => {
        const image = getProjectImageUrl(project.thumbnail)
        const year = project.published_at
          ? new Date(project.published_at).getUTCFullYear()
          : null
        return (
          <Link
            key={project.id}
            href={`/projetos/${project.slug}`}
            className="portfolio-project"
          >
            <div className="portfolio-project-image">
              {image ? (
                <Image
                  src={image}
                  alt={`Interface de ${project.title}`}
                  fill
                  sizes="(max-width: 700px) 90vw, 420px"
                  className="object-cover"
                />
              ) : (
                <span className="portfolio-project-initial" aria-hidden="true">
                  {project.title.slice(0, 1)}
                </span>
              )}
            </div>
            <div className="portfolio-project-copy">
              <div className="portfolio-project-meta portfolio-label">
                <span>
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {project.featured ? "Em destaque" : "Projeto"}
                </span>
                {year && <span>{year}</span>}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.stacks.length > 0 && (
                <ul className="portfolio-stack-list" aria-label="Tecnologias">
                  {project.stacks.slice(0, 5).map(({ stack }) => (
                    <li key={stack.id}>{stack.name}</li>
                  ))}
                </ul>
              )}
              <span className="portfolio-project-link">
                Ver projeto <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
