import type {
  Project,
  ProjectImage,
  ProjectStack,
  Stack,
} from "../../prisma/generated/prisma/client.js";

export type ProjectDetails = Project & {
  images: ProjectImage[];
  stacks: (ProjectStack & { stack: Stack })[];
};
