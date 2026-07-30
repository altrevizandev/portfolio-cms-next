import type { Stack } from "@/types/stack"

export async function getStacks() {
  try {
    const response = await fetch(`${process.env.API_INTERNAL_URL}/stacks`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json() as { stacks: Stack[] }
    return data.stacks
  } catch {
    return []
  }
}
