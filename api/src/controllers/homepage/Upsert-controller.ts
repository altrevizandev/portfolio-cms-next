import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HomepageUpsertService } from "../../services/homepage/Upsert-service.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  removeUploadedFile,
  saveImageUpload,
} from "../../utils/uploads.js";

const nullableText = z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().nullable().optional(),
);

const nullableEmail = z.preprocess(
  (value) => value === "" ? null : value,
  z.email("E-mail invalido").nullable().optional(),
);

const nullableUrl = z.preprocess(
  (value) => value === "" ? null : value,
  z.url("URL invalida").nullable().optional(),
);

const HomepageFieldsSchema = z.strictObject({
  headline: z.string().trim().min(1, "O titulo principal e obrigatorio"),
  subheadline: nullableText,
  biography: z.string().trim().min(1, "A biografia e obrigatoria"),
  email: nullableEmail,
  github_url: nullableUrl,
  linkedin_url: nullableUrl,
});

type HomepagePhotoField = "primary_photo" | "secondary_photo";

export class HomepageUpsertController {
  private readonly homepageUpsertService: HomepageUpsertService;

  constructor() {
    this.homepageUpsertService = new HomepageUpsertService();
  }

  public async handle(request: FastifyRequest, reply: FastifyReply) {
    if (!request.isMultipart()) {
      throw new ApiError("A requisicao deve usar multipart/form-data", 415);
    }

    const fields: Record<string, string> = {};
    const uploadedPhotos: Partial<Record<HomepagePhotoField, string>> = {};

    try {
      for await (const part of request.parts()) {
        if (part.type === "field") {
          fields[part.fieldname] = String(part.value);
          continue;
        }

        if (
          part.fieldname !== "primary_photo" &&
          part.fieldname !== "secondary_photo"
        ) {
          part.file.resume();
          throw new ApiError(`Campo de arquivo invalido: ${part.fieldname}`, 400);
        }

        if (uploadedPhotos[part.fieldname]) {
          part.file.resume();
          throw new ApiError(`A imagem ${part.fieldname} foi enviada mais de uma vez`, 400);
        }

        uploadedPhotos[part.fieldname] = await saveImageUpload(
          part,
          "homepage",
        );
      }

      const parsedFields = HomepageFieldsSchema.safeParse(fields);

      if (!parsedFields.success) {
        throw new ApiError(
          `Dados da homepage invalidos: ${z.prettifyError(parsedFields.error)}`,
          400,
        );
      }

      this.homepageUpsertService.data = {
        headline: parsedFields.data.headline,
        subheadline: parsedFields.data.subheadline ?? null,
        biography: parsedFields.data.biography,
        email: parsedFields.data.email ?? null,
        github_url: parsedFields.data.github_url ?? null,
        linkedin_url: parsedFields.data.linkedin_url ?? null,
        ...uploadedPhotos,
      };

      const { homepage, replaced_photos } =
        await this.homepageUpsertService.execute();

      await Promise.allSettled(replaced_photos.map(removeUploadedFile));

      return reply.code(200).send({ homepage });
    } catch (error) {
      await Promise.allSettled(
        Object.values(uploadedPhotos).map(removeUploadedFile),
      );
      throw error;
    }
  }
}
