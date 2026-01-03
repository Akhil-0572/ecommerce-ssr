import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductDataService } from '../../core/services/product-data.service';
import { CartService } from '../../core/services/cart.service';
import { Product, Variant } from '../../core/services/models/ecommerce.models';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss']
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductDataService);
  private cartService = inject(CartService); // Inject Cart Service directly

  product = signal<Product | null>(null);
  selectedVariant = signal<Variant | null>(null);

  // Derived state
  price = computed(() => this.selectedVariant()?.price || 0);
  isStockAvailable = computed(() => (this.selectedVariant()?.stock || 0) > 0);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(p => {
        if (p) {
          this.product.set(p);
          this.selectedVariant.set(p.variants[0]); // Auto-select first variant
        }
      });
    }
  }

  selectVariant(v: Variant) {
    this.selectedVariant.set(v);
  }

  addToCart() {
    const p = this.product();
    const v = this.selectedVariant();
    
    if (p && v && this.isStockAvailable()) {
      this.cartService.addToCart(p, v);
      alert('Added to Cart!');
    }
  }
}