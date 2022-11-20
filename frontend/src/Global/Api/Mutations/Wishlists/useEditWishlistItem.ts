import { useApiMutation } from "../../Client";
import { WishlistItem } from "../../Types/Api";
import { CreateWishlistItemInput } from "./useCreateWishlistItem";

export interface EditWishlistItemInput extends CreateWishlistItemInput {}

export default function useEditWishlistItem(id: string | number) {
  return useApiMutation<EditWishlistItemInput, WishlistItem>({
    path: `/me/wishlist_items/${id}`,
    method: "PUT",
  });
}
