import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent {
  orderId = Math.floor(100000 + Math.random() * 900000);

  printInvoice() {
    window.print();
  }
}