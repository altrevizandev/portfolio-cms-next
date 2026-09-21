import type { Project, ProjectImage } from "../../prisma/generated/prisma/client.js";
import type { ProjectData, ProjectImageData } from "../dtos/project/ProjectData.js";
import type { ProjectDetails } from "../entities/Project.js";

export interface ProjectContract {
  listPublished(): Promise<ProjectDetails[]>;
  listAdmin(): Promise<ProjectDetails[]>;
  findPublishedBySlug(input: { slug: string }): Promise<ProjectDetails | null>;
  findById(input: { project_id: string }): Promise<ProjectDetails | null>;
  findBySlug(input: { slug: string }): Promise<{ id: string } | null>;
  countStacks(input: { stack_ids: string[] }): Promise<number>;
  create(input: {
    data: ProjectData;
    stack_ids: string[];
    images: ProjectImageData[];
  }): Promise<ProjectDetails>;
  update(input: {
    project_id: string;
    data: ProjectData;
    stack_ids: string[];
    images: ProjectImageData[];
  }): Promise<ProjectDetails>;
  delete(input: { project_id: string }): Promise<Project>;
  findImageById(input: { image_id: string; project_id: string }): Promise<ProjectImage | null>;
  deleteImage(input: { image_id: string }): Promise<ProjectImage>;
  reorderImages(input: { project_id: string }, imageIds: string[]): Promise<ProjectImage[]>;
}
