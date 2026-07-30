import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { z } from "zod";
import { ProjectCreateController } from "../controllers/project/Create-controller.js";
import {
  ProjectDeleteController,
  type ProjectDeleteRequest,
} from "../controllers/project/Delete-controller.js";
import {
  ProjectDeleteImageController,
  type ProjectDeleteImageRequest,
} from "../controllers/project/Delete-image-controller.js";
import {
  ProjectAdminDetailsController,
  type ProjectAdminDetailsRequest,
} from "../controllers/project/Details-admin-controller.js";
import {
  ProjectPublicDetailsController,
  type ProjectPublicDetailsRequest,
} from "../controllers/project/Details-public-controller.js";
import { ProjectAdminListController } from "../controllers/project/List-admin-controller.js";
import { ProjectPublicListController } from "../controllers/project/List-public-controller.js";
import {
  ProjectReorderImagesController,
  type ProjectReorderImagesRequest,
} from "../controllers/project/Reorder-images-controller.js";
import {
  ProjectUpdateController,
  type ProjectUpdateRequest,
} from "../controllers/project/Update-controller.js";
import { checkAdminAuth } from "../middleware/adminAuth.js";
import { checkAuth } from "../middleware/jwt.js";

const ErrorResponseSchema = z.object({
  status: z.literal("ERROR"),
  message: z.string(),
});

const StackSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  icon_slug: z.string().nullable(),
  color: z.string().nullable(),
  website: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

const ProjectImageSchema = z.object({
  id: z.uuid(),
  path: z.string(),
  alt_text: z.string().nullable(),
  sort_order: z.number(),
  project_id: z.uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

const ProjectStackSchema = z.object({
  project_id: z.uuid(),
  stack_id: z.uuid(),
  created_at: z.date(),
  stack: StackSchema,
});

const ProjectSchema = z.object({
  id: z.uuid(),
  thumbnail: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  objective: z.string(),
  challenge: z.string().nullable(),
  status: z.enum([ "DRAFT", "PUBLISHED", "ARCHIVED" ]),
  published_at: z.date().nullable(),
  featured: z.boolean(),
  sort_order: z.number(),
  images: z.array(ProjectImageSchema),
  stacks: z.array(ProjectStackSchema),
  created_at: z.date(),
  updated_at: z.date(),
});

const ProjectParamsSchema = z.object({
  project_id: z.uuid(),
});

export async function ProjectRoutes(fastify: FastifyInstance) {
  const publicListController = new ProjectPublicListController();
  const publicDetailsController = new ProjectPublicDetailsController();
  const adminListController = new ProjectAdminListController();
  const adminDetailsController = new ProjectAdminDetailsController();
  const createController = new ProjectCreateController();
  const updateController = new ProjectUpdateController();
  const deleteController = new ProjectDeleteController();
  const deleteImageController = new ProjectDeleteImageController();
  const reorderImagesController = new ProjectReorderImagesController();

  fastify.get(
    "/projects",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Lista os projetos publicados",
        response: {
          200: z.object({ projects: z.array(ProjectSchema) }),
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => publicListController.handle(request, reply),
  );

  fastify.get(
    "/projects/:slug",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Retorna um projeto publicado pelo slug",
        params: z.object({ slug: z.string().min(1) }),
        response: {
          200: z.object({ project: ProjectSchema }),
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      publicDetailsController.handle(
        request as FastifyRequest<ProjectPublicDetailsRequest>,
        reply,
      ),
  );

  fastify.get(
    "/admin/projects",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Lista todos os projetos para o CMS",
        security: [ { bearerAuth: [] } ],
        response: {
          200: z.object({ projects: z.array(ProjectSchema) }),
          401: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request, reply) => adminListController.handle(request, reply),
  );

  fastify.get(
    "/admin/projects/:project_id",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Retorna um projeto para edicao no CMS",
        security: [ { bearerAuth: [] } ],
        params: ProjectParamsSchema,
        response: {
          200: z.object({ project: ProjectSchema }),
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      adminDetailsController.handle(
        request as FastifyRequest<ProjectAdminDetailsRequest>,
        reply,
      ),
  );

  fastify.post(
    "/projects",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Cadastra um projeto via multipart/form-data",
        security: [ { bearerAuth: [] } ],
        response: {
          201: z.object({ project: ProjectSchema }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          409: ErrorResponseSchema,
          413: ErrorResponseSchema,
          415: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request, reply) => createController.handle(request, reply),
  );

  fastify.put(
    "/projects/:project_id",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Atualiza um projeto via multipart/form-data",
        security: [ { bearerAuth: [] } ],
        params: ProjectParamsSchema,
        response: {
          200: z.object({ project: ProjectSchema }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          409: ErrorResponseSchema,
          413: ErrorResponseSchema,
          415: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      updateController.handle(
        request as FastifyRequest<ProjectUpdateRequest>,
        reply,
      ),
  );

  fastify.delete(
    "/projects/:project_id",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Remove um projeto e seus arquivos",
        security: [ { bearerAuth: [] } ],
        params: ProjectParamsSchema,
        response: {
          204: z.void(),
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      deleteController.handle(
        request as FastifyRequest<ProjectDeleteRequest>,
        reply,
      ),
  );

  fastify.delete(
    "/projects/:project_id/images/:image_id",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Remove uma imagem da galeria",
        security: [ { bearerAuth: [] } ],
        params: z.object({
          project_id: z.uuid(),
          image_id: z.uuid(),
        }),
        response: {
          204: z.void(),
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      deleteImageController.handle(
        request as FastifyRequest<ProjectDeleteImageRequest>,
        reply,
      ),
  );

  fastify.patch(
    "/projects/:project_id/images/order",
    {
      schema: {
        tags: [ "Projetos" ],
        description: "Reordena todas as imagens da galeria",
        security: [ { bearerAuth: [] } ],
        params: ProjectParamsSchema,
        body: z.object({
          image_ids: z.array(z.uuid()),
        }),
        response: {
          200: z.object({ images: z.array(ProjectImageSchema) }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      reorderImagesController.handle(
        request as FastifyRequest<ProjectReorderImagesRequest>,
        reply,
      ),
  );
}
