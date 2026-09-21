"use client"

import { useState } from "react"
import { ArrowUpRight, Info, LockKeyhole } from "lucide-react"
import { Popover } from "radix-ui"

export function ProjectAccess({
  isPublic,
  url,
}: {
  isPublic: boolean
  url: string | null
}) {
  const [open, setOpen] = useState(false)

  if (isPublic && url && /^https?:\/\//i.test(url)) {
    return (
      <a
        className="portfolio-button w-fit"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Acessar <ArrowUpRight size={16} aria-hidden="true" />
        <span className="sr-only"> a aplicação (abre em nova aba)</span>
      </a>
    )
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <div
          className="flex w-fit items-center gap-2"
          onMouseEnter={() => setOpen(true)}
        >
          <button
            type="button"
            disabled
            className="portfolio-button cursor-not-allowed opacity-45"
          >
            Acessar <LockKeyhole size={15} aria-hidden="true" />
          </button>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label="Por que o acesso à aplicação é privado?"
              className="rounded-full p-2 text-muted-foreground hover:text-foreground"
            >
              <Info size={18} aria-hidden="true" />
            </button>
          </Popover.Trigger>
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-50 max-w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-popover p-4 text-sm leading-relaxed text-popover-foreground shadow-lg"
        >
          A aplicação só é acessível na rede interna do cliente.
          <Popover.Arrow className="fill-popover" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
