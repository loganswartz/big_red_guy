export interface LoginResponse {
  success: boolean;
}

export interface User {
  email: string;
  name: string;
}

export interface Party {
  id: number;
  name: string;
}

export interface Wishlist {
  id: number;
  owner: User;
  name: string;
}

export type WishlistItem = {
  id: number;
  name: string;
  url?: string;
  quantity?: number;
};
