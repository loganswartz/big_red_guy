import { useApiQuery } from "../../Client";
import { WishlistWithItems } from "../../Types/Api";
import { ID } from "../../Types/Utility";

export default function usePartyLists(id: ID) {
  return useApiQuery<WishlistWithItems[]>(`/me/parties/${id}/wishlists`);
}
