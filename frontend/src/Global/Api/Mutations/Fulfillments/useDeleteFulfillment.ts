import { useApiMutation } from "../../Client";
import { Fulfillment } from "../../Types/Api";

export default function useDeleteFulfillment() {
  const template = (id: string | number) => {
    return `/me/fulfillments/${id}`;
  };

  return useApiMutation<undefined, Fulfillment, typeof template>({
    path: template,
    method: "DELETE",
  });
}
