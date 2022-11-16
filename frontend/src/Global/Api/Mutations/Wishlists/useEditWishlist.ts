import { useApiMutation } from "../../Client";
import { Wishlist } from "../../Types/Api";

export default function useEditWishlist(id: string | number) {
  return useApiMutation<Wishlist>({
    path: `/me/wishlists/${id}`,
    method: "PUT",
  });
}
