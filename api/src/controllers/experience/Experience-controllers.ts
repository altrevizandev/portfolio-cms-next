import type { FastifyReply, FastifyRequest } from "fastify";
import {
  ExperienceAdminListService,
  ExperienceCreateService,
  ExperienceDeleteService,
  ExperiencePublicListService,
  ExperienceUpdateService,
  type ExperienceInput,
} from "../../services/experience/Experience-services.js";

export type ExperienceMutationRequest = {
  Params: { experience_id: string };
  Body: ExperienceInput;
};

export class ExperiencePublicListController {
  private readonly service = new ExperiencePublicListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ experiences: await this.service.execute() });
  }
}

export class ExperienceAdminListController {
  private readonly service = new ExperienceAdminListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ experiences: await this.service.execute() });
  }
}

export class ExperienceCreateController {
  private readonly service = new ExperienceCreateService();
  async handle(request: FastifyRequest<ExperienceMutationRequest>, reply: FastifyReply) {
    this.service.data = request.body;
    return reply.code(201).send({ experience: await this.service.execute() });
  }
}

export class ExperienceUpdateController {
  private readonly service = new ExperienceUpdateService();
  async handle(request: FastifyRequest<ExperienceMutationRequest>, reply: FastifyReply) {
    this.service.experience_id = request.params.experience_id;
    this.service.data = request.body;
    return reply.code(200).send({ experience: await this.service.execute() });
  }
}

export class ExperienceDeleteController {
  private readonly service = new ExperienceDeleteService();
  async handle(request: FastifyRequest<ExperienceMutationRequest>, reply: FastifyReply) {
    this.service.experience_id = request.params.experience_id;
    await this.service.execute();
    return reply.code(204).send();
  }
}
