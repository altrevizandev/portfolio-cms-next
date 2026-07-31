"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import Image from "next/image"
import type { ProjectImage } from "@/types/project"
import { getProjectImageUrl } from "@/lib/project-images"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

export function ProjectGallery({
  images,
  projectTitle,
}: {
  images: ProjectImage[]
  projectTitle: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const active = images[activeIndex]

  if (!active) return null

  const previous = () =>
    setActiveIndex((current) => (current - 1 + images.length) % images.length)
  const next = () =>
    setActiveIndex((current) => (current + 1) % images.length)

  return (
    <>
      <div className="space-y-4">
        <div className="group relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted shadow-2xl shadow-primary/5">
          <Image
            src={getProjectImageUrl(active.path)!}
            alt={active.alt_text ?? `${projectTitle} — tela ${activeIndex + 1}`}
            fill
            unoptimized
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="pointer-events-none object-contain"
          />

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 pt-20 sm:p-6">
            <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              {activeIndex + 1} / {images.length}
            </span>
            <Button
              variant="secondary"
              size="icon"
              type="button"
              className="z-20 size-11 rounded-full"
              onClick={() => setExpanded(true)}
            >
              <Expand />
              <span className="sr-only">Ampliar imagem</span>
            </Button>
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                type="button"
                className="absolute top-1/2 left-4 z-20 size-11 -translate-y-1/2 rounded-full opacity-0 shadow-lg transition group-hover:opacity-100 focus:opacity-100"
                onClick={previous}
              >
                <ChevronLeft />
                <span className="sr-only">Imagem anterior</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                type="button"
                className="absolute top-1/2 right-4 z-20 size-11 -translate-y-1/2 rounded-full opacity-0 shadow-lg transition group-hover:opacity-100 focus:opacity-100"
                onClick={next}
              >
                <ChevronRight />
                <span className="sr-only">Próxima imagem</span>
              </Button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-36 ${
                  index === activeIndex
                    ? "border-primary shadow-lg shadow-primary/15"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={getProjectImageUrl(image.path)!}
                  alt=""
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          showCloseButton={false}
          className="h-[calc(100svh-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden bg-black p-0 sm:max-w-[calc(100vw-2rem)]"
        >
          <DialogTitle className="sr-only">
            Galeria ampliada de {projectTitle}
          </DialogTitle>
          <Image
            src={getProjectImageUrl(active.path)!}
            alt={active.alt_text ?? `${projectTitle} — tela ${activeIndex + 1}`}
            fill
            unoptimized
            sizes="100vw"
            className="pointer-events-none object-contain"
          />
          <Button
            variant="secondary"
            size="icon"
            type="button"
            className="absolute top-4 right-4 z-20 size-11 rounded-full"
            onClick={() => setExpanded(false)}
          >
            <X />
          </Button>
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                type="button"
                className="absolute top-1/2 left-4 z-20 size-11 -translate-y-1/2 rounded-full"
                onClick={previous}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                type="button"
                className="absolute top-1/2 right-4 z-20 size-11 -translate-y-1/2 rounded-full"
                onClick={next}
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
