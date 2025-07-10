import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { AdminService } from 'src/app/services/admin.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/common/role.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  sidebarOpen: boolean = true;
  viewSection: string = 'customers';
  filteredOrders: Order[] = [];
  selectedFilter: string = 'ALL';
  selectedOrder: Order | null = null;
  customers: Customer[] = [];
  canceledOrders: Order[] = [];
  orders: Order[] = [];
  adminEmail: string = '';
  roles: Customer[] = [];

  constructor(
    private adminService: AdminService,
    private orderService: OrderService,
    private toastService: ToastService,
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.adminEmail = this.authService.getUserEmail();
    this.getAllCustomers();
    this.getCanceledOrders();
    this.getAllRoles();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getAllCustomers(): void {
    this.adminService.getAllCustomers().subscribe({
      next: (data) => (this.customers = data),
      error: () => this.toastService.showError('Failed to load customers'),
    });
  }

  getAllRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => (this.roles = data),
      error: () => this.toastService.showError('Failed to load roles'),
    });
  }

  filterOrders(status: string) {
    this.selectedFilter = status;
    if (status === 'ALL') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(
        (order) => order.status === status
      );
    }
  }

  // dashboard.component.ts
  getCanceledOrders(): void {
    this.adminService.getAllCanceledOrders().subscribe({
      next: (data) => (this.canceledOrders = data),
      error: () =>
        this.toastService.showError('Failed to load canceled orders'),
    });
  }

  restoreOrder(order: Order) {
    if (!order.id) return;

    order.isRestoring = true;

    this.orderService.restoreOrder(order.id).subscribe({
      next: () => {
        order.status = 'PENDING';
        this.toastService.showSuccess('Order restored successfully');
        this.filterOrders(this.selectedFilter); // لتحديث الفلتر الحالي
      },
      error: (err) => {
        this.toastService.showError('Failed to restore order');
        console.error(err);
      },
      complete: () => {
        order.isRestoring = false;
      },
    });
  }

  promoteToAdmin(customer: Customer): void {
    if (!customer.email) {
      this.toastService.showError('Customer email is missing');
      return;
    }

    this.adminService.promoteUserToAdmin(customer.email).subscribe({
      next: () => {
        this.toastService.showSuccess(
          `User ${customer.email} promoted to Admin`
        );
        this.getAllCustomers(); // refresh list
      },
      error: () => this.toastService.showError('Failed to promote user'),
    });
  }
}
