import type { HomepageContract } from "../../contracts/HomepageContract.js";
import type { HomepageUpsertDTO } from "../../dtos/homepage/HomepageDTO.js";
import { ApiError } from "../../utils/ApiError.js";
export type { HomepageUpsertData } from "../../dtos/homepage/HomepageDTO.js";

export class HomepageUpsertService {
  constructor(private readonly homepageRepository: HomepageContract) {}

  public async execute(input: HomepageUpsertDTO) {
    const homepages = await this.homepageRepository.findSingletonCandidates();

    if (homepages.length > 1 || (homepages[0] && homepages[0].id !== 1)) {
      throw new ApiError("A configuracao da homepage viola a regra de singleton", 409);
    }

    const currentHomepage = homepages[0];

    const homepage = await this.homepageRepository.upsert({
      data: {
        ...input.data,
        primary_photo: input.data.primary_photo ?? currentHomepage?.primary_photo ?? null,
        secondary_photo: input.data.secondary_photo ?? currentHomepage?.secondary_photo ?? null,
      },
    });

    return {
      homepage,
      replaced_photos: [
        input.data.primary_photo ? currentHomepage?.primary_photo : null,
        input.data.secondary_photo ? currentHomepage?.secondary_photo : null,
      ].filter((path): path is string => Boolean(path)),
    };
  }
}
