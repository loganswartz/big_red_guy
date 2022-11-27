import { useApiMutation } from "../../Client";
import { Fulfillment } from "../../Types/Api";
import { FulfillItemInput } from "./useFulfillItem";

export interface EditFulfillmentInput
  extends Omit<FulfillItemInput, "wishlist_item_id"> {}

export default function useEditFulfillment() {
  const template = (id: string | number) => {
    return `/me/fulfillments/${id}`;
  };

  return useApiMutation<EditFulfillmentInput, Fulfillment, typeof template>({
    path: template,
    method: "PUT",
  });
}
