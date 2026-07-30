import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";
import type { MultipartFile } from "@fastify/multipart";
import { ApiError } from "./ApiError.js";

const imageExtensionsByMimeType = new Map([
  [ "image/jpeg", ".jpg" ],
  [ "image/png", ".png" ],
  [ "image/webp", ".webp" ],
]);

export const uploadsDirectory = resolve(
  process.cwd(),
  process.env.UPLOAD_DIR ?? "uploads",
);

export async function saveImageUpload(
  file: MultipartFile,
  directory: string,
) {
  const extension = imageExtensionsByMimeType.get(file.mimetype);

  if (!extension) {
    file.file.resume();
    throw new ApiError(
      "Formato de imagem invalido. Envie um arquivo JPEG, PNG ou WEBP",
      400,
    );
  }

  const originalExtension = extname(file.filename).toLowerCase();

  if (
    originalExtension &&
    ![ ".jpg", ".jpeg", ".png", ".webp" ].includes(originalExtension)
  ) {
    file.file.resume();
    throw new ApiError("Extensao de imagem invalida", 400);
  }

  const relativeDirectory = directory.replaceAll("\\", "/").replace(/^\/+/, "");
  const filename = `${randomUUID()}${extension}`;
  const relativePath = `${relativeDirectory}/${filename}`;
  const absoluteDirectory = resolve(uploadsDirectory, relativeDirectory);
  const absolutePath = resolve(uploadsDirectory, relativePath);

  assertPathInsideUploads(absoluteDirectory);
  assertPathInsideUploads(absolutePath);

  await mkdir(absoluteDirectory, { recursive: true });

  try {
    await pipeline(file.file, createWriteStream(absolutePath, { flags: "wx" }));

    if (file.file.truncated) {
      throw new ApiError("A imagem excede o limite de 5 MB", 413);
    }
  } catch (error) {
    await rm(absolutePath, { force: true });
    throw error;
  }

  return `/uploads/${relativePath}`;
}

export async function removeUploadedFile(publicPath?: string | null) {
  if (!publicPath?.startsWith("/uploads/")) {
    return;
  }

  const relativePath = publicPath.slice("/uploads/".length);
  const absolutePath = resolve(uploadsDirectory, relativePath);

  assertPathInsideUploads(absolutePath);
  await rm(absolutePath, { force: true });
}

function assertPathInsideUploads(path: string) {
  if (path !== uploadsDirectory && !path.startsWith(`${uploadsDirectory}${sep}`)) {
    throw new ApiError("Caminho de upload invalido", 400);
  }
}
