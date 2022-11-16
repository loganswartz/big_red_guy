import { useApiQuery } from "../../Client";
import { Wishlist } from "../../Types/Api";

export default function useAllWishlists() {
  return useApiQuery<Wishlist[]>("/me/wishlists");
}
