import { StackRepository } from "../../repositories/Stack-repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { createSlug } from "../../utils/slug.js";
import type { StackInput } from "./Create-service.js";

export class StackUpdateService {
  public stack_id = "";
  public data: StackInput = { name: "" };
  private readonly stackRepository: StackRepository;

  constructor() {
    this.stackRepository = new StackRepository();
  }

  public async execute() {
    this.stackRepository.stack_id = this.stack_id;

    const currentStack = await this.stackRepository.findById();

    if (!currentStack) {
      throw new ApiError("Stack nao encontrada", 404);
    }

    const slug = createSlug(this.data.slug || this.data.name);

    if (!slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    this.stackRepository.slug = slug;
    const stackWithSlug = await this.stackRepository.findBySlug();

    if (stackWithSlug && stackWithSlug.id !== this.stack_id) {
      throw new ApiError("Ja existe uma stack com este slug", 409);
    }

    this.stackRepository.data = {
      name: this.data.name.trim(),
      slug,
      icon_slug: this.data.icon_slug?.trim() || null,
      color: this.data.color?.toUpperCase() || null,
      website: this.data.website?.trim() || null,
    };

    return this.stackRepository.update();
  }
}
