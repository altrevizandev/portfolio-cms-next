import type { FastifyReply, FastifyRequest } from "fastify";
import {
  EducationAdminListService,
  EducationCreateService,
  EducationDeleteService,
  EducationPublicListService,
  EducationUpdateService,
  type EducationInput,
} from "../../services/education/Education-services.js";

export type EducationMutationRequest = {
  Params: { education_id: string };
  Body: EducationInput;
};

export class EducationPublicListController {
  private readonly service = new EducationPublicListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ education: await this.service.execute() });
  }
}

export class EducationAdminListController {
  private readonly service = new EducationAdminListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ education: await this.service.execute() });
  }
}

export class EducationCreateController {
  private readonly service = new EducationCreateService();
  async handle(request: FastifyRequest<EducationMutationRequest>, reply: FastifyReply) {
    this.service.data = request.body;
    return reply.code(201).send({ education: await this.service.execute() });
  }
}

export class EducationUpdateController {
  private readonly service = new EducationUpdateService();
  async handle(request: FastifyRequest<EducationMutationRequest>, reply: FastifyReply) {
    this.service.education_id = request.params.education_id;
    this.service.data = request.body;
    return reply.code(200).send({ education: await this.service.execute() });
  }
}

export class EducationDeleteController {
  private readonly service = new EducationDeleteService();
  async handle(request: FastifyRequest<EducationMutationRequest>, reply: FastifyReply) {
    this.service.education_id = request.params.education_id;
    await this.service.execute();
    return reply.code(204).send();
  }
}
