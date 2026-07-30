"use client"

import { ArrowUpRight, Send } from "lucide-react"
import { useState } from "react"
import Script from "next/script"
import Link from "next/link"
import { toast } from "sonner"
import { executeRecaptcha } from "@/lib/recaptcha"
import type { Testimonial } from "@/types/testimonial"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TestimonialCard } from "./TestimonialCard"
import { ContactDialog } from "@/components/contact/ContactDialog"

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const [submitting, setSubmitting] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [form, setForm] = useState({
    author_name: "",
    author_role: "",
    company: "",
    content: "",
  })

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const recaptcha_token = await executeRecaptcha("submit_testimonial")
      const payload = new FormData()
      Object.entries(form).forEach(([ key, value ]) => payload.append(key, value))
      payload.append("recaptcha_token", recaptcha_token)
      if (avatar) payload.append("avatar", avatar)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
        {
          method: "POST",
          body: payload,
        },
      )
      const result = await response.json() as { message?: string }
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar")
      toast.success(result.message)
      setForm({ author_name: "", author_role: "", company: "", content: "" })
      setAvatar(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar depoimento")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <section id="depoimentos" className="border-b border-border/60 bg-card/35">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1fr]">
            <div>
              <span className="text-xs font-semibold tracking-[0.24em] text-secondary uppercase">
                Depoimentos
              </span>
              <h2 className="mt-5 text-5xl leading-[0.95] font-bold tracking-[-0.06em] sm:text-6xl">
                Boas parcerias deixam marcas.
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                Relatos de pessoas que dividiram desafios, produtos e aprendizados comigo.
              </p>
            </div>

            {testimonials.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            ) : (
              <div className="flex items-center rounded-[2rem] border border-dashed border-border p-8 text-muted-foreground">
                Os primeiros depoimentos aprovados aparecerão aqui.
              </div>
            )}
          </div>

          <div className="mt-20 grid gap-10 rounded-[2rem] border border-border/70 bg-background/75 p-6 sm:p-9 lg:grid-cols-[0.7fr_1fr]">
            <div>
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">Trabalhamos juntos?</h3>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                Conte como foi a experiência. O depoimento será revisado antes de aparecer no site.
              </p>
            </div>
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <Input required minLength={2} maxLength={100} placeholder="Seu nome" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
              <Input maxLength={100} placeholder="Cargo" value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} />
              <Input className="sm:col-span-2" maxLength={100} placeholder="Empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition hover:border-primary/50 sm:col-span-2">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary">
                  {avatar ? "✓" : "AT"}
                </span>
                <span>{avatar ? avatar.name : "Adicionar uma foto (opcional)"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
                />
              </label>
              <Textarea required minLength={20} maxLength={1000} className="min-h-32 sm:col-span-2" placeholder="Escreva seu depoimento..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <Button disabled={submitting} className="rounded-full sm:col-span-2 sm:justify-self-end">
                <Send />
                {submitting ? "Enviando..." : "Enviar para moderação"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section id="contato" className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:px-10 lg:py-32">
          <span className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Próximo projeto
          </span>
          <h2 className="mx-auto mt-6 max-w-5xl text-[clamp(3.4rem,8vw,7rem)] leading-[0.9] font-bold tracking-[-0.07em]">
            Tem uma boa ideia? Vamos colocá-la no mundo.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Estou sempre aberto a conversar sobre produtos, tecnologia e desafios que valem a pena resolver.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ContactDialog />
            <Button asChild variant="outline" className="h-13 rounded-full px-7">
              <Link href="/projetos">
                Ver meus projetos
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
