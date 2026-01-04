import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductDataService } from '../../core/services/product-data.service';
import { CartService } from '../../core/services/cart.service';
import { Product, Variant } from '../../core/models/ecommerce.models'; // Ensure path is correct
import { ToastService } from '../../core/services/toast.service';

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
  private cartService = inject(CartService); 
  private toastService = inject(ToastService);

  product = signal<Product | null>(null);
  selectedVariant = signal<Variant | null>(null);
  activeImage = signal<string>(''); // For Gallery

  // Derived state
  price = computed(() => {
    const p = this.product();
    const v = this.selectedVariant();
    if (!p || !v) return 0;
    // Apply discount logic if exists
    return p.discount ? v.price * (1 - p.discount / 100) : v.price;
  });

  originalPrice = computed(() => this.selectedVariant()?.price || 0);
  isStockAvailable = computed(() => (this.selectedVariant()?.stock || 0) > 0);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(p => {
        if (p) {
          this.product.set(p);
          this.selectedVariant.set(p.variants[0]);
          this.activeImage.set(p.images[0]); // Default to first image
        }
      });
    }
  }

  setActiveImage(url: string) {
    this.activeImage.set(url);
  }

  selectVariant(v: Variant) {
    this.selectedVariant.set(v);
  }

  addToCart() {
    const p = this.product();
    const v = this.selectedVariant();
    
    if (p && v && this.isStockAvailable()) {
      this.cartService.addToCart(p, v);
      this.toastService.show('Successfully added to cart!', 'success');
    }
  }
}