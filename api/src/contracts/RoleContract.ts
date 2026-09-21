import type { Role } from "../../prisma/generated/prisma/client.js";

export interface RoleContract {
  findBySlug(input: { slug: string }): Promise<Role | null>;
  list(): Promise<Role[]>;
}
