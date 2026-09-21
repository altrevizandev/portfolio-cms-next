import { createTransport, type Transporter } from "nodemailer";
import type { MailContract, SendMailDTO } from "../../contracts/MailContract.js";
import { ApiError } from "../../utils/ApiError.js";
import { renderEmailTemplate } from "./render-template.js";

interface NodemailerError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
  rejected?: string[];
}

export class SendEmailService implements MailContract {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: String(process.env.MAIL_HOST),
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === "true",
      pool: true,
      maxConnections: 1,
      maxMessages: 5,
      auth: {
        user: String(process.env.MAIL_AUTH),
        pass: String(process.env.MAIL_PASS),
      },
    });
  }

  public async execute(input: SendMailDTO) {
    try {
      const html = input.template
        ? await renderEmailTemplate(input.template, input.templateData ?? {})
        : (input.html ?? "");

      await this.transporter.sendMail({
        from:
          input.from ??
          process.env.MAIL_FROM ??
          `André Lucas Trevizan <${process.env.MAIL_AUTH ?? ""}>`,
        to: input.to,
        replyTo: input.replyTo || undefined,
        subject: input.subject,
        html,
        attachments: input.attachments,
      });
    } catch (error: unknown) {
      const err = error as NodemailerError;

      switch (err.code) {
        case "ECONNECTION":
          throw new ApiError(
            `Network Error: Could not connect to the SMTP server. Check host/port configuration. ${err.message}`,
            500,
          );
        case "EAUTH":
          throw new ApiError(
            `Authentication Error: Invalid username, password, or expired OAuth2 token. ${err.message}`,
            500,
          );
        case "EENVELOPE":
          throw new ApiError(
            `Envelope Error: Missing recipients or bad "from"/"to" formatting. ${err.message} Rejected addresses: ${err.rejected}`,
            500,
          );
        case "ESTARTTLS":
          throw new ApiError(
            `TLS/SSL Error: Upgrade failed. If using a self-signed cert in dev, configure tls settings. ${err.message}`,
            500,
          );
        default:
          throw new ApiError(`Falha ao enviar o e-mail. ${err.code} - ${err.message}`, 500);
      }
    }
  }
}
