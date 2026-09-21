import { type ExperienceData } from "../../dtos/experience/ExperienceData.js";

export type ExperienceInput = Omit<ExperienceData, "start_date" | "end_date"> & {
  start_date: string;
  end_date?: string | null;
};

export type ExperienceCreateDTO = { data: ExperienceInput };

export type ExperienceUpdateDTO = { experience_id: string; data: ExperienceInput };

export type ExperienceDeleteDTO = { experience_id: string };
