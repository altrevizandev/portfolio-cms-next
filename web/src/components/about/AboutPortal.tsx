"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, Save, Sparkles, UploadCloud } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import type { HomepageData } from "@/types/homepage"
import { getHomepageImageUrl } from "@/lib/homepage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [ "image/jpeg", "image/png", "image/webp" ]

const optionalUrl = z.union([
  z.literal(""),
  z.url("Informe uma URL válida"),
])

const optionalEmail = z.union([
  z.literal(""),
  z.email("Informe um e-mail válido"),
])

const homepageSchema = z.object({
  headline: z.string().trim().min(1, "Informe o título principal"),
  subheadline: z.string(),
  biography: z.string().trim().min(1, "Informe a biografia"),
  email: optionalEmail,
  github_url: optionalUrl,
  linkedin_url: optionalUrl,
})

type HomepageFormData = z.infer<typeof homepageSchema>
type PhotoField = "primary_photo" | "secondary_photo"

export function AboutPortal({
  initialHomepage = null,
}: {
  initialHomepage?: HomepageData | null
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")
  const [photos, setPhotos] = useState<Partial<Record<PhotoField, File>>>({})
  const [previews, setPreviews] = useState<Partial<Record<PhotoField, string>>>({})

  const form = useForm<HomepageFormData>({
    resolver: zodResolver(homepageSchema),
    defaultValues: {
      headline: initialHomepage?.headline ?? "",
      subheadline: initialHomepage?.subheadline ?? "",
      biography: initialHomepage?.biography ?? "",
      email: initialHomepage?.email ?? "",
      github_url: initialHomepage?.github_url ?? "",
      linkedin_url: initialHomepage?.linkedin_url ?? "",
    },
  })

  const selectPhoto = (field: PhotoField, file?: File) => {
    if (!file) {
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Use uma imagem JPEG, PNG ou WEBP")
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("A imagem deve ter no máximo 5 MB")
      return
    }

    const currentPreview = previews[field]
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview)
    }

    setPhotos((current) => ({ ...current, [field]: file }))
    setPreviews((current) => ({
      ...current,
      [field]: URL.createObjectURL(file),
    }))
  }

  const onSubmit = async (data: HomepageFormData) => {
    setIsSubmitting(true)
    setApiError("")

    try {
      const payload = new FormData()

      Object.entries(data).forEach(([ key, value ]) => {
        payload.append(key, value)
      })

      if (photos.primary_photo) {
        payload.append("primary_photo", photos.primary_photo)
      }

      if (photos.secondary_photo) {
        payload.append("secondary_photo", photos.secondary_photo)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/homepage`,
        {
          method: "PUT",
          credentials: "include",
          body: payload,
        }
      )

      const result = await response.json() as {
        homepage?: HomepageData
        message?: string
      }

      if (!response.ok) {
        setApiError(result.message ?? "Não foi possível salvar a homepage")
        return
      }

      toast.success("Homepage atualizada com sucesso")
      Object.values(previews).forEach((preview) => URL.revokeObjectURL(preview))
      setPhotos({})
      setPreviews({})
      router.refresh()
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Conteúdo principal
              </span>
              <CardTitle className="mt-2 text-2xl">Sua apresentação</CardTitle>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Não foi possível salvar</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form
            id="homepage-form"
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="headline"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="headline">Título principal</FieldLabel>
                    <Textarea
                      {...field}
                      id="headline"
                      rows={3}
                      className="min-h-28 resize-y text-lg font-medium"
                      placeholder="Construo produtos digitais com propósito."
                    />
                    <FieldDescription>
                      A frase de maior destaque na abertura do portfólio.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[ fieldState.error ]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="subheadline"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="subheadline">Subtítulo</FieldLabel>
                    <Textarea
                      {...field}
                      id="subheadline"
                      rows={2}
                      placeholder="Uma frase curta que complementa sua apresentação."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[ fieldState.error ]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="biography"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="biography">Biografia</FieldLabel>
                    <Textarea
                      {...field}
                      id="biography"
                      rows={7}
                      className="min-h-44 resize-y"
                      placeholder="Conte um pouco sobre você, sua experiência e o que move o seu trabalho."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[ fieldState.error ]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="grid gap-5 md:grid-cols-2">
              <PhotoInput
                field="primary_photo"
                label="Foto principal"
                currentUrl={getHomepageImageUrl(initialHomepage?.primary_photo)}
                previewUrl={previews.primary_photo}
                onSelect={selectPhoto}
              />
              <PhotoInput
                field="secondary_photo"
                label="Foto secundária"
                currentUrl={getHomepageImageUrl(initialHomepage?.secondary_photo)}
                previewUrl={previews.secondary_photo}
                onSelect={selectPhoto}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">E-mail público</FieldLabel>
                    <Input {...field} id="email" type="email" placeholder="voce@exemplo.com" />
                    {fieldState.invalid && (
                      <FieldError errors={[ fieldState.error ]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="github_url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="github_url">GitHub</FieldLabel>
                    <Input {...field} id="github_url" type="url" placeholder="https://github.com/..." />
                    {fieldState.invalid && (
                      <FieldError errors={[ fieldState.error ]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="linkedin_url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="linkedin_url">LinkedIn</FieldLabel>
                    <Input {...field} id="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." />
                    {fieldState.invalid && (
                      <FieldError errors={[ fieldState.error ]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="sticky top-24 space-y-4">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
          <CardContent className="space-y-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold">
                Pronto para publicar?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Revise os textos e as fotos. A alteração aparece imediatamente na página pública.
              </p>
            </div>
            <Button
              form="homepage-form"
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Salvando...
                </>
              ) : (
                <>
                  <Save />
                  Salvar homepage
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PhotoInput({
  field,
  label,
  currentUrl,
  previewUrl,
  onSelect,
}: {
  field: PhotoField
  label: string
  currentUrl: string | null
  previewUrl?: string
  onSelect: (field: PhotoField, file?: File) => void
}) {
  const imageUrl = previewUrl ?? currentUrl

  return (
    <Field>
      <FieldLabel htmlFor={field}>{label}</FieldLabel>
      <label
        htmlFor={field}
        className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/50 transition hover:border-primary/50 hover:bg-accent/50"
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={`Preview da ${label.toLowerCase()}`}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              unoptimized={Boolean(previewUrl)}
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
              <span className="text-sm font-medium text-white">Trocar imagem</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-5 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-background text-primary shadow-sm">
              <ImagePlus className="size-5" />
            </div>
            <div>
              <span className="text-sm font-medium">Selecionar imagem</span>
              <p className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG ou WEBP · até 5 MB
              </p>
            </div>
          </div>
        )}
      </label>
      <Input
        id={field}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => onSelect(field, event.target.files?.[0])}
      />
    </Field>
  )
}
