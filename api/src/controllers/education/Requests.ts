import { type EducationInput } from "../../services/education/Education-services.js";

export type EducationMutationRequest = {
  Params: { education_id: string };
  Body: EducationInput;
};
