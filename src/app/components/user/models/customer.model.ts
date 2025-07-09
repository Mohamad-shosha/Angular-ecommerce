export interface OrderItem {
  id: number;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  productId: number;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Order {
  id: number;
  orderTrackingNumber: string;
  totalQuantity: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: Address;
  billingAddress: Address;
  orderItems: OrderItem[];
}
