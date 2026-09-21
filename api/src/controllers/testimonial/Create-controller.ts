import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeTestimonialCreateService } from "../../factories/testimonial/make-services.js";
import { ApiError } from "../../utils/ApiError.js";
import { removeUploadedFile, saveImageUpload } from "../../utils/uploads.js";

export class TestimonialCreateController {
  private readonly service = makeTestimonialCreateService();
  async handle(request: FastifyRequest, reply: FastifyReply) {
    if (!request.isMultipart()) {
      throw new ApiError("A requisicao deve usar multipart/form-data", 415);
    }

    const fields: Record<string, string> = {};
    let avatar: string | null = null;

    try {
      for await (const part of request.parts()) {
        if (part.type === "field") {
          fields[part.fieldname] = String(part.value);
          continue;
        }
        if (part.fieldname !== "avatar" || avatar) {
          part.file.resume();
          throw new ApiError("Campo de arquivo invalido ou duplicado", 400);
        }
        avatar = await saveImageUpload(part, "testimonials");
      }

      const parsed = z
        .strictObject({
          author_name: z.string().trim().min(2).max(100),
          author_role: z.string().trim().max(100).optional(),
          company: z.string().trim().max(100).optional(),
          content: z.string().trim().min(20).max(1000),
          recaptcha_token: z.string().min(1),
        })
        .safeParse(fields);

      if (!parsed.success) {
        throw new ApiError(`Dados do depoimento invalidos: ${z.prettifyError(parsed.error)}`, 400);
      }

      await this.service.execute({
        data: {
          author_name: parsed.data.author_name,
          author_role: parsed.data.author_role ?? null,
          company: parsed.data.company ?? null,
          content: parsed.data.content,
          recaptcha_token: parsed.data.recaptcha_token,
          avatar,
        },
      });
      return reply.code(201).send({
        message: "Depoimento enviado para moderacao. Obrigado!",
      });
    } catch (error) {
      await removeUploadedFile(avatar);
      throw error;
    }
  }
}
