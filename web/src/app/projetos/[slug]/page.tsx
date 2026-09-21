import type { Metadata } from "next"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProjectAccess } from "@/components/projects/ProjectAccess"
import { ProjectGallery } from "@/components/projects/ProjectGallery"
import { StackIcon } from "@/components/stacks/StackIcon"
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter"
import { getProjectImageUrl } from "@/lib/project-images"
import { getPublicProjectBySlug } from "@/lib/projects"
type ProjectPageProps = { params: Promise<{ slug: string }> }
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)
  if (!project) return { title: "Projeto não encontrado" }
  const image = getProjectImageUrl(project.thumbnail)
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: image ? [image] : [],
      type: "article",
    },
  }
}
export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)
  if (!project) notFound()
  const thumbnail = getProjectImageUrl(project.thumbnail)
  const date = project.published_at
    ? new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(project.published_at))
    : null
  return (
    <div className="portfolio-surface">
      <article className="portfolio-container portfolio-page">
        <Link href="/projetos" className="portfolio-text-link">
          <ArrowLeft size={15} aria-hidden="true" /> Todos os projetos
        </Link>
        <header className="portfolio-page-heading">
          <p className="portfolio-label">
            Projeto / {project.featured ? "Em destaque" : "Portfólio"}
          </p>
          <h1>
            {project.title}
            <span className="portfolio-period">.</span>
          </h1>
          <div>
            <p>{project.description}</p>
            {date && <span className="portfolio-label">{date}</span>}
          </div>
          <section aria-label="Acesso à aplicação" className="mt-6">
            <ProjectAccess
              isPublic={project.is_public}
              url={project.application_url}
            />
          </section>
        </header>
        {thumbnail && (
          <div className="portfolio-case-cover">
            <Image
              src={thumbnail}
              alt={`Interface de ${project.title}`}
              fill
              sizes="(max-width: 760px) 95vw, 1160px"
              preload
            />
          </div>
        )}
        <section className="portfolio-case-section">
          <h2 className="portfolio-label">01 / Contexto</h2>
          <div>
            <h3>O objetivo</h3>
            <p>{project.objective}</p>
            {project.challenge && (
              <>
                <h3>O desafio</h3>
                <p>{project.challenge}</p>
              </>
            )}
          </div>
        </section>
        {project.stacks.length > 0 && (
          <section className="portfolio-case-section">
            <h2 className="portfolio-label">02 / Tecnologias</h2>
            <div className="portfolio-case-stacks">
              {project.stacks.map(({ stack }) => {
                const content = (
                  <>
                    <StackIcon
                      stack={stack}
                      className="size-8 rounded-sm"
                      iconClassName="size-5"
                    />
                    <span>{stack.name}</span>
                    {stack.website && (
                      <ArrowUpRight size={14} aria-hidden="true" />
                    )}
                  </>
                )
                return stack.website ? (
                  <a
                    key={stack.id}
                    href={stack.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={stack.id}>{content}</div>
                )
              })}
            </div>
          </section>
        )}
        {project.images.length > 0 && (
          <section className="portfolio-case-gallery">
            <h2>O projeto em detalhes</h2>
            <ProjectGallery
              images={project.images}
              projectTitle={project.title}
            />
          </section>
        )}
      </article>
      <PortfolioFooter />
    </div>
  )
}
