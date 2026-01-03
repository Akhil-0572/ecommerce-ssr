import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss']
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  isOpen = signal(false);

  toggle() { this.isOpen.update(v => !v); }
  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }
}