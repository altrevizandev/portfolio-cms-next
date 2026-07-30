import type { MetadataRoute } from "next"
import { getPublicProjects } from "@/lib/projects"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const projects = await getPublicProjects()
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/projetos`, changeFrequency: "weekly", priority: 0.9 },
    ...projects.map((project) => ({
      url: `${siteUrl}/projetos/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
