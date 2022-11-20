import { useApiMutation } from "../../Client";
import { Wishlist } from "../../Types/Api";
import { AddWishlistInput } from "./useCreateWishlist";

export interface EditWishlistInput extends AddWishlistInput {}

export default function useEditWishlist(id: string | number) {
  return useApiMutation<EditWishlistInput, Wishlist>({
    path: `/me/wishlists/${id}`,
    method: "PUT",
  });
}
