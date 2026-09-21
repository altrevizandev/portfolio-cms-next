import { ArrowDown, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CareerTimeline } from "@/components/career/CareerTimeline"
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter"
import { ProjectList } from "@/components/portfolio/ProjectList"
import { SectionHeading } from "@/components/portfolio/SectionHeading"
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection"
import { getPublicEducation, getPublicExperiences } from "@/lib/career"
import { getHomepage, getHomepageImageUrl } from "@/lib/homepage"
import { getPublicProjects } from "@/lib/projects"
import { getPublicTestimonials } from "@/lib/testimonials"

const fallback = {
  headline: "Desenvolvimento de software, do backend à interface.",
  subheadline: "APIs, aplicações web e as integrações entre elas.",
  biography:
    "Sou André Lucas Trevizan, desenvolvedor de software. Trabalho com Node.js, Next.js e PostgreSQL. Aqui reúno meus projetos e um pouco da minha trajetória.",
  email: null,
  github_url: null,
  linkedin_url: null,
  primary_photo: null,
  secondary_photo: null,
}
export default async function Homepage() {
  const [data, projects, experiences, education, testimonials] =
    await Promise.all([
      getHomepage(),
      getPublicProjects(),
      getPublicExperiences(),
      getPublicEducation(),
      getPublicTestimonials(),
    ])
  const homepage = data ?? fallback
  const photo = getHomepageImageUrl(homepage.primary_photo)
  const secondaryPhoto = getHomepageImageUrl(homepage.secondary_photo)
  const paragraphs = homepage.biography
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const selected = [...projects]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3)
  return (
    <div className="portfolio-surface">
      <section id="inicio" className="portfolio-container portfolio-hero">
        <div className="portfolio-hero-top portfolio-label">
          <span>Portfólio pessoal</span>
          <span>Software developer</span>
        </div>
        <div className="portfolio-hero-layout">
          <div>
            <h1>
              André Lucas
              <br />
              <span>Trevizan</span>
              <span className="portfolio-period">.</span>
            </h1>
            <p className="portfolio-hero-headline">{homepage.headline}</p>
            {homepage.subheadline && (
              <p className="portfolio-hero-description">
                {homepage.subheadline}
              </p>
            )}
            <div className="portfolio-hero-links">
              <Link href="#projetos" className="portfolio-button">
                Explorar projetos <ArrowDown size={16} aria-hidden="true" />
              </Link>
              <Link href="#sobre" className="portfolio-text-link">
                Um pouco sobre mim <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          {photo ? (
            <figure className="portfolio-portrait">
              <div>
                <Image
                  src={photo}
                  alt="André Lucas Trevizan"
                  fill
                  sizes="(max-width: 760px) 70vw, 320px"
                  className="object-cover"
                  preload
                />
              </div>
              <figcaption className="portfolio-label">
                André Lucas Trevizan / Desenvolvedor
              </figcaption>
            </figure>
          ) : (
            <aside
              className="portfolio-practice"
              aria-label="Áreas de trabalho"
            >
              <span className="portfolio-label">Do servidor à tela</span>
              <dl>
                <div>
                  <dt>01 / Backend</dt>
                  <dd>
                    Node.js <span>APIs e integrações</span>
                  </dd>
                </div>
                <div>
                  <dt>02 / Frontend</dt>
                  <dd>
                    Next.js <span>Aplicações web</span>
                  </dd>
                </div>
                <div>
                  <dt>03 / Dados</dt>
                  <dd>
                    PostgreSQL <span>Modelagem e persistência</span>
                  </dd>
                </div>
              </dl>
            </aside>
          )}
        </div>
        <div className="portfolio-hero-bottom">
          <span className="portfolio-label">
            Node.js <span aria-hidden="true">/</span> Next.js{" "}
            <span aria-hidden="true">/</span> PostgreSQL
          </span>
          <a href="#projetos" className="portfolio-label">
            Trabalhos abaixo <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section id="projetos" className="portfolio-container portfolio-section">
        <SectionHeading
          index="01"
          title="Projetos selecionados"
          note="Código em prática"
        />
        {selected.length ? (
          <ProjectList projects={selected} />
        ) : (
          <p className="portfolio-empty">
            Estou organizando os projetos para compartilhar por aqui. Enquanto
            isso, conheça um pouco do meu trabalho abaixo.
          </p>
        )}
        {projects.length > 0 && (
          <Link
            href="/projetos"
            className="portfolio-text-link portfolio-all-projects"
          >
            Todos os projetos{" "}
            <span className="portfolio-label">
              ({String(projects.length).padStart(2, "0")})
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
      </section>
      <section id="sobre" className="portfolio-container portfolio-section">
        <SectionHeading index="02" title="Sobre mim" />
        <div className="portfolio-about">
          <div className="portfolio-about-aside">
            {secondaryPhoto ? (
              <div className="portfolio-secondary-photo">
                <Image
                  src={secondaryPhoto}
                  alt="André Lucas Trevizan em seu dia a dia"
                  fill
                  sizes="(max-width: 760px) 70vw, 260px"
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="portfolio-label">
                A pessoa
                <br />
                por trás do código.
              </p>
            )}
          </div>
          <div className="portfolio-prose">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="portfolio-socials">
              {homepage.github_url && (
                <a href={homepage.github_url} target="_blank" rel="noreferrer">
                  GitHub <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {homepage.linkedin_url && (
                <a
                  href={homepage.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {homepage.email && (
                <a href={`mailto:${homepage.email}`}>
                  E-mail <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <CareerTimeline experiences={experiences} education={education} />
      <TestimonialsSection testimonials={testimonials} />
      <PortfolioFooter />
    </div>
  )
}
