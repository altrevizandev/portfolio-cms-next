import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListRolesService } from "../../factories/roles/make-services.js";
import { ListRolesService } from "../../services/roles/List-service.js";

export class ListRolesController {
  private readonly listRolesService: ListRolesService;

  constructor() {
    this.listRolesService = makeListRolesService();
  }

  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const roles = await this.listRolesService.execute();

    return reply.code(200).send(roles);
  }
}
