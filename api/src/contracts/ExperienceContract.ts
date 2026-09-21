import type { Experience } from "../../prisma/generated/prisma/client.js";
import type { ExperienceData } from "../dtos/experience/ExperienceData.js";

export interface ExperienceContract {
  listPublic(): Promise<Experience[]>;
  listAdmin(): Promise<Experience[]>;
  findById(input: { experience_id: string }): Promise<Experience | null>;
  create(input: { data: ExperienceData }): Promise<Experience>;
  update(input: { experience_id: string; data: ExperienceData }): Promise<Experience>;
  delete(input: { experience_id: string }): Promise<Experience>;
}
