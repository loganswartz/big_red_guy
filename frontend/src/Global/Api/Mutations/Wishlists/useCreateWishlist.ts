import { useApiMutation } from "../../Client";
import { Wishlist } from "../../Types";

export default function useAddWishlist() {
  return useApiMutation<Wishlist>("/me/wishlists");
}
