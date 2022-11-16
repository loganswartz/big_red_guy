import { useApiQuery } from "../../Client";
import { WishlistItem } from "../../Types/Api";

export default function useWishlistItems(id: string | number) {
  return useApiQuery<WishlistItem[]>(`/me/wishlists/${id}/items`);
}
