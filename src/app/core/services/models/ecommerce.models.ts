export interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  images: any;
  id: string;
  title: string;
  brand: string;
  image: string;
  variants: Variant[];
  createdAt: string;
  discount?: number; 
}

export interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  variantName: string;
  price: number;
  quantity: number;
}

export interface FilterState {
  query: string;
  sort: string;
  page: number;     
  pageSize: number; 
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}