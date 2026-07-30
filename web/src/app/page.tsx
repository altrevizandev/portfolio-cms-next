import {
  ArrowDownRight,
  BriefcaseBusiness,
  Code2,
  Mail,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getHomepage, getHomepageImageUrl } from "@/lib/homepage"
import { getPublicEducation, getPublicExperiences } from "@/lib/career"
import { CareerTimeline } from "@/components/career/CareerTimeline"
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection"
import { ContactDialog } from "@/components/contact/ContactDialog"
import { getPublicTestimonials } from "@/lib/testimonials"

const fallbackHomepage = {
  headline: "Construo produtos digitais com propósito.",
  subheadline: "Backend, frontend e tudo o que conecta uma boa ideia às pessoas.",
  biography:
    "Sou André Lucas Trevizan, desenvolvedor de software apaixonado por transformar problemas complexos em experiências simples, rápidas e bem construídas.",
  email: null,
  github_url: null,
  linkedin_url: null,
  primary_photo: null,
  secondary_photo: null,
}

export default async function Homepage() {
  const [ homepageData, experiences, education, testimonials ] = await Promise.all([
    getHomepage(),
    getPublicExperiences(),
    getPublicEducation(),
    getPublicTestimonials(),
  ])
  const homepage = homepageData ?? fallbackHomepage
  const primaryPhoto = getHomepageImageUrl(homepage.primary_photo)
  const secondaryPhoto = getHomepageImageUrl(homepage.secondary_photo)
  const biographyParagraphs = homepage.biography
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className="relative isolate overflow-x-clip">
      <div className="portfolio-grid pointer-events-none absolute inset-0 -z-20 opacity-50" />
      <div className="pointer-events-none absolute -top-36 right-[-18rem] -z-10 size-[42rem] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-18rem] left-[-16rem] -z-10 size-[38rem] rounded-full bg-secondary/15 blur-[150px]" />

      <section
        id="inicio"
        className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-start gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20"
      >
        <div className="flex flex-col items-start">
          <div className="mb-8 flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            <span className="size-2 rounded-full bg-secondary shadow-[0_0_18px_var(--secondary)]" />
            Disponível para criar
          </div>

          <h1 className="max-w-4xl text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.88] font-bold tracking-[-0.065em]">
            {homepage.headline}
          </h1>

          {homepage.subheadline && (
            <p className="mt-8 max-w-xl text-justify text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {homepage.subheadline}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/projetos"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_16px_45px_-18px_var(--primary)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Conheça meu trabalho
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>

            <ContactDialog variant="outline" />
          </div>
        </div>

        <PhotoComposition
          primaryPhoto={primaryPhoto}
          secondaryPhoto={secondaryPhoto}
        />
      </section>

      <section
        id="sobre"
        className="border-y border-border/60 bg-card/45 backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.42fr_1fr] lg:px-10 lg:py-28">
          <div>
            <span className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              Sobre mim
            </span>
            <p className="mt-5 font-heading text-2xl leading-tight font-semibold">
              Código é ferramenta.
              <br />
              Impacto é o objetivo.
            </p>
          </div>

          <div>
            <div className="max-w-4xl">
              <p className="text-justify font-heading text-2xl leading-[1.25] font-medium tracking-[-0.035em] sm:text-3xl lg:text-4xl">
                {biographyParagraphs[0]}
              </p>
              {biographyParagraphs.length > 1 && (
                <div className="mt-8 max-w-3xl space-y-5 border-l border-primary/40 pl-5 text-justify text-base leading-relaxed text-muted-foreground sm:pl-7 sm:text-lg">
                  {biographyParagraphs.slice(1).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {homepage.github_url && (
                <SocialLink href={homepage.github_url} label="GitHub">
                  <Code2 className="size-4" />
                </SocialLink>
              )}
              {homepage.linkedin_url && (
                <SocialLink href={homepage.linkedin_url} label="LinkedIn">
                  <BriefcaseBusiness className="size-4" />
                </SocialLink>
              )}
              {homepage.email && (
                <SocialLink href={`mailto:${homepage.email}`} label={homepage.email}>
                  <Mail className="size-4" />
                </SocialLink>
              )}
            </div>
          </div>
        </div>
      </section>

      <CareerTimeline experiences={experiences} education={education} />
      <TestimonialsSection testimonials={testimonials} />
    </div>
  )
}

function PhotoComposition({
  primaryPhoto,
  secondaryPhoto,
}: {
  primaryPhoto: string | null
  secondaryPhoto: string | null
}) {
  return (
    <div className="relative mx-auto h-[32rem] w-full max-w-[34rem] sm:h-[38rem]">
      <div className="absolute top-4 right-0 h-[78%] w-[72%] rotate-2 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/25 via-card to-secondary/20 shadow-2xl">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt="André Lucas Trevizan"
            fill
            sizes="(max-width: 1024px) 72vw, 34vw"
            className="object-cover"
            preload
          />
        ) : (
          <PhotoPlaceholder label="AT" />
        )}
      </div>

      <div className="absolute bottom-2 left-0 h-[48%] w-[48%] -rotate-3 overflow-hidden rounded-[1.65rem] border-8 border-background bg-gradient-to-br from-secondary/30 via-card to-primary/20 shadow-2xl">
        {secondaryPhoto ? (
          <Image
            src={secondaryPhoto}
            alt="André Lucas Trevizan trabalhando"
            fill
            sizes="(max-width: 1024px) 48vw, 22vw"
            className="object-cover"
          />
        ) : (
          <PhotoPlaceholder label="DEV" />
        )}
      </div>

      <div className="absolute right-3 bottom-0 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur">
        Node.js · Next.js · PostgreSQL
      </div>
    </div>
  )
}

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-heading text-6xl font-bold tracking-[-0.08em] text-foreground/20">
        {label}
      </span>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  const external = href.startsWith("http")

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background/70 px-4 text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
    >
      {children}
      {label}
    </a>
  )
}
