import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, Product, Variant } from './models/ecommerce.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);

  private _cartItems = signal<CartItem[]>([]);

  readonly cartItems = this._cartItems.asReadonly();

  readonly cartCount = computed(() => 
    this._cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly cartTotal = computed(() => 
    this._cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this._cartItems.set(JSON.parse(savedCart));
      }

      effect(() => {
        const items = this._cartItems();
        localStorage.setItem('cart', JSON.stringify(items));
      });
    }
  }


  addToCart(product: Product, variant: Variant) {
    this._cartItems.update(items => {
      const existing = items.find(i => i.variantId === variant.id);
      
      if (existing) {
        return items.map(i => 
          i.variantId === variant.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variantId: variant.id,
          productTitle: product.title,
          variantName: variant.name,
          price: variant.price,
          quantity: 1
        };
        return [...items, newItem];
      }
    });
  }

  removeFromCart(variantId: string) {
    this._cartItems.update(items => items.filter(i => i.variantId !== variantId));
  }

  clearCart() {
    this._cartItems.set([]);
  }

  decreaseQuantity(variantId: string) {
  this._cartItems.update(items =>
    items.map(item =>
      item.variantId === variantId
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    )
  );
}
}