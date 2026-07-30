"use client"

import { Paperclip, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { executeRecaptcha } from "@/lib/recaptcha"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactDialog({
  variant = "default",
}: {
  variant?: "default" | "outline"
}) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (attachment && attachment.size > 5 * 1024 * 1024) {
      toast.error("O anexo deve ter no máximo 5 MB")
      return
    }

    setSubmitting(true)
    try {
      const token = await executeRecaptcha("send_contact")
      const payload = new FormData()
      Object.entries(form).forEach(([ key, value ]) => payload.append(key, value))
      payload.append("recaptcha_token", token)
      if (attachment) payload.append("attachment", attachment)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        body: payload,
      })
      const result = await response.json() as { message?: string }
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar a mensagem")

      toast.success(result.message)
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
      setAttachment(null)
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar a mensagem")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className="h-13 rounded-full px-7 font-semibold transition hover:-translate-y-1"
        >
          Vamos conversar
          <Send className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[1.75rem] p-6 sm:max-w-xl sm:p-8">
        <DialogHeader>
          <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Novo projeto
          </span>
          <DialogTitle className="text-3xl tracking-[-0.04em]">Conte-me sobre a sua ideia.</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Envie um resumo do desafio. Se já tiver um escopo, pode anexá-lo à mensagem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-3 grid gap-4 sm:grid-cols-2">
          <Input required minLength={2} maxLength={100} placeholder="Seu nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input required type="email" maxLength={160} placeholder="Seu e-mail" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input type="tel" maxLength={30} className="sm:col-span-2" placeholder="WhatsApp ou telefone (opcional)" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <Input required minLength={3} maxLength={140} className="sm:col-span-2" placeholder="Assunto" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
          <Textarea required minLength={20} maxLength={5000} className="min-h-36 sm:col-span-2" placeholder="Descreva o projeto, objetivo e prazo, se houver..." value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-left text-sm text-muted-foreground transition hover:border-primary/50 sm:col-span-2">
            <Paperclip className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 truncate">
              {attachment ? attachment.name : "Anexar escopo — PDF, DOC, DOCX, TXT ou imagem (até 5 MB)"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
            />
          </label>
          <Button disabled={submitting} className="rounded-full sm:col-span-2 sm:justify-self-end">
            <Send />
            {submitting ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
