import { useApiQuery } from "../../Client";
import { Wishlist } from "../../Types/Api";

export default function useWishlist(id: number | string) {
  return useApiQuery<Wishlist>(`/me/wishlists/${id}`);
}
