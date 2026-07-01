export type MevzuatUpdate = {
  id: string;
  slug: string;
  reference: string;
  date: string;
  title: string;
};

export type MevzuatUpdatesFeed = {
  fetchedAt: string;
  items: MevzuatUpdate[];
};
