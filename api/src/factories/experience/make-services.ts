import { ExperienceRepository } from "../../repositories/Experience-repository.js";
import {
  ExperienceAdminListService,
  ExperienceCreateService,
  ExperienceDeleteService,
  ExperiencePublicListService,
  ExperienceUpdateService,
} from "../../services/experience/Experience-services.js";

export function makeExperiencePublicListService() {
  return new ExperiencePublicListService(new ExperienceRepository());
}

export function makeExperienceAdminListService() {
  return new ExperienceAdminListService(new ExperienceRepository());
}

export function makeExperienceCreateService() {
  return new ExperienceCreateService(new ExperienceRepository());
}

export function makeExperienceUpdateService() {
  return new ExperienceUpdateService(new ExperienceRepository());
}

export function makeExperienceDeleteService() {
  return new ExperienceDeleteService(new ExperienceRepository());
}
