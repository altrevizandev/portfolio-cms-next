import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSendContactService } from "../../factories/contact/make-services.js";

import { ApiError } from "../../utils/ApiError.js";

const allowedAttachments = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export class SendContactController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    if (!request.isMultipart()) {
      throw new ApiError("A requisicao deve usar multipart/form-data", 415);
    }

    const fields: Record<string, string> = {};
    let attachment: { filename: string; content: Buffer; contentType: string } | null = null;

    for await (const part of request.parts()) {
      if (part.type === "field") {
        fields[part.fieldname] = String(part.value);
        continue;
      }
      if (part.fieldname !== "attachment" || attachment) {
        part.file.resume();
        throw new ApiError("Campo de arquivo invalido ou duplicado", 400);
      }
      if (!allowedAttachments.has(part.mimetype)) {
        part.file.resume();
        throw new ApiError("Formato de anexo invalido", 400);
      }
      const content = await part.toBuffer();
      if (part.file.truncated) {
        throw new ApiError("O anexo excede o limite de 5 MB", 413);
      }
      attachment = {
        filename: part.filename.replace(/[^\p{L}\p{N}._ -]/gu, "_"),
        content,
        contentType: part.mimetype,
      };
    }

    const parsed = z
      .strictObject({
        name: z.string().trim().min(2).max(100),
        email: z.email().max(160),
        phone: z.string().trim().max(30).optional(),
        subject: z.string().trim().min(3).max(140),
        message: z.string().trim().min(20).max(5000),
        recaptcha_token: z.string().min(1),
      })
      .safeParse(fields);

    if (!parsed.success) {
      throw new ApiError(`Dados de contato invalidos: ${z.prettifyError(parsed.error)}`, 400);
    }

    await makeSendContactService().execute({ data: parsed.data, attachment });

    return reply.code(202).send({ message: "Mensagem enviada. Responderei em breve!" });
  }
}
