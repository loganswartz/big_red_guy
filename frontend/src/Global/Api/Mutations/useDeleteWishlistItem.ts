import { useApiMutation } from "../Client";
import { WishlistItem } from "../Queries/useWishlistItems";

export default function useDeleteWishlistItem(id: string | number) {
  return useApiMutation<WishlistItem>(`/me/wishlist_items/${id}`, {
    method: "DELETE",
  });
}
