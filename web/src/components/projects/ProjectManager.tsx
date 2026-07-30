"use client"

import { useMemo, useState, type FormEvent } from "react"
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Eye,
  FileImage,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import type { Project, ProjectImage, PublicationStatus } from "@/types/project"
import type { Stack } from "@/types/stack"
import { getProjectImageUrl } from "@/lib/project-images"
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

const IMAGE_TYPES = [ "image/jpeg", "image/png", "image/webp" ]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

type ProjectFormData = {
  title: string
  slug: string
  description: string
  objective: string
  challenge: string
  status: PublicationStatus
  featured: boolean
  sort_order: number
  stack_ids: string[]
}

type NewGalleryImage = {
  file: File
  preview: string
  alt: string
}

const EMPTY_FORM: ProjectFormData = {
  title: "",
  slug: "",
  description: "",
  objective: "",
  challenge: "",
  status: "DRAFT",
  featured: false,
  sort_order: 0,
  stack_ids: [],
}

export function ProjectManager({
  initialProjects,
  stacks,
}: {
  initialProjects: Project[]
  stacks: Stack[]
}) {
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"ALL" | PublicationStatus>("ALL")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesStatus = status === "ALL" || project.status === status
      const matchesSearch =
        !term ||
        project.title.toLowerCase().includes(term) ||
        project.slug.toLowerCase().includes(term) ||
        project.stacks.some(({ stack }) =>
          stack.name.toLowerCase().includes(term)
        )
      return matchesStatus && matchesSearch
    })
  }, [ projects, search, status ])

  const saved = (project: Project) => {
    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id)
      const next = exists
        ? current.map((item) => item.id === project.id ? project : item)
        : [ ...current, project ]
      return next.sort((a, b) => a.sort_order - b.sort_order)
    })
    setFormOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar projeto ou tecnologia..."
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as typeof status)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="DRAFT">Rascunhos</SelectItem>
              <SelectItem value="PUBLISHED">Publicados</SelectItem>
              <SelectItem value="ARCHIVED">Arquivados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null)
            setFormOpen(true)
          }}
        >
          <Plus />
          Novo projeto
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Empty className="min-h-80 border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><FileImage /></EmptyMedia>
            <EmptyTitle>
              {projects.length === 0 ? "Nenhum projeto cadastrado" : "Nenhum resultado"}
            </EmptyTitle>
            <EmptyDescription>
              {projects.length === 0
                ? "Cadastre seu primeiro case com imagens, objetivo e tecnologias."
                : "Ajuste os filtros para encontrar outro projeto."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {
                setEditingProject(project)
                setFormOpen(true)
              }}
              onDelete={() => setDeletingProject(project)}
            />
          ))}
        </div>
      )}

      <ProjectFormDialog
        open={formOpen}
        project={editingProject}
        stacks={stacks}
        onOpenChange={setFormOpen}
        onSaved={saved}
        onProjectChanged={saved}
      />
      <DeleteProjectDialog
        project={deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        onDeleted={(id) => {
          setProjects((current) => current.filter((item) => item.id !== id))
          setDeletingProject(null)
        }}
      />
    </>
  )
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project
  onEdit: () => void
  onDelete: () => void
}) {
  const thumbnail = getProjectImageUrl(project.thumbnail)

  return (
    <Card className="group overflow-hidden border-border/70 p-0 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`Thumbnail de ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileImage className="size-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <StatusBadge status={project.status} />
          {project.featured && (
            <Badge className="bg-amber-400 text-amber-950">
              <Star className="fill-current" />Destaque
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h2 className="font-heading text-xl font-semibold">{project.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">/{project.slug}</p>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.stacks.slice(0, 5).map(({ stack }) => (
            <Badge key={stack.id} variant="outline">{stack.name}</Badge>
          ))}
          {project.stacks.length > 5 && (
            <Badge variant="outline">+{project.stacks.length - 5}</Badge>
          )}
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {project.images.length} {project.images.length === 1 ? "imagem" : "imagens"}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" onClick={onEdit}>
              <Pencil />
              <span className="sr-only">Editar {project.title}</span>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onDelete}>
              <Trash2 />
              <span className="sr-only">Excluir {project.title}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectFormDialog({
  open,
  project,
  stacks,
  onOpenChange,
  onSaved,
  onProjectChanged,
}: {
  open: boolean
  project: Project | null
  stacks: Stack[]
  onOpenChange: (open: boolean) => void
  onSaved: (project: Project) => void
  onProjectChanged: (project: Project) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <ProjectForm
          key={project?.id ?? "new"}
          project={project}
          stacks={stacks}
          onSaved={onSaved}
          onProjectChanged={onProjectChanged}
        />
      )}
    </Dialog>
  )
}

function ProjectForm({
  project,
  stacks,
  onSaved,
  onProjectChanged,
}: {
  project: Project | null
  stacks: Stack[]
  onSaved: (project: Project) => void
  onProjectChanged: (project: Project) => void
}) {
  const [form, setForm] = useState<ProjectFormData>(
    project
      ? {
          title: project.title,
          slug: project.slug,
          description: project.description,
          objective: project.objective,
          challenge: project.challenge ?? "",
          status: project.status,
          featured: project.featured,
          sort_order: project.sort_order,
          stack_ids: project.stacks.map(({ stack_id }) => stack_id),
        }
      : EMPTY_FORM,
  )
  const [slugWasEdited, setSlugWasEdited] = useState(Boolean(project))
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [newImages, setNewImages] = useState<NewGalleryImage[]>([])
  const [existingImages, setExistingImages] = useState(project?.images ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [galleryBusy, setGalleryBusy] = useState(false)
  const [error, setError] = useState("")

  const setField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K],
  ) => setForm((current) => ({ ...current, [field]: value }))

  const changeTitle = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      ...(!slugWasEdited && { slug: createSlug(title) }),
    }))
  }

  const selectThumbnail = (file?: File) => {
    if (!file || !validateImage(file)) return
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const selectGallery = (files: FileList | null) => {
    if (!files) return
    const available = 10 - existingImages.length - newImages.length
    const selected = Array.from(files).slice(0, available)
    const valid = selected.filter(validateImage)

    if (files.length > available) {
      toast.error("A galeria aceita no máximo 10 imagens")
    }

    setNewImages((current) => [
      ...current,
      ...valid.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        alt: "",
      })),
    ])
  }

  const removeNewImage = (index: number) => {
    setNewImages((current) => {
      URL.revokeObjectURL(current[index].preview)
      return current.filter((_, currentIndex) => currentIndex !== index)
    })
  }

  const toggleStack = (stackId: string, checked: boolean) => {
    setField(
      "stack_ids",
      checked
        ? [ ...new Set([ ...form.stack_ids, stackId ]) ]
        : form.stack_ids.filter((id) => id !== stackId),
    )
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()

    if (!project && !thumbnail) {
      setError("Selecione a thumbnail do projeto")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const payload = new FormData()
      payload.set("title", form.title)
      if (form.slug) payload.set("slug", form.slug)
      payload.set("description", form.description)
      payload.set("objective", form.objective)
      payload.set("challenge", form.challenge)
      payload.set("status", form.status)
      payload.set("featured", String(form.featured))
      payload.set("sort_order", String(form.sort_order))
      payload.set("stack_ids", JSON.stringify(form.stack_ids))
      payload.set("image_alt_texts", JSON.stringify(newImages.map((image) => image.alt)))
      if (thumbnail) payload.set("thumbnail", thumbnail)
      newImages.forEach(({ file }) => payload.append("images", file))

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects${project ? `/${project.id}` : ""}`,
        {
          method: project ? "PUT" : "POST",
          credentials: "include",
          body: payload,
        },
      )
      const result = await response.json() as {
        project?: Project
        message?: string
      }

      if (!response.ok || !result.project) {
        setError(result.message ?? "Não foi possível salvar o projeto")
        return
      }

      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
      newImages.forEach(({ preview }) => URL.revokeObjectURL(preview))
      toast.success(project ? "Projeto atualizado" : "Projeto criado")
      onSaved(result.project)
    } catch {
      setError("Não foi possível conectar com a API")
    } finally {
      setSubmitting(false)
    }
  }

  const removeExistingImage = async (image: ProjectImage) => {
    if (!project) return
    setGalleryBusy(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}/images/${image.id}`,
        { method: "DELETE", credentials: "include" },
      )
      if (!response.ok) {
        const result = await response.json() as { message?: string }
        setError(result.message ?? "Não foi possível remover a imagem")
        return
      }
      const images = existingImages.filter((item) => item.id !== image.id)
      setExistingImages(images)
      onProjectChanged({ ...project, images })
      toast.success("Imagem removida")
    } finally {
      setGalleryBusy(false)
    }
  }

  const moveExistingImage = async (index: number, direction: -1 | 1) => {
    if (!project) return
    const target = index + direction
    if (target < 0 || target >= existingImages.length) return
    const next = [ ...existingImages ]
    ;[ next[index], next[target] ] = [ next[target], next[index] ]
    setGalleryBusy(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}/images/order`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_ids: next.map((image) => image.id) }),
        },
      )
      const result = await response.json() as {
        images?: ProjectImage[]
        message?: string
      }
      if (!response.ok || !result.images) {
        setError(result.message ?? "Não foi possível reordenar a galeria")
        return
      }
      setExistingImages(result.images)
      onProjectChanged({ ...project, images: result.images })
    } finally {
      setGalleryBusy(false)
    }
  }

  const currentThumbnail = thumbnailPreview ?? getProjectImageUrl(project?.thumbnail)

  return (
    <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>{project ? "Editar projeto" : "Novo projeto"}</DialogTitle>
        <DialogDescription>
          Conte a história do projeto e selecione as imagens que formarão o carrossel.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível concluir</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="project-form" className="space-y-7" onSubmit={submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="project-title">Título</FieldLabel>
            <Input
              id="project-title"
              value={form.title}
              onChange={(event) => changeTitle(event.target.value)}
              required
              maxLength={160}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="project-slug">Slug</FieldLabel>
            <Input
              id="project-slug"
              value={form.slug}
              onChange={(event) => {
                setSlugWasEdited(true)
                setField("slug", createSlug(event.target.value))
              }}
              placeholder="gerado-pelo-titulo"
              maxLength={180}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="project-description">Descrição</FieldLabel>
          <Textarea
            id="project-description"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
            rows={4}
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="project-objective">Objetivo</FieldLabel>
            <Textarea
              id="project-objective"
              value={form.objective}
              onChange={(event) => setField("objective", event.target.value)}
              rows={5}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="project-challenge">Desafio</FieldLabel>
            <Textarea
              id="project-challenge"
              value={form.challenge}
              onChange={(event) => setField("challenge", event.target.value)}
              rows={5}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={form.status}
              onValueChange={(value) => setField("status", value as PublicationStatus)}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Rascunho</SelectItem>
                <SelectItem value="PUBLISHED">Publicado</SelectItem>
                <SelectItem value="ARCHIVED">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="project-order">Ordem</FieldLabel>
            <Input
              id="project-order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(event) => setField("sort_order", Number(event.target.value))}
            />
          </Field>
          <Field className="justify-end">
            <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border px-3">
              <Checkbox
                checked={form.featured}
                onCheckedChange={(checked) => setField("featured", checked === true)}
              />
              <span className="text-sm font-medium">Projeto em destaque</span>
            </label>
          </Field>
        </div>

        <Field>
          <FieldLabel>Stacks utilizadas</FieldLabel>
          {stacks.length === 0 ? (
            <Alert>
              <AlertTitle>Nenhuma stack cadastrada</AlertTitle>
              <AlertDescription>
                Cadastre as tecnologias antes de associá-las ao projeto.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-2 rounded-xl border p-3 sm:grid-cols-2 lg:grid-cols-3">
              {stacks.map((stack) => (
                <label
                  key={stack.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-muted"
                >
                  <Checkbox
                    checked={form.stack_ids.includes(stack.id)}
                    onCheckedChange={(checked) => toggleStack(stack.id, checked === true)}
                  />
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: stack.color ?? "#6842E8" }}
                  />
                  <span className="text-sm">{stack.name}</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <div className="grid gap-6 lg:grid-cols-2">
          <Field>
            <FieldLabel>Thumbnail {project ? "" : "*"}</FieldLabel>
            <label className="group relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-muted/40">
              {currentThumbnail ? (
                <Image
                  src={currentThumbnail}
                  alt="Preview da thumbnail"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  unoptimized={Boolean(thumbnailPreview)}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="size-7" />
                  <span className="text-sm">Selecionar thumbnail</span>
                </div>
              )}
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => selectThumbnail(event.target.files?.[0])}
              />
            </label>
            <FieldDescription>JPEG, PNG ou WEBP · até 5 MB</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Adicionar imagens à galeria</FieldLabel>
            <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-muted/40 text-muted-foreground transition hover:border-primary/40">
              <ImagePlus className="size-7" />
              <span className="text-sm">Selecionar imagens</span>
              <span className="text-xs">
                {existingImages.length + newImages.length}/10 imagens
              </span>
              <Input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  selectGallery(event.target.files)
                  event.target.value = ""
                }}
                disabled={existingImages.length + newImages.length >= 10}
              />
            </label>
          </Field>
        </div>

        {(existingImages.length > 0 || newImages.length > 0) && (
          <Field>
            <FieldLabel>Galeria</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {existingImages.map((image, index) => (
                <GalleryItem
                  key={image.id}
                  src={getProjectImageUrl(image.path)!}
                  alt={image.alt_text ?? ""}
                  label={`Imagem ${index + 1}`}
                  disabled={galleryBusy}
                  onUp={index > 0 ? () => moveExistingImage(index, -1) : undefined}
                  onDown={
                    index < existingImages.length - 1
                      ? () => moveExistingImage(index, 1)
                      : undefined
                  }
                  onDelete={() => removeExistingImage(image)}
                />
              ))}
              {newImages.map((image, index) => (
                <div key={image.preview} className="space-y-2">
                  <GalleryItem
                    src={image.preview}
                    alt={image.alt}
                    label="Nova imagem"
                    onDelete={() => removeNewImage(index)}
                    local
                  />
                  <Input
                    value={image.alt}
                    maxLength={250}
                    placeholder="Texto alternativo"
                    onChange={(event) =>
                      setNewImages((current) =>
                        current.map((item, currentIndex) =>
                          currentIndex === index
                            ? { ...item, alt: event.target.value }
                            : item
                        )
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </Field>
        )}
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form="project-form" disabled={submitting || galleryBusy}>
          {submitting && <Spinner />}
          {submitting ? "Salvando..." : "Salvar projeto"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function GalleryItem({
  src,
  alt,
  label,
  disabled,
  onUp,
  onDown,
  onDelete,
  local = false,
}: {
  src: string
  alt: string
  label: string
  disabled?: boolean
  onUp?: () => void
  onDown?: () => void
  onDelete: () => void
  local?: boolean
}) {
  return (
    <div className="group relative aspect-[16/10] overflow-hidden rounded-xl border bg-muted">
      <Image
        src={src}
        alt={alt || label}
        fill
        sizes="33vw"
        className="object-cover"
        unoptimized={local}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
        <span className="text-xs font-medium text-white">{label}</span>
        <div className="flex gap-1">
          {onUp && (
            <Button type="button" size="icon-sm" variant="secondary" disabled={disabled} onClick={onUp}>
              <ArrowUp />
            </Button>
          )}
          {onDown && (
            <Button type="button" size="icon-sm" variant="secondary" disabled={disabled} onClick={onDown}>
              <ArrowDown />
            </Button>
          )}
          <Button type="button" size="icon-sm" variant="destructive" disabled={disabled} onClick={onDelete}>
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}

function DeleteProjectDialog({
  project,
  onOpenChange,
  onDeleted,
}: {
  project: Project | null
  onOpenChange: (open: boolean) => void
  onDeleted: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const remove = async () => {
    if (!project) return
    setDeleting(true)
    setError("")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}`,
        { method: "DELETE", credentials: "include" },
      )
      if (!response.ok) {
        const result = await response.json() as { message?: string }
        setError(result.message ?? "Não foi possível excluir o projeto")
        return
      }
      toast.success("Projeto excluído")
      onDeleted(project.id)
    } catch {
      setError("Não foi possível conectar com a API")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir {project?.title}?</DialogTitle>
          <DialogDescription>
            O projeto, suas relações e todos os arquivos enviados serão removidos.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Não foi possível excluir</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
          <Button variant="destructive" onClick={remove} disabled={deleting}>
            {deleting && <Spinner />}
            {deleting ? "Excluindo..." : "Excluir projeto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatusBadge({ status }: { status: PublicationStatus }) {
  if (status === "PUBLISHED") {
    return <Badge className="bg-emerald-500 text-white"><Eye />Publicado</Badge>
  }
  if (status === "ARCHIVED") {
    return <Badge variant="secondary"><Archive />Arquivado</Badge>
  }
  return <Badge variant="outline" className="bg-background/90">Rascunho</Badge>
}

function validateImage(file: File) {
  if (!IMAGE_TYPES.includes(file.type)) {
    toast.error(`${file.name}: formato inválido`)
    return false
  }
  if (file.size > MAX_IMAGE_SIZE) {
    toast.error(`${file.name}: a imagem excede 5 MB`)
    return false
  }
  return true
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
