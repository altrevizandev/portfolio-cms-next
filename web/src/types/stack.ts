export type Stack = {
  id: string
  name: string
  slug: string
  icon_slug: string | null
  color: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export type StackPayload = {
  name: string
  slug?: string
  icon_slug: string | null
  color: string | null
  website: string | null
}
