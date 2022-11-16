import { useApiMutation } from "../../Client";
import { WishlistItem } from "../../Types/Api";

export default function useDeleteWishlistItem(id: string | number) {
  return useApiMutation<WishlistItem>({
    path: `/me/wishlist_items/${id}`,
    method: "DELETE",
  });
}
