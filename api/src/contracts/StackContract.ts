import type { Stack } from "../../prisma/generated/prisma/client.js";
import type { StackData } from "../dtos/stack/StackData.js";

export interface StackContract {
  list(): Promise<Stack[]>;
  findById(input: { stack_id: string }): Promise<Stack | null>;
  findBySlug(input: { slug: string }): Promise<Stack | null>;
  create(input: { data: StackData }): Promise<Stack>;
  update(input: { stack_id: string; data: StackData }): Promise<Stack>;
  countProjects(input: { stack_id: string }): Promise<number>;
  delete(input: { stack_id: string }): Promise<Stack>;
}
