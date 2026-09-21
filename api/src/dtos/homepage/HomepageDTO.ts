import { type HomepageData } from "../../dtos/homepage/HomepageData.js";

export type HomepageUpsertData = Omit<HomepageData, "primary_photo" | "secondary_photo"> & {
  primary_photo?: string;
  secondary_photo?: string;
};

export type HomepageUpsertDTO = { data: HomepageUpsertData };
