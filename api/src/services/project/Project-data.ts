import { PublicationStatus } from "../../../prisma/generated/prisma/enums.js";
import type { ProjectData } from "../../dtos/project/ProjectData.js";
import type { ProjectInput } from "../../dtos/project/ProjectInput.js";
import { ApiError } from "../../utils/ApiError.js";
import { createSlug } from "../../utils/slug.js";
export type { ProjectInput } from "../../dtos/project/ProjectInput.js";

export function buildProjectData(
  input: ProjectInput,
  thumbnail: string,
  currentPublishedAt: Date | null = null,
): ProjectData {
  const isPublic = input.is_public ?? false;
  const applicationUrl = isPublic ? input.application_url?.trim() || null : null;
  if (isPublic) {
    let valid = false;
    try {
      const url = new URL(applicationUrl ?? "");
      valid = ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
    } catch {}
    if (!valid) throw new ApiError("Informe um link HTTP ou HTTPS válido para a aplicação pública", 400);
  }
  return {
    is_public: isPublic,
    application_url: applicationUrl,
    thumbnail,
    title: input.title.trim(),
    slug: createSlug(input.slug || input.title),
    description: input.description.trim(),
    objective: input.objective.trim(),
    challenge: input.challenge?.trim() || null,
    status: input.status,
    published_at:
      input.status === PublicationStatus.PUBLISHED ? (currentPublishedAt ?? new Date()) : null,
    featured: input.featured,
    sort_order: input.sort_order,
  };
}
