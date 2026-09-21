import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter"
import { ProjectList } from "@/components/portfolio/ProjectList"
import { getPublicProjects } from "@/lib/projects"
export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos de desenvolvimento de software de André Lucas Trevizan.",
}
export default async function ProjectsPage() {
  const projects = await getPublicProjects()
  return (
    <div className="portfolio-surface">
      <div className="portfolio-container portfolio-page">
        <Link href="/" className="portfolio-text-link">
          <ArrowLeft size={15} aria-hidden="true" /> Início
        </Link>
        <header className="portfolio-page-heading">
          <p className="portfolio-label">Portfólio / Projetos</p>
          <h1>
            O trabalho<span className="portfolio-period">.</span>
          </h1>
          <div>
            <p>
              Aplicações, interfaces e os problemas que cada projeto resolve.
            </p>
            <span className="portfolio-label">
              {String(projects.length).padStart(2, "0")}{" "}
              {projects.length === 1 ? "projeto" : "projetos"}
            </span>
          </div>
        </header>
        {projects.length ? (
          <ProjectList projects={projects} />
        ) : (
          <p className="portfolio-empty">
            Os projetos estão sendo organizados. Você pode entrar em contato
            para conversar sobre meu trabalho.
          </p>
        )}
      </div>
      <PortfolioFooter />
    </div>
  )
}
