import type { Metadata } from "next"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Code2,
  Images,
  Lightbulb,
  Target,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProjectGallery } from "@/components/projects/ProjectGallery"
import { StackIcon } from "@/components/stacks/StackIcon"
import { Badge } from "@/components/ui/badge"
import { getProjectImageUrl } from "@/lib/project-images"
import { getPublicProjectBySlug } from "@/lib/projects"

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    return { title: "Projeto não encontrado" }
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [ getProjectImageUrl(project.thumbnail)! ],
      type: "article",
    },
  }
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) notFound()

  const thumbnail = getProjectImageUrl(project.thumbnail)
  const publishedDate = project.published_at
    ? new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(new Date(project.published_at))
    : null

  return (
    <article className="relative isolate overflow-x-clip">
      <div className="portfolio-grid pointer-events-none absolute inset-x-0 top-0 -z-20 h-[52rem] opacity-35" />
      <div className="pointer-events-none absolute -top-52 right-[-14rem] -z-10 size-[42rem] rounded-full bg-primary/18 blur-[145px]" />
      <div className="pointer-events-none absolute top-[36rem] left-[-18rem] -z-10 size-[36rem] rounded-full bg-secondary/12 blur-[145px]" />

      <header className="mx-auto max-w-7xl px-5 pt-10 pb-12 sm:px-8 lg:px-10 lg:pt-16 lg:pb-20">
        <Link
          href="/projetos"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:-translate-x-1 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Todos os projetos
        </Link>

        <div className="mt-14 grid items-end gap-10 lg:grid-cols-[1fr_0.42fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {project.featured && (
                <>
                  <span>Projeto em destaque</span>
                  <span className="size-1 rounded-full bg-border" />
                </>
              )}
              <span>Case study</span>
            </div>
            <h1 className="mt-6 max-w-5xl text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.86] font-bold tracking-[-0.075em]">
              {project.title}
            </h1>
          </div>

          <div className="border-l border-border/70 pl-6">
            <p className="text-justify text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {publishedDate && (
                <span className="flex items-center gap-2 capitalize">
                  <CalendarDays className="size-3.5" />
                  {publishedDate}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Images className="size-3.5" />
                {project.images.length} telas
              </span>
              <span className="flex items-center gap-2">
                <Code2 className="size-3.5" />
                {project.stacks.length} tecnologias
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[90rem] px-3 sm:px-5">
        <div className="relative aspect-[16/8.5] min-h-72 overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted shadow-2xl sm:rounded-[2.25rem]">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={`Capa do projeto ${project.title}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.36fr_1fr] lg:px-10 lg:py-32">
        <div>
          <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            Contexto
          </span>
          <h2 className="mt-4 text-2xl font-semibold">Por trás do produto</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <NarrativeCard
            icon={<Target />}
            eyebrow="Objetivo"
            content={project.objective}
          />
          {project.challenge && (
            <NarrativeCard
              icon={<Lightbulb />}
              eyebrow="Desafio"
              content={project.challenge}
            />
          )}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.36fr_1fr] lg:px-10 lg:py-24">
          <div>
            <span className="text-xs font-semibold tracking-[0.22em] text-secondary uppercase">
              Tecnologia
            </span>
            <h2 className="mt-4 text-2xl font-semibold">Stack do projeto</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.stacks.map(({ stack }) => {
              const content = (
                <>
                  <StackIcon
                    stack={stack}
                    className="size-11"
                    iconClassName="size-6"
                  />
                  <span className="font-heading font-semibold">{stack.name}</span>
                  {stack.website && (
                    <ArrowUpRight className="ml-auto size-4 text-muted-foreground" />
                  )}
                </>
              )

              return stack.website ? (
                <a
                  key={stack.id}
                  href={stack.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/60 p-3 transition hover:-translate-y-0.5 hover:border-primary/35"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={stack.id}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/60 p-3"
                >
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {project.images.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              Interface
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              O produto em detalhes.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Navegue pelas principais telas e interações desenvolvidas para este projeto.
            </p>
          </div>
          <ProjectGallery images={project.images} projectTitle={project.title} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-secondary/10 p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-20 -bottom-28 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <Badge variant="outline" className="bg-background/40">
              Próximo projeto
            </Badge>
            <h2 className="mt-6 text-4xl leading-tight font-semibold tracking-[-0.05em] sm:text-6xl">
              Tem uma ideia que merece sair do papel?
            </h2>
            <Link
              href="/#sobre"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Conheça mais sobre mim
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}

function NarrativeCard({
  icon,
  eyebrow,
  content,
}: {
  icon: React.ReactNode
  eyebrow: string
  content: string
}) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6 sm:p-8">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary [&>svg]:size-5">
        {icon}
      </div>
      <span className="mt-8 block text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {eyebrow}
      </span>
      <p className="mt-4 text-justify text-lg leading-relaxed">{content}</p>
    </div>
  )
}
