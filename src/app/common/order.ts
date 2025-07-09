import { Address } from './address';
import { OrderItem } from './order-item';

export class Order {
  id?: number;
  orderTrackingNumber?: string;
  totalQuantity?: number;
  totalPrice?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shippingAddress?: Address;
  billingAddress?: Address;
  orderItems?: OrderItem[];
  isRestoring?: boolean;
}
