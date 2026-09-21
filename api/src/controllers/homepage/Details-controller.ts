import type { FastifyReply, FastifyRequest } from "fastify";
import { makeHomepageDetailsService } from "../../factories/homepage/make-services.js";
import { HomepageDetailsService } from "../../services/homepage/Details-service.js";

export class HomepageDetailsController {
  private readonly homepageDetailsService: HomepageDetailsService;

  constructor() {
    this.homepageDetailsService = makeHomepageDetailsService();
  }

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    const homepage = await this.homepageDetailsService.execute();

    return reply.code(200).send({ homepage });
  }
}
