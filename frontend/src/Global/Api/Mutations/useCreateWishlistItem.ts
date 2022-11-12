import { useApiMutation } from "../Client";
import { WishlistItem } from "../Queries/useWishlistItems";

export default function useCreateWishlistItem(listId?: string | number) {
  const endpoint = listId
    ? `/wishlists/${listId}/items/add`
    : "/wishlist_items/add";
  return useApiMutation<WishlistItem>(endpoint);
}
