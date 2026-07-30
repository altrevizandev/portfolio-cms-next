import {
  HomepageRepository,
  type HomepageData,
} from "../../repositories/Homepage-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export type HomepageUpsertData = Omit<
  HomepageData,
  "primary_photo" | "secondary_photo"
> & {
  primary_photo?: string;
  secondary_photo?: string;
};

export class HomepageUpsertService {
  public data: HomepageUpsertData = {
    headline: "",
    subheadline: null,
    biography: "",
    email: null,
    github_url: null,
    linkedin_url: null,
  };

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

    const currentHomepage = homepages[0];

    this.homepageRepository.data = {
      ...this.data,
      primary_photo:
        this.data.primary_photo ?? currentHomepage?.primary_photo ?? null,
      secondary_photo:
        this.data.secondary_photo ?? currentHomepage?.secondary_photo ?? null,
    };

    const homepage = await this.homepageRepository.upsert();

    return {
      homepage,
      replaced_photos: [
        this.data.primary_photo ? currentHomepage?.primary_photo : null,
        this.data.secondary_photo ? currentHomepage?.secondary_photo : null,
      ].filter((path): path is string => Boolean(path)),
    };
  }
}
