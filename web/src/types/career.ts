export type Experience = {
  id: string
  company: string
  role: string
  description: string
  start_date: string
  end_date: string | null
  current: boolean
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type Education = {
  id: string
  institution: string
  course: string
  degree: string | null
  description: string | null
  start_date: string
  end_date: string | null
  current: boolean
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}
