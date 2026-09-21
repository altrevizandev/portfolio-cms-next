import type { ExperienceInput } from "../../dtos/experience/ExperienceDTO.js";
import { type ExperienceData } from "../../dtos/experience/ExperienceData.js";
import { ApiError } from "../../utils/ApiError.js";

export function normalize(data: ExperienceInput): ExperienceData {
  const startDate = new Date(data.start_date);
  const endDate = data.current || !data.end_date ? null : new Date(data.end_date);

  if (endDate && endDate < startDate) {
    throw new ApiError("A data final nao pode ser anterior a data inicial", 400);
  }

  return {
    company: data.company.trim(),
    role: data.role.trim(),
    description: data.description.trim(),
    start_date: startDate,
    end_date: endDate,
    current: data.current,
    sort_order: data.sort_order,
    published: data.published,
  };
}
