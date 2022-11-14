import { useApiQuery } from "../Client";
import { Wishlist } from "./useAllWishlists";

export default function useWishlist(id: number | string) {
  return useApiQuery<Wishlist>(`/me/wishlists/${id}`);
}
