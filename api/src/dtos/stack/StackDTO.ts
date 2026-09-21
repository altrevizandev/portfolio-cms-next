export type StackInput = {
  name: string;
  slug?: string;
  icon_slug?: string | null;
  color?: string | null;
  website?: string | null;
};

export type StackCreateDTO = { data: StackInput };
