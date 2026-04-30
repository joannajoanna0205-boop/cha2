export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  priceM: number;
  priceL: number;
  available: boolean;
  description?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: 'M' | 'L';
  sugar: string;
  ice: string;
  toppings: string[];
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  userName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: any;
  updatedAt?: any;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  points: number;
  createdAt: any;
}
