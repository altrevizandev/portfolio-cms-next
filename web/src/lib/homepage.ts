import type { HomepageData } from "@/types/homepage"

export async function getHomepage() {
  try {
    const response = await fetch(
      `${process.env.API_INTERNAL_URL}/homepage`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json() as { homepage: HomepageData }

    return data.homepage
  } catch {
    return null
  }
}

export function getHomepageImageUrl(path?: string | null) {
  if (!path) {
    return null
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}
