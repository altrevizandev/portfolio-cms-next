import type { EducationInput } from "../../dtos/education/EducationDTO.js";
import { type EducationData } from "../../dtos/education/EducationData.js";
import { ApiError } from "../../utils/ApiError.js";

export function normalize(data: EducationInput): EducationData {
  const startDate = new Date(data.start_date);
  const endDate = data.current || !data.end_date ? null : new Date(data.end_date);

  if (endDate && endDate < startDate) {
    throw new ApiError("A data final nao pode ser anterior a data inicial", 400);
  }

  return {
    institution: data.institution.trim(),
    course: data.course.trim(),
    degree: data.degree?.trim() || null,
    description: data.description?.trim() || null,
    start_date: startDate,
    end_date: endDate,
    current: data.current,
    sort_order: data.sort_order,
    published: data.published,
  };
}
