import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products-list/product-list-page.component';
import { ProductDetailPageComponent } from './features/product-details/product-detail-page.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { CartPageComponent } from './features/cart/cart-page/cart-page.component';
import { OrderSuccessComponent } from './features/order-success/order-success.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListPageComponent },
  { path: 'product/:id', component: ProductDetailPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success', component: OrderSuccessComponent }
];