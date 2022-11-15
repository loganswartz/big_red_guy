import { useApiMutation } from "../../Client";
import { WishlistItem } from "../../Types";

export default function useDeleteWishlistItem(id: string | number) {
  return useApiMutation<WishlistItem>(`/me/wishlist_items/${id}`, {
    method: "DELETE",
  });
}
