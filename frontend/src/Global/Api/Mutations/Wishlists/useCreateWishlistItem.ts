import { useApiMutation } from "../../Client";
import { WishlistItem } from "../../Types/Api";

export default function useCreateWishlistItem(listId?: string | number) {
  const path = listId ? `/me/wishlists/${listId}/items` : "/me/wishlist_items";

  return useApiMutation<WishlistItem>({
    path,
  });
}
