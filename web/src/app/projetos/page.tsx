import type { Metadata } from "next"
import { ArrowUpRight, FolderOpen, Images, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getProjectImageUrl } from "@/lib/project-images"
import { getPublicProjects } from "@/lib/projects"
import type { Project } from "@/types/project"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos de software, produtos digitais e soluções desenvolvidas por André Lucas Trevizan.",
}

export default async function ProjectsPage() {
  const projects = await getPublicProjects()

  return (
    <div className="relative isolate overflow-x-clip">
      <div className="portfolio-grid pointer-events-none absolute inset-0 -z-20 opacity-35" />
      <div className="pointer-events-none absolute -top-48 right-[-15rem] -z-10 size-[40rem] rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[32rem] left-[-20rem] -z-10 size-[38rem] rounded-full bg-secondary/10 blur-[150px]" />

      <section className="mx-auto max-w-7xl px-5 pt-20 pb-14 sm:px-8 lg:px-10 lg:pt-28 lg:pb-20">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            <Sparkles className="size-4" />
            Trabalho selecionado
          </div>
          <h1 className="mt-6 text-[clamp(3.5rem,9vw,8rem)] leading-[0.88] font-bold tracking-[-0.07em]">
            Projetos que saíram do papel.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Uma seleção de produtos e soluções em que estratégia, engenharia e experiência caminharam juntas.
          </p>
        </div>

        <div className="mt-12 flex items-center gap-4 border-t border-border/70 pt-6 text-sm text-muted-foreground">
          <span className="font-heading text-3xl font-bold text-foreground">
            {String(projects.length).padStart(2, "0")}
          </span>
          <span>
            {projects.length === 1 ? "projeto publicado" : "projetos publicados"}
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        {projects.length === 0 ? (
          <Empty className="min-h-96 border bg-card/40 backdrop-blur">
            <EmptyHeader>
              <EmptyMedia variant="icon"><FolderOpen /></EmptyMedia>
              <EmptyTitle>Os projetos estão sendo preparados</EmptyTitle>
              <EmptyDescription>
                Em breve esta página receberá novos cases e detalhes do processo de desenvolvimento.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                prominent={project.featured || index === 0}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ProjectCard({
  project,
  prominent,
}: {
  project: Project
  prominent: boolean
}) {
  const thumbnail = getProjectImageUrl(project.thumbnail)

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className={`group relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/60 shadow-sm transition duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-2xl hover:shadow-primary/10 ${
        prominent ? "lg:col-span-2" : ""
      }`}
    >
      <article
        className={
          prominent
            ? "grid min-h-[34rem] lg:grid-cols-[1.05fr_0.95fr]"
            : "flex h-full min-h-[31rem] flex-col"
        }
      >
        <div
          className={`relative overflow-hidden bg-muted ${
            prominent ? "min-h-80 lg:order-2" : "aspect-[16/10]"
          }`}
        >
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={`Capa do projeto ${project.title}`}
              fill
              sizes={prominent ? "(max-width: 1024px) 100vw, 48vw" : "50vw"}
              className="object-cover transition duration-700 group-hover:scale-[1.035]"
              priority={prominent}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <div className="absolute right-5 bottom-5 flex size-12 items-center justify-center rounded-full bg-white text-black shadow-xl transition duration-300 group-hover:rotate-6 group-hover:scale-110">
            <ArrowUpRight className="size-5" />
          </div>
        </div>

        <div className={`flex flex-1 flex-col p-6 sm:p-8 ${prominent ? "lg:p-12" : ""}`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {prominent ? "Projeto em destaque" : "Case"}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Images className="size-3.5" />
              {project.images.length}
            </span>
          </div>

          <h2
            className={`mt-8 leading-[0.98] font-semibold tracking-[-0.055em] ${
              prominent ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"
            }`}
          >
            {project.title}
          </h2>
          <p className="mt-5 line-clamp-3 max-w-xl text-justify text-sm leading-relaxed text-muted-foreground sm:text-base">
            {project.description}
          </p>

          <div className="mt-auto flex flex-wrap gap-2 pt-10">
            {project.stacks.slice(0, prominent ? 8 : 5).map(({ stack }) => (
              <Badge
                key={stack.id}
                variant="outline"
                className="bg-background/50"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: stack.color ?? "#6842E8" }}
                />
                {stack.name}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
