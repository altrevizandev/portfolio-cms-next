import type { HomepageContract } from "../../contracts/HomepageContract.js";

import { ApiError } from "../../utils/ApiError.js";

export class HomepageDetailsService {
  constructor(private readonly homepageRepository: HomepageContract) {}

  public async execute() {
    const homepages = await this.homepageRepository.findSingletonCandidates();

    if (homepages.length > 1 || (homepages[0] && homepages[0].id !== 1)) {
      throw new ApiError("A configuracao da homepage viola a regra de singleton", 409);
    }

    const homepage = homepages[0];

    if (!homepage) {
      throw new ApiError("Homepage ainda nao configurada", 404);
    }

    return homepage;
  }
}
