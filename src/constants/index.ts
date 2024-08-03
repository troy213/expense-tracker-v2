export interface EntryGroup {
  date: string;
  items: Item[];
}
export interface Item {
  category: string;
  description: string;
  amount: number;
}
