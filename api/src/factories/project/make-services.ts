import { ProjectRepository } from "../../repositories/Project-repository.js";
import { ProjectCreateService } from "../../services/project/Create-service.js";
import { ProjectDeleteImageService } from "../../services/project/Delete-image-service.js";
import { ProjectDeleteService } from "../../services/project/Delete-service.js";
import { ProjectAdminDetailsService } from "../../services/project/Details-admin-service.js";
import { ProjectPublicDetailsService } from "../../services/project/Details-public-service.js";
import { ProjectAdminListService } from "../../services/project/List-admin-service.js";
import { ProjectPublicListService } from "../../services/project/List-public-service.js";
import { ProjectReorderImagesService } from "../../services/project/Reorder-images-service.js";
import { ProjectUpdateService } from "../../services/project/Update-service.js";

export function makeProjectCreateService() {
  return new ProjectCreateService(new ProjectRepository());
}

export function makeProjectDeleteImageService() {
  return new ProjectDeleteImageService(new ProjectRepository());
}

export function makeProjectDeleteService() {
  return new ProjectDeleteService(new ProjectRepository());
}

export function makeProjectAdminDetailsService() {
  return new ProjectAdminDetailsService(new ProjectRepository());
}

export function makeProjectPublicDetailsService() {
  return new ProjectPublicDetailsService(new ProjectRepository());
}

export function makeProjectAdminListService() {
  return new ProjectAdminListService(new ProjectRepository());
}

export function makeProjectPublicListService() {
  return new ProjectPublicListService(new ProjectRepository());
}

export function makeProjectReorderImagesService() {
  return new ProjectReorderImagesService(new ProjectRepository());
}

export function makeProjectUpdateService() {
  return new ProjectUpdateService(new ProjectRepository());
}
