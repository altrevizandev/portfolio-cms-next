import { cookies } from "next/headers"
import type { Education, Experience } from "@/types/career"

async function publicGet<T>(path: string, key: string): Promise<T[]> {
  try {
    const response = await fetch(`${process.env.API_INTERNAL_URL}/${path}`, {
      cache: "no-store",
    })
    if (!response.ok) return []
    const data = await response.json() as Record<string, T[]>
    return data[key] ?? []
  } catch {
    return []
  }
}

async function adminGet<T>(path: string, key: string): Promise<T[]> {
  try {
    const cookieStore = await cookies()
    const response = await fetch(
      `${process.env.API_INTERNAL_URL}/admin/${path}`,
      {
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
      },
    )
    if (!response.ok) return []
    const data = await response.json() as Record<string, T[]>
    return data[key] ?? []
  } catch {
    return []
  }
}

export const getPublicExperiences = () =>
  publicGet<Experience>("experiences", "experiences")
export const getPublicEducation = () =>
  publicGet<Education>("education", "education")
export const getAdminExperiences = () =>
  adminGet<Experience>("experiences", "experiences")
export const getAdminEducation = () =>
  adminGet<Education>("education", "education")
