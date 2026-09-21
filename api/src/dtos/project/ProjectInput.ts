import type { PublicationStatus } from "../../../prisma/generated/prisma/enums.js";
import type { ProjectImageData } from "./ProjectData.js";

export type ProjectInput = {
  is_public?: boolean;
  application_url?: string | null;
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
