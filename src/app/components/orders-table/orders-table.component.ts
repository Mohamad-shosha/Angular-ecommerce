// orders-table.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/common/order';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css'],
})
export class OrdersTableComponent {
  @Input() orders: Order[] = [];

  @Output() viewDetails = new EventEmitter<Order>();
  @Output() openCancelModal = new EventEmitter<Order>();
  @Output() restoreOrder = new EventEmitter<Order>();

  onView(order: Order) {
    this.viewDetails.emit(order);
  }

  onCancel(order: Order) {
    this.openCancelModal.emit(order);
  }

  onRestore(order: Order) {
    this.restoreOrder.emit(order);
  }
}
