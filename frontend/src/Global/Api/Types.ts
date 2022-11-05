type User = {};
type WishlistItem = {
  name: string;
};

export interface Wishlist {
  owner: User;
  name: string;
  items: WishlistItem[];
}
