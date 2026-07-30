import { BriefcaseBusiness, GraduationCap } from "lucide-react"
import type { Education, Experience } from "@/types/career"

const TRAJECTORY_REFERENCE_TIME = Date.now()

export function CareerTimeline({
  experiences,
  education,
}: {
  experiences: Experience[]
  education: Education[]
}) {
  if (experiences.length === 0 && education.length === 0) return null

  const companies = new Set(
    experiences.map((experience) => experience.company.trim().toLowerCase()),
  ).size
  const earliestDate = [ ...experiences, ...education ]
    .map((item) => new Date(item.start_date))
    .sort((a, b) => a.getTime() - b.getTime())[0]
  const trajectoryYears = earliestDate
    ? Math.max(
        1,
        Math.floor(
          (TRAJECTORY_REFERENCE_TIME - earliestDate.getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        ),
      )
    : 0

  return (
    <section id="trajetoria" className="relative isolate overflow-hidden border-b border-border/60">
      <div className="portfolio-grid pointer-events-none absolute inset-0 -z-20 opacity-35" />
      <div className="pointer-events-none absolute top-[-18rem] left-[-14rem] -z-10 size-[38rem] rounded-full bg-primary/15 blur-[145px]" />
      <div className="pointer-events-none absolute right-[-18rem] bottom-[-20rem] -z-10 size-[38rem] rounded-full bg-secondary/12 blur-[145px]" />

      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="grid items-end gap-12 border-b border-border/70 pb-16 lg:grid-cols-[1fr_0.52fr] lg:pb-20">
          <div>
            <span className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              Trajetória
            </span>
            <h2 className="mt-6 max-w-5xl text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.88] font-bold tracking-[-0.07em]">
              Código, produto e evolução contínua.
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Os lugares, desafios e aprendizados que moldaram a forma como construo software e transformo problemas em produtos digitais.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <TrajectoryStat
                value={`${trajectoryYears}+`}
                label="anos de trajetória"
              />
              <TrajectoryStat
                value={String(companies).padStart(2, "0")}
                label={companies === 1 ? "empresa" : "empresas"}
              />
              <TrajectoryStat
                value={String(education.length).padStart(2, "0")}
                label={education.length === 1 ? "formação" : "formações"}
              />
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[0.28fr_1fr]">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
              Linha do tempo
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Uma visão cronológica da experiência profissional e da formação acadêmica.
            </p>
          </div>

          <div className="space-y-20">
            {experiences.length > 0 && (
              <TimelineGroup
                title="Experiência profissional"
                icon={<BriefcaseBusiness />}
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
                icon={<GraduationCap />}
                items={education.map((item) => ({
                  id: item.id,
                  title: item.course,
                  organization: [ item.degree, item.institution ].filter(Boolean).join(" · "),
                  description: item.description,
                  period: formatPeriod(item),
                  current: item.current,
                }))}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function TrajectoryStat({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/50 p-3 backdrop-blur sm:p-4">
      <strong className="block font-heading text-2xl tracking-[-0.05em] sm:text-3xl">
        {value}
      </strong>
      <span className="mt-1 block text-[0.65rem] leading-tight text-muted-foreground sm:text-xs">
        {label}
      </span>
    </div>
  )
}

function TimelineGroup({
  title,
  icon,
  items,
}: {
  title: string
  icon: React.ReactNode
  items: Array<{
    id: string
    title: string
    organization: string
    description: string | null
    period: string
    current: boolean
  }>
}) {
  return (
    <div>
      <div className="mb-7 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary [&>svg]:size-4">
          {icon}
        </span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>

      <div className="relative border-l border-border pl-7 sm:pl-9">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`relative ${index < items.length - 1 ? "pb-12" : ""}`}
          >
            <span className="absolute top-1.5 -left-[2.08rem] size-2.5 rounded-full border-2 border-background bg-primary sm:-left-[2.58rem]" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-2xl font-semibold tracking-[-0.035em]">
                  {item.title}
                </h4>
                <p className="mt-1 font-medium text-primary">{item.organization}</p>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
                {item.period}
              </span>
            </div>
            {item.description && (
              <p className="mt-5 max-w-3xl whitespace-pre-line text-justify text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.description}
              </p>
            )}
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
  const start = formatter.format(new Date(item.start_date))
  const end = item.current
    ? "atual"
    : item.end_date
      ? formatter.format(new Date(item.end_date))
      : "presente"
  return `${start} — ${end}`
}
