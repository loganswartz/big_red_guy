import { useApiMutation } from "../Client";
import { WishlistItem } from "../Queries/useWishlistItems";

export default function useCreateWishlistItem(listId?: string | number) {
  const endpoint = listId
    ? `/me/wishlists/${listId}/items`
    : "/me/wishlist_items";
  return useApiMutation<WishlistItem>(endpoint);
}
