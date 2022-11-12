import { useApiMutation } from "../Client";
import { WishlistItem } from "../Queries/useWishlistItems";

export default function useEditWishlistItem(id: string | number) {
  return useApiMutation<WishlistItem>(`/wishlist_items/${id}`, {
    method: "PUT",
  });
}
