import { useApiMutation } from "../../Client";
import { Wishlist } from "../../Types/Api";

export default function useAddWishlist() {
  return useApiMutation<Wishlist>({
    path: "/me/wishlists",
  });
}
