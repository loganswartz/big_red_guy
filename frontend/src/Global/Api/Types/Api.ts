export interface LoginResponse {
  success: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
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
  url?: string;
  quantity?: number;
};
