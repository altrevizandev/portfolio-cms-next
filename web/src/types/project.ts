import type { Stack } from "./stack"

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export type ProjectImage = {
  id: string
  path: string
  alt_text: string | null
  sort_order: number
  project_id: string
  created_at: string
  updated_at: string
}

export type ProjectStack = {
  project_id: string
  stack_id: string
  created_at: string
  stack: Stack
}

export type Project = {
  id: string
  thumbnail: string
  title: string
  slug: string
  description: string
  objective: string
  challenge: string | null
  status: PublicationStatus
  published_at: string | null
  featured: boolean
  sort_order: number
  images: ProjectImage[]
  stacks: ProjectStack[]
  created_at: string
  updated_at: string
}
