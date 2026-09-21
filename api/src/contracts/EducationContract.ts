import type { Education } from "../../prisma/generated/prisma/client.js";
import type { EducationData } from "../dtos/education/EducationData.js";

export interface EducationContract {
  listPublic(): Promise<Education[]>;
  listAdmin(): Promise<Education[]>;
  findById(input: { education_id: string }): Promise<Education | null>;
  create(input: { data: EducationData }): Promise<Education>;
  update(input: { education_id: string; data: EducationData }): Promise<Education>;
  delete(input: { education_id: string }): Promise<Education>;
}
