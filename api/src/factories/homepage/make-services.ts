import { HomepageRepository } from "../../repositories/Homepage-repository.js";
import { HomepageDetailsService } from "../../services/homepage/Details-service.js";
import { HomepageUpsertService } from "../../services/homepage/Upsert-service.js";

export function makeHomepageDetailsService() {
  return new HomepageDetailsService(new HomepageRepository());
}

export function makeHomepageUpsertService() {
  return new HomepageUpsertService(new HomepageRepository());
}
