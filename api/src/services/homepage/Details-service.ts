import { HomepageRepository } from "../../repositories/Homepage-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class HomepageDetailsService {
  private readonly homepageRepository: HomepageRepository;

  constructor() {
    this.homepageRepository = new HomepageRepository();
  }

  public async execute() {
    const homepages = await this.homepageRepository.findSingletonCandidates();

    if (homepages.length > 1 || (homepages[0] && homepages[0].id !== 1)) {
      throw new ApiError(
        "A configuracao da homepage viola a regra de singleton",
        409,
      );
    }

    const homepage = homepages[0];

    if (!homepage) {
      throw new ApiError("Homepage ainda nao configurada", 404);
    }

    return homepage;
  }
}
