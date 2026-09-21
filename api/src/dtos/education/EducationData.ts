export type EducationData = {
  institution: string;
  course: string;
  degree: string | null;
  description: string | null;
  start_date: Date;
  end_date: Date | null;
  current: boolean;
  sort_order: number;
  published: boolean;
};
