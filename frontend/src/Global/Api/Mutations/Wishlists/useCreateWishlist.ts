import { useApiMutation } from "../../Client";
import { Wishlist } from "../../Types/Api";

export interface AddWishlistInput {
  name: string;
}

export default function useAddWishlist() {
  return useApiMutation<AddWishlistInput, Wishlist>({
    path: "/me/wishlists",
  });
}
