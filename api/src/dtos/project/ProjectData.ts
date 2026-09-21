import type { PublicationStatus } from "../../../prisma/generated/prisma/enums.js";

export type ProjectData = {
  thumbnail: string;
  is_public: boolean;
  application_url: string | null;
  title: string;
  slug: string;
  description: string;
  objective: string;
  challenge: string | null;
  status: PublicationStatus;
  published_at: Date | null;
  featured: boolean;
  sort_order: number;
};

export type ProjectImageData = {
  path: string;
  alt_text: string | null;
  sort_order: number;
};
