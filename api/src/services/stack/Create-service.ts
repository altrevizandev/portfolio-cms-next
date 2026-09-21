import type { StackContract } from "../../contracts/StackContract.js";
import type { StackCreateDTO } from "../../dtos/stack/StackDTO.js";
export type { StackInput } from "../../dtos/stack/StackDTO.js";

import { ApiError } from "../../utils/ApiError.js";
import { createSlug } from "../../utils/slug.js";

export class StackCreateService {
  constructor(private readonly stackRepository: StackContract) {}

  public async execute(input: StackCreateDTO) {
    const slug = createSlug(input.data.slug || input.data.name);

    if (!slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    if (await this.stackRepository.findBySlug({ slug: slug })) {
      throw new ApiError("Ja existe uma stack com este slug", 409);
    }

    return this.stackRepository.create({
      data: {
        name: input.data.name.trim(),
        slug,
        icon_slug: input.data.icon_slug?.trim() || null,
        color: input.data.color?.toUpperCase() || null,
        website: input.data.website?.trim() || null,
      },
    });
  }
}
