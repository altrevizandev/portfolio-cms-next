import { PublicationStatus } from "../../../prisma/generated/prisma/enums.js";
import type {
  ProjectData,
  ProjectImageData,
} from "../../repositories/Project-repository.js";
import { createSlug } from "../../utils/slug.js";

export type ProjectInput = {
  title: string;
  slug?: string;
  description: string;
  objective: string;
  challenge?: string | null;
  status: PublicationStatus;
  featured: boolean;
  sort_order: number;
  stack_ids: string[];
  thumbnail?: string;
  images?: ProjectImageData[];
};

export function buildProjectData(
  input: ProjectInput,
  thumbnail: string,
  currentPublishedAt: Date | null = null,
): ProjectData {
  return {
    thumbnail,
    title: input.title.trim(),
    slug: createSlug(input.slug || input.title),
    description: input.description.trim(),
    objective: input.objective.trim(),
    challenge: input.challenge?.trim() || null,
    status: input.status,
    published_at:
      input.status === PublicationStatus.PUBLISHED
        ? currentPublishedAt ?? new Date()
        : null,
    featured: input.featured,
    sort_order: input.sort_order,
  };
}
