// src/app/services/role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../common/role.model';
import { Customer } from '../common/customer';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = 'http://localhost:8080/api/admin/roles';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
