export type Job = {
  title: string;
  url: string;
  company?: string;
  country?: string;
  location?: string;
  created_at?: Date;
};

export type FilterMenuItem = {
  id: string;
  label: string;
  value: string;
};

export type FilterMenuType = {
  filter: string;
};
