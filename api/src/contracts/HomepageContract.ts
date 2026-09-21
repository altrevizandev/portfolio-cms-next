import type { Homepage } from "../../prisma/generated/prisma/client.js";
import type { HomepageData } from "../dtos/homepage/HomepageData.js";

export interface HomepageContract {
  findSingletonCandidates(): Promise<Homepage[]>;
  upsert(input: { data: HomepageData }): Promise<Homepage>;
}
