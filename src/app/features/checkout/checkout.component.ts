import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  cartService = inject(CartService);
  router = inject(Router);
  fb = inject(FormBuilder);
  
  isProcessing = signal(false);

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    expiry: ['', Validators.required],
    cvv: ['', [Validators.required, Validators.minLength(3)]]
  });

  processPayment() {
    if (this.paymentForm.valid) {
      this.isProcessing.set(true);
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate(['/order-success']);
      }, 2000);
    }
  }
}