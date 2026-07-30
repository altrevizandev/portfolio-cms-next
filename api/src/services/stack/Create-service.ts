import { StackRepository } from "../../repositories/Stack-repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { createSlug } from "../../utils/slug.js";

export type StackInput = {
  name: string;
  slug?: string;
  icon_slug?: string | null;
  color?: string | null;
  website?: string | null;
};

export class StackCreateService {
  public data: StackInput = { name: "" };
  private readonly stackRepository: StackRepository;

  constructor() {
    this.stackRepository = new StackRepository();
  }

  public async execute() {
    const slug = createSlug(this.data.slug || this.data.name);

    if (!slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    this.stackRepository.slug = slug;

    if (await this.stackRepository.findBySlug()) {
      throw new ApiError("Ja existe uma stack com este slug", 409);
    }

    this.stackRepository.data = {
      name: this.data.name.trim(),
      slug,
      icon_slug: this.data.icon_slug?.trim() || null,
      color: this.data.color?.toUpperCase() || null,
      website: this.data.website?.trim() || null,
    };

    return this.stackRepository.create();
  }
}
