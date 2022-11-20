import { useApiMutation } from "../../Client";
import { WishlistItem } from "../../Types/Api";

export type CreateWishlistItemInput = Omit<WishlistItem, "id">;

export default function useCreateWishlistItem(listId?: string | number) {
  const path = listId ? `/me/wishlists/${listId}/items` : "/me/wishlist_items";

  return useApiMutation<CreateWishlistItemInput, WishlistItem>({
    path,
  });
}
