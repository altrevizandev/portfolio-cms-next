import type { FastifyRequest } from "fastify";
import { z } from "zod";
import { PublicationStatus } from "../../../prisma/generated/prisma/enums.js";
import type { ProjectInput } from "../../services/project/Project-data.js";
import { ApiError } from "../../utils/ApiError.js";
import { saveImageUpload } from "../../utils/uploads.js";

const ProjectFieldsSchema = z.strictObject({
  title: z.string().trim().min(1, "O titulo e obrigatorio").max(160),
  slug: z.string().trim().max(180).optional(),
  description: z.string().trim().min(1, "A descricao e obrigatoria"),
  objective: z.string().trim().min(1, "O objetivo e obrigatorio"),
  challenge: z.preprocess(
    (value) => value === "" ? null : value,
    z.string().trim().nullable().optional(),
  ),
  status: z.enum(PublicationStatus).default(PublicationStatus.DRAFT),
  featured: z.preprocess(
    (value) => value === "true" || value === true,
    z.boolean(),
  ),
  sort_order: z.coerce.number().int().min(0).default(0),
  stack_ids: z.string().default("[]").transform((value, context) => {
    try {
      const parsed = JSON.parse(value);
      const result = z.array(z.uuid()).safeParse(parsed);
      if (!result.success) throw new Error();
      return result.data;
    } catch {
      context.addIssue({
        code: "custom",
        message: "stack_ids deve ser um array JSON de UUIDs",
      });
      return z.NEVER;
    }
  }),
  image_alt_texts: z.string().default("[]").transform((value, context) => {
    try {
      const parsed = JSON.parse(value);
      const result = z.array(z.string().max(250).nullable()).safeParse(parsed);
      if (!result.success) throw new Error();
      return result.data;
    } catch {
      context.addIssue({
        code: "custom",
        message: "image_alt_texts deve ser um array JSON de textos",
      });
      return z.NEVER;
    }
  }),
});

export async function parseProjectMultipart(
  request: FastifyRequest,
  uploadedPaths: string[],
) {
  if (!request.isMultipart()) {
    throw new ApiError("A requisicao deve usar multipart/form-data", 415);
  }

  const fields: Record<string, string> = {};
  const galleryPaths: string[] = [];
  let thumbnail: string | undefined;

  for await (const part of request.parts()) {
    if (part.type === "field") {
      fields[part.fieldname] = String(part.value);
      continue;
    }

    if (part.fieldname === "thumbnail") {
      if (thumbnail) {
        part.file.resume();
        throw new ApiError("A thumbnail foi enviada mais de uma vez", 400);
      }

      thumbnail = await saveImageUpload(part, "projects/thumbnails");
      uploadedPaths.push(thumbnail);
      continue;
    }

    if (part.fieldname === "images") {
      if (galleryPaths.length >= 10) {
        part.file.resume();
        throw new ApiError("A galeria aceita no maximo 10 imagens", 400);
      }

      const path = await saveImageUpload(part, "projects/gallery");
      galleryPaths.push(path);
      uploadedPaths.push(path);
      continue;
    }

    part.file.resume();
    throw new ApiError(`Campo de arquivo invalido: ${part.fieldname}`, 400);
  }

  const parsed = ProjectFieldsSchema.safeParse(fields);

  if (!parsed.success) {
    throw new ApiError(
      `Dados do projeto invalidos: ${z.prettifyError(parsed.error)}`,
      400,
    );
  }

  const input: ProjectInput = {
    title: parsed.data.title,
    ...(parsed.data.slug && { slug: parsed.data.slug }),
    description: parsed.data.description,
    objective: parsed.data.objective,
    challenge: parsed.data.challenge ?? null,
    status: parsed.data.status,
    featured: parsed.data.featured,
    sort_order: parsed.data.sort_order,
    stack_ids: parsed.data.stack_ids,
    ...(thumbnail && { thumbnail }),
    images: galleryPaths.map((path, index) => ({
      path,
      alt_text: parsed.data.image_alt_texts[index]?.trim() || null,
      sort_order: index,
    })),
  };

  return { input, uploadedPaths };
}
