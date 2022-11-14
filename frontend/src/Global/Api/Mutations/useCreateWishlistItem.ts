import { useApiMutation } from "../Client";
import { WishlistItem } from "../Queries/useWishlistItems";

export default function useCreateWishlistItem(listId?: string | number) {
  const endpoint = listId ? `/wishlists/${listId}/items` : "/wishlist_items";
  return useApiMutation<WishlistItem>(endpoint);
}
