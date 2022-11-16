import { useApiQuery } from "../../Client";
import { Wishlist } from "../../Types/Api";
import { ID } from "../../Types/Utility";

export default function usePartyLists(id: ID) {
  return useApiQuery<Wishlist[]>(`/me/parties/${id}/lists`);
}
