import { useApiMutation } from "../Client";
import { WishlistItem } from "../Queries/useWishlistItems";

export default function useAddWishlistItem(id: string | number) {
  return useApiMutation<WishlistItem>(`/wishlists/${id}/items/add`);
}
