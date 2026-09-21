import type { StackContract } from "../../contracts/StackContract.js";
import type { StackUpdateDTO } from "../../dtos/stack/StackUpdateDTO.js";

import { ApiError } from "../../utils/ApiError.js";
import { createSlug } from "../../utils/slug.js";

export class StackUpdateService {
  constructor(private readonly stackRepository: StackContract) {}

  public async execute(input: StackUpdateDTO) {
    const currentStack = await this.stackRepository.findById({ stack_id: input.stack_id });

    if (!currentStack) {
      throw new ApiError("Stack nao encontrada", 404);
    }

    const slug = createSlug(input.data.slug || input.data.name);

    if (!slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    const stackWithSlug = await this.stackRepository.findBySlug({ slug: slug });

    if (stackWithSlug && stackWithSlug.id !== input.stack_id) {
      throw new ApiError("Ja existe uma stack com este slug", 409);
    }

    return this.stackRepository.update({
      stack_id: input.stack_id,
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
