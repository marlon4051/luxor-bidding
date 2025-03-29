import { User } from "./user";

export interface Bid {
  id: string;
  price: number;
  userId: string;
  status: string;
  user: User
}
