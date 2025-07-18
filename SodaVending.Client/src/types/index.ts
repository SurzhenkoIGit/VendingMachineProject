export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  brandId: number;
  brandName: string;
  imageUrl?: string;
}

export interface ProductFilter {
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coin {
  id: number;
  denomination: number;
  quantity: number;
}

export interface PaymentCoins {
  [denomination: string]: number;
}

export interface PaymentValidationResult {
  canMakeChange: boolean;
  errorMessage?: string;
  changeCoins?: PaymentCoins;
  changeAmount: number;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrder {
  orderItems: CreateOrderItem[];
  paymentCoins: PaymentCoins;
}

export interface OrderItem {
  id: number;
  productName: string;
  brandName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  paymentAmount: number;
  changeAmount: number;
  changeCoins?: PaymentCoins;
  orderItems: OrderItem[];
}

