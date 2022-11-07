import { useApiQuery } from "../Client";
import { User } from "./useCurrentUser";

export interface Wishlist {
  id: number;
  owner: User;
  name: string;
}

export default function useAllWishlists() {
  return useApiQuery<Wishlist[]>("/wishlists");
}
