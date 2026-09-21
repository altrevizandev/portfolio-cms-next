"use client"
import { Plus, Send } from "lucide-react"
import { useRef, useState } from "react"
import Script from "next/script"
import { toast } from "sonner"
import { executeRecaptcha } from "@/lib/recaptcha"
import type { Testimonial } from "@/types/testimonial"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SectionHeading } from "@/components/portfolio/SectionHeading"
import { TestimonialCard } from "./TestimonialCard"

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const [submitting, setSubmitting] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    author_name: "",
    author_role: "",
    company: "",
    content: "",
  })
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (avatar && avatar.size > 5 * 1024 * 1024) {
      toast.error("A foto deve ter no máximo 5 MB")
      return
    }
    setSubmitting(true)
    try {
      const recaptcha_token = await executeRecaptcha("submit_testimonial")
      const payload = new FormData()
      Object.entries(form).forEach(([key, value]) => payload.append(key, value))
      payload.append("recaptcha_token", recaptcha_token)
      if (avatar) payload.append("avatar", avatar)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
        { method: "POST", body: payload }
      )
      const result = (await response.json()) as { message?: string }
      if (!response.ok)
        throw new Error(result.message || "Não foi possível enviar")
      toast.success(result.message || "Depoimento enviado. Obrigado!")
      setForm({ author_name: "", author_role: "", company: "", content: "" })
      setAvatar(null)
      if (fileInput.current) fileInput.current.value = ""
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar depoimento"
      )
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <section id="depoimentos" className="portfolio-container portfolio-section">
      {formOpen && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <SectionHeading index="04" title="Quem trabalhou comigo" />
      {testimonials.length > 0 && (
        <div className="portfolio-testimonials">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
      <details
        className="portfolio-testimonial-form"
        onToggle={(event) => setFormOpen(event.currentTarget.open)}
      >
        <summary>
          Trabalhamos juntos? Deixe um depoimento.
          <Plus size={18} aria-hidden="true" />
        </summary>
        <div className="portfolio-form-layout">
          <p>
            Conte como foi trabalhar comigo. Vou ler seu relato antes de
            publicá-lo por aqui.
          </p>
          <form onSubmit={submit} className="portfolio-form">
            <label>
              Seu nome
              <Input
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={form.author_name}
                onChange={(e) =>
                  setForm({ ...form, author_name: e.target.value })
                }
              />
            </label>
            <label>
              Cargo
              <Input
                maxLength={100}
                autoComplete="organization-title"
                value={form.author_role}
                onChange={(e) =>
                  setForm({ ...form, author_role: e.target.value })
                }
              />
            </label>
            <label className="full">
              Empresa
              <Input
                maxLength={100}
                autoComplete="organization"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className="full">
              Seu depoimento
              <Textarea
                required
                minLength={20}
                maxLength={1000}
                className="min-h-32"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </label>
            <label className="full">
              Foto opcional · JPG, PNG ou WEBP, até 5 MB
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
              />
            </label>
            <Button disabled={submitting}>
              <Send size={15} />
              {submitting ? "Enviando..." : "Enviar depoimento"}
            </Button>
          </form>
        </div>
      </details>
    </section>
  )
}
