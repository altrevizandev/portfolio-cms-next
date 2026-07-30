"use client"

import { useMemo, useState } from "react"
import { Code2, ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Stack, StackPayload } from "@/types/stack"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const ICON_OPTIONS = [
  [ "sap", "SAP / ABAP" ],
  [ "nodedotjs", "Node.js" ],
  [ "nextdotjs", "Next.js" ],
  [ "typescript", "TypeScript" ],
  [ "javascript", "JavaScript" ],
  [ "fastify", "Fastify" ],
  [ "postgresql", "PostgreSQL" ],
  [ "prisma", "Prisma" ],
  [ "php", "PHP" ],
  [ "bootstrap", "Bootstrap" ],
  [ "react", "React" ],
  [ "tailwindcss", "Tailwind CSS" ],
  [ "docker", "Docker" ],
  [ "git", "Git" ],
] as const

const EMPTY_FORM: StackPayload = {
  name: "",
  slug: "",
  icon_slug: null,
  color: "#6842E8",
  website: null,
}

export function StackManager({ initialStacks }: { initialStacks: Stack[] }) {
  const [stacks, setStacks] = useState(initialStacks)
  const [search, setSearch] = useState("")
  const [editingStack, setEditingStack] = useState<Stack | null>(null)
  const [deletingStack, setDeletingStack] = useState<Stack | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const filteredStacks = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return stacks
    return stacks.filter((stack) =>
      [ stack.name, stack.slug, stack.icon_slug ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    )
  }, [ search, stacks ])

  const openCreate = () => {
    setEditingStack(null)
    setFormOpen(true)
  }

  const openEdit = (stack: Stack) => {
    setEditingStack(stack)
    setFormOpen(true)
  }

  const savedStack = (stack: Stack) => {
    setStacks((current) => {
      const exists = current.some((item) => item.id === stack.id)
      const next = exists
        ? current.map((item) => item.id === stack.id ? stack : item)
        : [ ...current, stack ]
      return next.sort((a, b) => a.name.localeCompare(b.name))
    })
    setFormOpen(false)
  }

  const removedStack = (stackId: string) => {
    setStacks((current) => current.filter((stack) => stack.id !== stackId))
    setDeletingStack(null)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, slug ou ícone..."
            className="pl-9"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Nova stack
        </Button>
      </div>

      {filteredStacks.length === 0 ? (
        <Empty className="min-h-72 border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Code2 /></EmptyMedia>
            <EmptyTitle>
              {stacks.length === 0 ? "Nenhuma stack cadastrada" : "Nenhum resultado"}
            </EmptyTitle>
            <EmptyDescription>
              {stacks.length === 0
                ? "Cadastre as tecnologias que serão associadas aos seus projetos."
                : "Tente buscar por outro termo."}
            </EmptyDescription>
          </EmptyHeader>
          {stacks.length === 0 && (
            <Button onClick={openCreate}><Plus />Cadastrar primeira stack</Button>
          )}
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStacks.map((stack) => (
            <StackCard
              key={stack.id}
              stack={stack}
              onEdit={() => openEdit(stack)}
              onDelete={() => setDeletingStack(stack)}
            />
          ))}
        </div>
      )}

      <StackFormDialog
        open={formOpen}
        stack={editingStack}
        onOpenChange={setFormOpen}
        onSaved={savedStack}
      />
      <DeleteStackDialog
        stack={deletingStack}
        onOpenChange={(open) => !open && setDeletingStack(null)}
        onDeleted={removedStack}
      />
    </>
  )
}

function StackCard({
  stack,
  onEdit,
  onDelete,
}: {
  stack: Stack
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="group border-border/70 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <CardContent className="flex items-start gap-4">
        <StackIcon stack={stack} className="size-14 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate font-heading text-lg font-semibold">{stack.name}</h2>
              <p className="truncate text-xs text-muted-foreground">/{stack.slug}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" onClick={onEdit}>
                <Pencil />
                <span className="sr-only">Editar {stack.name}</span>
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onDelete}>
                <Trash2 />
                <span className="sr-only">Excluir {stack.name}</span>
              </Button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {stack.icon_slug ?? "fallback"}
            </span>
            {stack.website && (
              <a
                href={stack.website}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition hover:text-primary"
              >
                <ExternalLink className="size-4" />
                <span className="sr-only">Abrir site de {stack.name}</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StackFormDialog({
  open,
  stack,
  onOpenChange,
  onSaved,
}: {
  open: boolean
  stack: Stack | null
  onOpenChange: (open: boolean) => void
  onSaved: (stack: Stack) => void
}) {
  const initialData = stack
    ? {
        name: stack.name,
        slug: stack.slug,
        icon_slug: stack.icon_slug,
        color: stack.color,
        website: stack.website,
      }
    : EMPTY_FORM

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <StackForm
          key={stack?.id ?? "new"}
          stack={stack}
          initialData={initialData}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  )
}

function StackForm({
  stack,
  initialData,
  onSaved,
}: {
  stack: Stack | null
  initialData: StackPayload
  onSaved: (stack: Stack) => void
}) {
  const [form, setForm] = useState(initialData)
  const [slugWasEdited, setSlugWasEdited] = useState(Boolean(stack))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const setField = (field: keyof StackPayload, value: string | null) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const changeName = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      ...(!slugWasEdited && { slug: createSlug(name) }),
    }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stacks${stack ? `/${stack.id}` : ""}`,
        {
          method: stack ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            ...(form.slug?.trim() ? { slug: form.slug.trim() } : {}),
            icon_slug: form.icon_slug?.trim() || null,
            color: form.color || null,
            website: form.website?.trim() || null,
          }),
        },
      )
      const result = await response.json() as { stack?: Stack; message?: string }

      if (!response.ok || !result.stack) {
        setError(result.message ?? "Não foi possível salvar a stack")
        return
      }

      toast.success(stack ? "Stack atualizada" : "Stack cadastrada")
      onSaved(result.stack)
    } catch {
      setError("Não foi possível conectar com a API")
    } finally {
      setSubmitting(false)
    }
  }

  const previewStack: Stack = {
    id: stack?.id ?? "preview",
    name: form.name || "Stack",
    slug: form.slug || "",
    icon_slug: form.icon_slug,
    color: form.color,
    website: form.website,
    created_at: stack?.created_at ?? "",
    updated_at: stack?.updated_at ?? "",
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{stack ? "Editar stack" : "Nova stack"}</DialogTitle>
        <DialogDescription>
          Cadastre a tecnologia e defina como ela será apresentada nos projetos.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível salvar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="stack-form" className="space-y-4" onSubmit={submit}>
        <div className="flex items-center gap-4 rounded-2xl border bg-muted/30 p-4">
          <StackIcon stack={previewStack} className="size-14 rounded-2xl" />
          <div>
            <p className="font-heading font-semibold">{previewStack.name}</p>
            <p className="text-xs text-muted-foreground">
              {previewStack.icon_slug || "Fallback textual"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="stack-name">Nome</FieldLabel>
            <Input
              id="stack-name"
              value={form.name}
              onChange={(event) => changeName(event.target.value)}
              placeholder="ABAP"
              required
              maxLength={80}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="stack-slug">Slug</FieldLabel>
            <Input
              id="stack-slug"
              value={form.slug ?? ""}
              onChange={(event) => {
                setSlugWasEdited(true)
                setField("slug", createSlug(event.target.value))
              }}
              placeholder="Gerado pelo nome"
              maxLength={100}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="stack-icon">Ícone Simple Icons</FieldLabel>
          <Input
            id="stack-icon"
            list="stack-icon-options"
            value={form.icon_slug ?? ""}
            onChange={(event) => setField("icon_slug", event.target.value)}
            placeholder="sap"
            maxLength={100}
          />
          <datalist id="stack-icon-options">
            {ICON_OPTIONS.map(([ value, label ]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </datalist>
          <FieldDescription>
            Para ABAP use “sap”. Se ficar vazio, exibimos as iniciais da stack.
          </FieldDescription>
        </Field>

        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <Field>
            <FieldLabel htmlFor="stack-color">Cor</FieldLabel>
            <Input
              id="stack-color"
              type="color"
              value={form.color ?? "#6842E8"}
              onChange={(event) => setField("color", event.target.value.toUpperCase())}
              className="h-10 cursor-pointer p-1"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="stack-website">Website</FieldLabel>
            <Input
              id="stack-website"
              type="url"
              value={form.website ?? ""}
              onChange={(event) => setField("website", event.target.value)}
              placeholder="https://..."
            />
          </Field>
        </div>
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form="stack-form" disabled={submitting}>
          {submitting && <Spinner />}
          {submitting ? "Salvando..." : "Salvar stack"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function DeleteStackDialog({
  stack,
  onOpenChange,
  onDeleted,
}: {
  stack: Stack | null
  onOpenChange: (open: boolean) => void
  onDeleted: (stackId: string) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const remove = async () => {
    if (!stack) return
    setDeleting(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stacks/${stack.id}`,
        { method: "DELETE", credentials: "include" },
      )

      if (!response.ok) {
        const result = await response.json() as { message?: string }
        setError(result.message ?? "Não foi possível excluir a stack")
        return
      }

      toast.success("Stack excluída")
      onDeleted(stack.id)
    } catch {
      setError("Não foi possível conectar com a API")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={Boolean(stack)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir {stack?.name}?</DialogTitle>
          <DialogDescription>
            A exclusão será bloqueada caso a stack já esteja vinculada a algum projeto.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Não foi possível excluir</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={remove} disabled={deleting}>
            {deleting && <Spinner />}
            {deleting ? "Excluindo..." : "Excluir stack"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StackIcon({
  stack,
  className,
}: {
  stack: Pick<Stack, "name" | "icon_slug" | "color">
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const color = stack.color ?? "#6842E8"

  return (
    <div
      className={`flex items-center justify-center border ${className ?? ""}`}
      style={{ backgroundColor: `${color}18`, borderColor: `${color}45` }}
    >
      {stack.icon_slug && !failed ? (
        // O componente fica isolado para a futura troca do CDN pelo pacote local.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${encodeURIComponent(stack.icon_slug)}/${color.replace("#", "")}`}
          alt=""
          className="size-7"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-heading text-sm font-bold" style={{ color }}>
          {getInitials(stack.name)}
        </span>
      )}
    </div>
  )
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 4).toUpperCase()
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase()
}

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
