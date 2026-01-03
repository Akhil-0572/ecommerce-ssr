import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent {
  cartService = inject(CartService);

  updateQty(item: any, change: number) {
  if (change > 0) {
    this.cartService.addToCart(
      { id: item.productId } as any, 
      { id: item.variantId, price: item.price, name: item.variantName } as any
    );
  } else {
    this.cartService.decreaseQuantity(item.variantId);
  }
}
}