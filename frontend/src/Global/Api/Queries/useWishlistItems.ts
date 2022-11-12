import { useApiQuery } from "../Client";

export type WishlistItem = {
  id: number;
  name: string;
  url?: string;
  quantity?: number;
};

export default function useWishlistItems(id: string | number) {
  return useApiQuery<WishlistItem[]>(`/wishlists/${id}/items`);
}
