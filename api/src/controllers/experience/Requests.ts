import { type ExperienceInput } from "../../services/experience/Experience-services.js";

export type ExperienceMutationRequest = {
  Params: { experience_id: string };
  Body: ExperienceInput;
};
