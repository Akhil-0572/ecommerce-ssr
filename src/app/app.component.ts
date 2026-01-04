import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { CartDrawerComponent } from './features/cart/cart-drawer/cart-drawer.component';
import { ToastComponent } from './shared/toast-message/toast-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CartDrawerComponent , ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cartService = inject(CartService);
}