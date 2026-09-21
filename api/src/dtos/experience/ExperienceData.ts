export type ExperienceData = {
  company: string;
  role: string;
  description: string;
  start_date: Date;
  end_date: Date | null;
  current: boolean;
  sort_order: number;
  published: boolean;
};
