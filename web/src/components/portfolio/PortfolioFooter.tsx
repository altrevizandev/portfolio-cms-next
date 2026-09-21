import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { ContactDialog } from "@/components/contact/ContactDialog"
export function PortfolioFooter() {
  return (
    <footer id="contato" className="portfolio-footer">
      <div className="portfolio-container">
        <div className="portfolio-contact">
          <div>
            <p className="portfolio-label">Contato /</p>
            <h2>
              Vamos conversar<span>.</span>
            </h2>
            <p>
              Um projeto, uma oportunidade ou uma boa conversa sobre software.
            </p>
          </div>
          <ContactDialog label="Enviar uma mensagem" />
        </div>
        <div className="portfolio-colophon">
          <Link href="/">André Lucas Trevizan</Link>
          <span>Desenvolvimento de software</span>
          <Link href="/sign-in">
            Acesso ao CMS <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
