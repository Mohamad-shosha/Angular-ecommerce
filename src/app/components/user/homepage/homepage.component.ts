import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/common/order';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; // لو عندك auth service

export interface CanceledOrderDTO {
  orderId: number;
  reason: string;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  cancelReasonControl = new FormControl('');
  cancelTargetOrder: Order | null = null;
  sidebarOpen: boolean = true;
  selectedFilter: string = 'ALL';
  customerEmail: string = '';

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    private authService: AuthService // لو عندك وسيلة لعرض الإيميل
  ) {}

  ngOnInit(): void {
    this.customerEmail = this.authService.getUserEmail(); // حسب النظام عندك
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getCustomerOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filterOrders('ALL');
      },
      error: (err) => console.error('Failed to load orders', err),
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

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  viewDetails(order: Order) {
    this.selectedOrder = order;
    console.log('Order details:', order);
  }

  openCancelModal(order: Order) {
    this.cancelTargetOrder = order;
    this.cancelReasonControl.setValue('');
  }

  confirmCancel() {
    const reason = this.cancelReasonControl.value?.trim();
    if (!reason) {
      this.toastService.showError('Please enter a cancellation reason.');
      return;
    }
    if (!this.cancelTargetOrder?.id) return;

    const dto: CanceledOrderDTO = {
      orderId: this.cancelTargetOrder.id,
      reason: reason,
    };

    this.orderService.cancelOrder(dto).subscribe({
      next: () => {
        this.cancelTargetOrder!.status = 'CANCELLED';
        this.toastService.showSuccess('Order cancelled successfully');
        this.filterOrders(this.selectedFilter); // لتحديث القائمة بعد الإلغاء
      },
      error: (err) => {
        this.toastService.showError('Failed to cancel order');
        console.error(err);
      },
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
}
