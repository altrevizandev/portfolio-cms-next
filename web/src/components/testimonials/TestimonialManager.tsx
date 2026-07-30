"use client"

import { Check, RotateCcw, Trash2, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Testimonial, TestimonialStatus } from "@/types/testimonial"
import { TestimonialCard } from "./TestimonialCard"

const labels: Record<TestimonialStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
}

export function TestimonialManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [items, setItems] = useState(initialTestimonials)
  const [busy, setBusy] = useState<string | null>(null)

  async function changeStatus(id: string, status: TestimonialStatus) {
    setBusy(id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const result = await response.json() as { testimonial?: Testimonial; message?: string }
      if (!response.ok || !result.testimonial) throw new Error(result.message || "Falha ao atualizar")
      setItems((current) => current.map((item) => item.id === id ? result.testimonial! : item))
      toast.success(`Depoimento ${labels[status].toLowerCase()}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar")
    } finally {
      setBusy(null)
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este depoimento definitivamente?")) return
    setBusy(id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Falha ao excluir")
      setItems((current) => current.filter((item) => item.id !== id))
      toast.success("Depoimento excluído")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir")
    } finally {
      setBusy(null)
    }
  }

  if (items.length === 0) {
    return <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">Nenhum depoimento recebido ainda.</div>
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <TestimonialCard
          key={item.id}
          testimonial={item}
          header={
            <span className="rounded-full border border-border px-3 py-1 text-xs">
              {labels[item.status]}
            </span>
          }
          actions={
            <>
            {item.status !== "APPROVED" && <Button size="sm" onClick={() => changeStatus(item.id, "APPROVED")} disabled={busy === item.id}><Check /> Aprovar</Button>}
            {item.status !== "REJECTED" && <Button size="sm" variant="outline" onClick={() => changeStatus(item.id, "REJECTED")} disabled={busy === item.id}><X /> Rejeitar</Button>}
            {item.status !== "PENDING" && <Button size="sm" variant="ghost" onClick={() => changeStatus(item.id, "PENDING")} disabled={busy === item.id}><RotateCcw /> Reabrir</Button>}
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(item.id)} disabled={busy === item.id}><Trash2 /> Excluir</Button>
            </>
          }
        />
      ))}
    </div>
  )
}
