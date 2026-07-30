import Image from "next/image"
import { Quote } from "lucide-react"
import type { Testimonial } from "@/types/testimonial"

export function TestimonialCard({
  testimonial,
  header,
  actions,
}: {
  testimonial: Testimonial
  header?: React.ReactNode
  actions?: React.ReactNode
}) {
  const avatarUrl = testimonial.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}${testimonial.avatar}`
    : null

  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-background/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <Quote className="size-7 shrink-0 text-primary" />
        {header}
      </div>

      <blockquote className="mt-6 text-justify text-lg leading-relaxed italic text-foreground/90">
        “{testimonial.content}”
      </blockquote>

      <div className="mt-7 flex items-center gap-3 border-t border-border/60 pt-5">
        <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/12 font-heading text-sm font-bold text-primary">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`Foto de ${testimonial.author_name}`}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : initials(testimonial.author_name)}
        </span>
        <div className="min-w-0">
          <strong className="block truncate text-sm">{testimonial.author_name}</strong>
          <span className="block truncate text-xs text-muted-foreground">
            {[ testimonial.author_role, testimonial.company ].filter(Boolean).join(" · ")
              || "Sem cargo informado"}
          </span>
        </div>
      </div>

      {actions && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
          {actions}
        </div>
      )}
    </article>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}
