import { useApiQuery } from "../../Client";
import { Wishlist } from "../../Types";

export default function useAllWishlists() {
  return useApiQuery<Wishlist[]>("/me/wishlists");
}
