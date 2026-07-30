"use client"

import { useState, type FormEvent } from "react"
import {
  BriefcaseBusiness,
  GraduationCap,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import type { Education, Experience } from "@/types/career"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type EntityType = "experience" | "education"
type CareerEntity = Experience | Education

type CommonForm = {
  start_date: string
  end_date: string
  current: boolean
  sort_order: number
  published: boolean
}

type ExperienceForm = CommonForm & {
  company: string
  role: string
  description: string
}

type EducationForm = CommonForm & {
  institution: string
  course: string
  degree: string
  description: string
}

export function CareerManager({
  initialExperiences,
  initialEducation,
}: {
  initialExperiences: Experience[]
  initialEducation: Education[]
}) {
  const [experiences, setExperiences] = useState(initialExperiences)
  const [education, setEducation] = useState(initialEducation)
  const [dialog, setDialog] = useState<{
    type: EntityType
    entity: CareerEntity | null
  } | null>(null)
  const [deleting, setDeleting] = useState<{
    type: EntityType
    entity: CareerEntity
  } | null>(null)

  const saved = (type: EntityType, entity: CareerEntity) => {
    if (type === "experience") {
      const item = entity as Experience
      setExperiences((current) => upsertSorted(current, item))
    } else {
      const item = entity as Education
      setEducation((current) => upsertSorted(current, item))
    }
    setDialog(null)
  }

  return (
    <>
      <Tabs defaultValue="experiences" className="gap-6">
        <TabsList>
          <TabsTrigger value="experiences">
            <BriefcaseBusiness />
            Experiências ({experiences.length})
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap />
            Formações ({education.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experiences">
          <CareerSection
            type="experience"
            items={experiences}
            onCreate={() => setDialog({ type: "experience", entity: null })}
            onEdit={(entity) => setDialog({ type: "experience", entity })}
            onDelete={(entity) => setDeleting({ type: "experience", entity })}
          />
        </TabsContent>

        <TabsContent value="education">
          <CareerSection
            type="education"
            items={education}
            onCreate={() => setDialog({ type: "education", entity: null })}
            onEdit={(entity) => setDialog({ type: "education", entity })}
            onDelete={(entity) => setDeleting({ type: "education", entity })}
          />
        </TabsContent>
      </Tabs>

      <CareerFormDialog
        state={dialog}
        onOpenChange={(open) => !open && setDialog(null)}
        onSaved={saved}
      />
      <DeleteCareerDialog
        state={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={(type, id) => {
          if (type === "experience") {
            setExperiences((current) => current.filter((item) => item.id !== id))
          } else {
            setEducation((current) => current.filter((item) => item.id !== id))
          }
          setDeleting(null)
        }}
      />
    </>
  )
}

function CareerSection({
  type,
  items,
  onCreate,
  onEdit,
  onDelete,
}: {
  type: EntityType
  items: CareerEntity[]
  onCreate: () => void
  onEdit: (entity: CareerEntity) => void
  onDelete: (entity: CareerEntity) => void
}) {
  const experience = type === "experience"

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus />
          {experience ? "Nova experiência" : "Nova formação"}
        </Button>
      </div>

      {items.length === 0 ? (
        <Empty className="min-h-72 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {experience ? <BriefcaseBusiness /> : <GraduationCap />}
            </EmptyMedia>
            <EmptyTitle>
              {experience ? "Nenhuma experiência cadastrada" : "Nenhuma formação cadastrada"}
            </EmptyTitle>
            <EmptyDescription>
              Adicione itens para construir sua linha do tempo pública.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((entity) => (
            <CareerCard
              key={entity.id}
              type={type}
              entity={entity}
              onEdit={() => onEdit(entity)}
              onDelete={() => onDelete(entity)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CareerCard({
  type,
  entity,
  onEdit,
  onDelete,
}: {
  type: EntityType
  entity: CareerEntity
  onEdit: () => void
  onDelete: () => void
}) {
  const title =
    type === "experience"
      ? (entity as Experience).role
      : (entity as Education).course
  const organization =
    type === "experience"
      ? (entity as Experience).company
      : (entity as Education).institution
  const description = entity.description

  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={entity.published ? "default" : "outline"}>
                {entity.published ? "Visível" : "Oculto"}
              </Badge>
              {entity.current && <Badge variant="secondary">Atual</Badge>}
            </div>
            <h2 className="mt-4 font-heading text-xl font-semibold">{title}</h2>
            <p className="mt-1 text-sm font-medium text-primary">{organization}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" onClick={onEdit}><Pencil /></Button>
            <Button variant="ghost" size="icon-sm" onClick={onDelete}><Trash2 /></Button>
          </div>
        </div>
        {description && (
          <p className="line-clamp-3 text-justify text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>{formatPeriod(entity)}</span>
          <span>Ordem {entity.sort_order}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function CareerFormDialog({
  state,
  onOpenChange,
  onSaved,
}: {
  state: { type: EntityType; entity: CareerEntity | null } | null
  onOpenChange: (open: boolean) => void
  onSaved: (type: EntityType, entity: CareerEntity) => void
}) {
  return (
    <Dialog open={Boolean(state)} onOpenChange={onOpenChange}>
      {state && (
        <CareerForm
          key={`${state.type}-${state.entity?.id ?? "new"}`}
          type={state.type}
          entity={state.entity}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  )
}

function CareerForm({
  type,
  entity,
  onSaved,
}: {
  type: EntityType
  entity: CareerEntity | null
  onSaved: (type: EntityType, entity: CareerEntity) => void
}) {
  const experience = type === "experience"
  const [form, setForm] = useState<ExperienceForm | EducationForm>(
    getInitialForm(type, entity),
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const update = (field: string, value: string | number | boolean) =>
    setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const resource = experience ? "experiences" : "education"
      const payload = {
        ...form,
        start_date: `${form.start_date}-01`,
        end_date: form.current || !form.end_date ? null : `${form.end_date}-01`,
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${resource}${entity ? `/${entity.id}` : ""}`,
        {
          method: entity ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      )
      const result = await response.json() as {
        experience?: Experience
        education?: Education
        message?: string
      }
      const savedEntity = experience ? result.experience : result.education

      if (!response.ok || !savedEntity) {
        setError(result.message ?? "Não foi possível salvar")
        return
      }

      toast.success(experience ? "Experiência salva" : "Formação salva")
      onSaved(type, savedEntity)
    } catch {
      setError("Não foi possível conectar com a API")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {entity ? "Editar" : "Adicionar"} {experience ? "experiência" : "formação"}
        </DialogTitle>
        <DialogDescription>
          O item poderá ser ordenado e ocultado da página pública.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível salvar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="career-form" className="space-y-5" onSubmit={submit}>
        {experience ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="career-role">Cargo</FieldLabel>
              <Input
                id="career-role"
                required
                value={(form as ExperienceForm).role}
                onChange={(event) => update("role", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="career-company">Empresa</FieldLabel>
              <Input
                id="career-company"
                required
                value={(form as ExperienceForm).company}
                onChange={(event) => update("company", event.target.value)}
              />
            </Field>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="career-course">Curso</FieldLabel>
                <Input
                  id="career-course"
                  required
                  value={(form as EducationForm).course}
                  onChange={(event) => update("course", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="career-institution">Instituição</FieldLabel>
                <Input
                  id="career-institution"
                  required
                  value={(form as EducationForm).institution}
                  onChange={(event) => update("institution", event.target.value)}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="career-degree">Grau / título</FieldLabel>
              <Input
                id="career-degree"
                value={(form as EducationForm).degree}
                onChange={(event) => update("degree", event.target.value)}
                placeholder="Bacharelado, Tecnólogo, Especialização..."
              />
            </Field>
          </>
        )}

        <Field>
          <FieldLabel htmlFor="career-description">Descrição</FieldLabel>
          <Textarea
            id="career-description"
            required={experience}
            rows={5}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="career-start">Início</FieldLabel>
            <Input
              id="career-start"
              type="month"
              required
              value={form.start_date}
              onChange={(event) => update("start_date", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="career-end">Fim</FieldLabel>
            <Input
              id="career-end"
              type="month"
              disabled={form.current}
              value={form.end_date}
              onChange={(event) => update("end_date", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="career-order">Ordem</FieldLabel>
            <Input
              id="career-order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(event) => update("sort_order", Number(event.target.value))}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
            <Checkbox
              checked={form.current}
              onCheckedChange={(checked) => update("current", checked === true)}
            />
            <span className="text-sm font-medium">
              {experience ? "Trabalho atualmente aqui" : "Formação em andamento"}
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
            <Checkbox
              checked={form.published}
              onCheckedChange={(checked) => update("published", checked === true)}
            />
            <span className="text-sm font-medium">Exibir na homepage</span>
          </label>
        </div>
      </form>

      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
        <Button type="submit" form="career-form" disabled={submitting}>
          {submitting && <Spinner />}
          {submitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function DeleteCareerDialog({
  state,
  onOpenChange,
  onDeleted,
}: {
  state: { type: EntityType; entity: CareerEntity } | null
  onOpenChange: (open: boolean) => void
  onDeleted: (type: EntityType, id: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const remove = async () => {
    if (!state) return
    setBusy(true)
    const resource = state.type === "experience" ? "experiences" : "education"
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${resource}/${state.entity.id}`,
        { method: "DELETE", credentials: "include" },
      )
      if (!response.ok) {
        const result = await response.json() as { message?: string }
        setError(result.message ?? "Não foi possível excluir")
        return
      }
      toast.success("Item excluído")
      onDeleted(state.type, state.entity.id)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={Boolean(state)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir este item?</DialogTitle>
          <DialogDescription>A remoção é permanente.</DialogDescription>
        </DialogHeader>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
          <Button variant="destructive" onClick={remove} disabled={busy}>
            {busy && <Spinner />}{busy ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getInitialForm(
  type: EntityType,
  entity: CareerEntity | null,
): ExperienceForm | EducationForm {
  const common: CommonForm = {
    start_date: entity?.start_date.slice(0, 7) ?? "",
    end_date: entity?.end_date?.slice(0, 7) ?? "",
    current: entity?.current ?? false,
    sort_order: entity?.sort_order ?? 0,
    published: entity?.published ?? true,
  }
  if (type === "experience") {
    const item = entity as Experience | null
    return {
      ...common,
      company: item?.company ?? "",
      role: item?.role ?? "",
      description: item?.description ?? "",
    }
  }
  const item = entity as Education | null
  return {
    ...common,
    institution: item?.institution ?? "",
    course: item?.course ?? "",
    degree: item?.degree ?? "",
    description: item?.description ?? "",
  }
}

function upsertSorted<T extends CareerEntity>(items: T[], entity: T) {
  const exists = items.some((item) => item.id === entity.id)
  const next = exists
    ? items.map((item) => item.id === entity.id ? entity : item)
    : [ ...items, entity ]
  return next.sort((a, b) => a.sort_order - b.sort_order)
}

function formatPeriod(entity: CareerEntity) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
  const start = formatter.format(new Date(entity.start_date))
  const end = entity.current
    ? "atual"
    : entity.end_date
      ? formatter.format(new Date(entity.end_date))
      : "não informado"
  return `${start} — ${end}`
}
