import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../common/order';
import { CanceledOrderDto } from '../components/user/models/canceled-order.dto';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/customer/orders';

  constructor(private http: HttpClient) {}

  cancelOrder(dto: CanceledOrderDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/cancel`, dto, {
      responseType: 'text',
    });
  }
  getCancelledOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/cancelled`);
  }

  restoreOrder(orderId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/restore?orderId=${orderId}`,
      {},
      {
        responseType: 'text', // لو الباك بيرجع نص
      }
    );
  }

  getCustomerOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }
}
