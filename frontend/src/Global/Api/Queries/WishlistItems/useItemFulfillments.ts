import { useApiQuery } from "../../Client";
import { ItemFulfillment } from "../../Types/Api";

export default function useItemFulfillments(
  id: number | string,
  enabled = true
) {
  return useApiQuery<ItemFulfillment[]>(
    `/me/wishlist_items/${id}/fulfillments`,
    undefined,
    { enabled }
  );
}
