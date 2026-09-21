import { type EducationData } from "../../dtos/education/EducationData.js";

export type EducationInput = Omit<EducationData, "start_date" | "end_date"> & {
  start_date: string;
  end_date?: string | null;
};

export type EducationCreateDTO = { data: EducationInput };

export type EducationUpdateDTO = { education_id: string; data: EducationInput };

export type EducationDeleteDTO = { education_id: string };
