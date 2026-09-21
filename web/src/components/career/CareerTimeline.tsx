import { SectionHeading } from "@/components/portfolio/SectionHeading"
import type { Education, Experience } from "@/types/career"
export function CareerTimeline({
  experiences,
  education,
}: {
  experiences: Experience[]
  education: Education[]
}) {
  if (!experiences.length && !education.length) return null
  return (
    <section id="trajetoria" className="portfolio-container portfolio-section">
      <SectionHeading index="03" title="Trajetória" />
      {experiences.length > 0 && (
        <TimelineGroup
          title="Experiência"
          items={experiences.map((item) => ({
            id: item.id,
            title: item.role,
            organization: item.company,
            description: item.description,
            period: formatPeriod(item),
            current: item.current,
          }))}
        />
      )}
      {education.length > 0 && (
        <TimelineGroup
          title="Formação"
          items={education.map((item) => ({
            id: item.id,
            title: item.course,
            organization: [item.institution, item.degree]
              .filter(Boolean)
              .join(" · "),
            description: item.description,
            period: formatPeriod(item),
            current: item.current,
          }))}
        />
      )}
    </section>
  )
}
function TimelineGroup({
  title,
  items,
}: {
  title: string
  items: {
    id: string
    title: string
    organization: string
    description: string | null
    period: string
    current: boolean
  }[]
}) {
  return (
    <div className="portfolio-timeline">
      <h3 className="portfolio-label">{title}</h3>
      <div>
        {items.map((item) => (
          <article key={item.id} className="portfolio-timeline-item">
            <div className="portfolio-timeline-date portfolio-label">
              {item.period}
              {item.current && <span>Em andamento</span>}
            </div>
            <div>
              <h4>{item.title}</h4>
              <p className="portfolio-organization">{item.organization}</p>
              {item.description && (
                <p className="portfolio-timeline-description">
                  {item.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
function formatPeriod(item: Experience | Education) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
  return `${formatter.format(new Date(item.start_date))} — ${item.current ? "atual" : item.end_date ? formatter.format(new Date(item.end_date)) : "presente"}`
}
