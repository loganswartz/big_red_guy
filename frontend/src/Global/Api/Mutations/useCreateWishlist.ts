import { useApiMutation } from "../Client";
import { Wishlist } from "../Queries/useAllWishlists";

export default function useAddWishlist() {
  return useApiMutation<Wishlist>("/wishlists");
}
