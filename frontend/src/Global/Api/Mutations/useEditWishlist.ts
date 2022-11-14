import { useApiMutation } from "../Client";
import { Wishlist } from "../Queries/useAllWishlists";

export default function useEditWishlist(id: string | number) {
  return useApiMutation<Wishlist>(`/me/wishlists/${id}`, {
    method: "PUT",
  });
}
