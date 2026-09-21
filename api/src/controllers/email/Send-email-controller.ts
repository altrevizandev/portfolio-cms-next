import type { FastifyReply, FastifyRequest } from "fastify";
import { SendEmailService } from "../../services/email/send-email-service.js";

type SendEmailProps = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export type SendEmailRequest = {
  Body: SendEmailProps;
};

export class SendEmailController {
  private readonly sendEmailService: SendEmailService;

  constructor() {
    this.sendEmailService = new SendEmailService();
  }

  public async handle(request: FastifyRequest<SendEmailRequest>, reply: FastifyReply) {
    const { from, to, subject, html } = request.body;

    await this.sendEmailService.execute({
      template: "",
      html: html,
      templateData: {},
      from: from,
      to: to,
      replyTo: "",
      subject: subject,
      attachments: [],
    });
    return reply.code(204).send();
  }
}
