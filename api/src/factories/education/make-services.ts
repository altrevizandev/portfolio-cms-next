import { EducationRepository } from "../../repositories/Education-repository.js";
import {
  EducationAdminListService,
  EducationCreateService,
  EducationDeleteService,
  EducationPublicListService,
  EducationUpdateService,
} from "../../services/education/Education-services.js";

export function makeEducationPublicListService() {
  return new EducationPublicListService(new EducationRepository());
}

export function makeEducationAdminListService() {
  return new EducationAdminListService(new EducationRepository());
}

export function makeEducationCreateService() {
  return new EducationCreateService(new EducationRepository());
}

export function makeEducationUpdateService() {
  return new EducationUpdateService(new EducationRepository());
}

export function makeEducationDeleteService() {
  return new EducationDeleteService(new EducationRepository());
}
