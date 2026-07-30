import { cookies } from "next/headers"
import type { Project } from "@/types/project"

export async function getAdminProjects() {
  try {
    const cookieStore = await cookies()
    const response = await fetch(
      `${process.env.API_INTERNAL_URL}/admin/projects`,
      {
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
      },
    )

    if (!response.ok) return []

    const data = await response.json() as { projects: Project[] }
    return data.projects
  } catch {
    return []
  }
}

export async function getPublicProjects() {
  try {
    const response = await fetch(`${process.env.API_INTERNAL_URL}/projects`, {
      cache: "no-store",
    })

    if (!response.ok) return []

    const data = await response.json() as { projects: Project[] }
    return data.projects
  } catch {
    return []
  }
}

export async function getPublicProjectBySlug(slug: string) {
  try {
    const response = await fetch(
      `${process.env.API_INTERNAL_URL}/projects/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    )

    if (!response.ok) return null

    const data = await response.json() as { project: Project }
    return data.project
  } catch {
    return null
  }
}
