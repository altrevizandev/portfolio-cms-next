export function SectionHeading({
  index,
  title,
  note,
}: {
  index: string
  title: string
  note?: string
}) {
  return (
    <div className="portfolio-section-heading">
      <span className="portfolio-label" aria-hidden="true">
        {index} /
      </span>
      <h2>{title}</h2>
      {note && <p className="portfolio-label">{note}</p>}
    </div>
  )
}
