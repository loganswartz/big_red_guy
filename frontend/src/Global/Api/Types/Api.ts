export interface LoginResponse {
  success: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
}

export interface Party {
  id: number;
  name: string;
  owner_id: number;
}

export interface Wishlist {
  id: number;
  owner_id: number;
  name: string;
}

export type WishlistItem = {
  id: number;
  name: string;
  notes?: string;
  url?: string;
  quantity?: number;
};

export interface WishlistWithItems {
  wishlist: Wishlist;
  items: WishlistItem[];
}
