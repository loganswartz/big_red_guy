import { useApiQuery } from "../../Client";
import { Fulfillment } from "../../Types/Api";

export default function usePartyFulfillments(id: number | string) {
  return useApiQuery<Fulfillment[]>(`/me/parties/${id}/fulfillments`);
}
