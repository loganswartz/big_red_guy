import { useApiMutation } from "../../Client";
import { Fulfillment } from "../../Types/Api";

export type FulfillItemInput = Pick<
  Fulfillment,
  "wishlist_item_id" | "quantity"
>;

export default function useFulfillItem() {
  return useApiMutation<FulfillItemInput, Fulfillment>({
    path: "/me/fulfillments",
  });
}
