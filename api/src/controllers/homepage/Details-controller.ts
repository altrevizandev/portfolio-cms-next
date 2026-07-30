import type { FastifyReply, FastifyRequest } from "fastify";
import { HomepageDetailsService } from "../../services/homepage/Details-service.js";

export class HomepageDetailsController {
  private readonly homepageDetailsService: HomepageDetailsService;

  constructor() {
    this.homepageDetailsService = new HomepageDetailsService();
  }

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    const homepage = await this.homepageDetailsService.execute();

    return reply.code(200).send({ homepage });
  }
}
