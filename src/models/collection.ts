import { Bid } from "./bids";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  stocks: number;
  price: number;
  userId: string;
  bids: Bid[];
};
