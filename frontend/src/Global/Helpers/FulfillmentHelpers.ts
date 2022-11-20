import { Fulfillment } from "../Api/Types/Api";

export function groupFulfillments(fulfillments: Fulfillment[]) {
  return fulfillments.reduce((all, entry) => {
    all[entry.wishlist_item_id] = [
      ...(all[entry.wishlist_item_id] ?? []),
      entry,
    ];
    return all;
  }, {} as GroupedFulfillments);
}

export type GroupedFulfillments = { [id: string]: Fulfillment[] };
