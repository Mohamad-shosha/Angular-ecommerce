import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../common/customer';
import { Order } from '../common/order';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // Get all customers
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  // Promote a customer to admin
  promoteUserToAdmin(email: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/users/promote`,
      { email },
      { responseType: 'text' }
    );
  }
  // admin.service.ts
  getAllCanceledOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`http://localhost:8080/orders/canceled`);
  }
}
