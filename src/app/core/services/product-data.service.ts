import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, FilterState, PaginatedResponse } from '../models/ecommerce.models';

const BRANDS = ['Nike', 'Adidas', 'Puma', 'Apple', 'Samsung', 'Sony', 'Dell', 'OnePlus'];
const TITLES = ['Running Shoes', 'Smart Watch', 'Flagship Phone', 'Noise Cancelling Headphones', 'Laptop Pro', 'Gaming Monitor', 'Wireless Earbuds', 'Fitness Band'];

const GENERATED_PRODUCTS: Product[] = Array.from({ length: 24 }, (_, i) => {
  const brand = BRANDS[i % BRANDS.length];
  const title = TITLES[i % TITLES.length];
  const price = 2000 + Math.floor(Math.random() * 50000);
  const discount = i % 3 === 0 ? 10 + Math.floor(Math.random() * 20) : 0; 

  // LOGIC: Every 4th product (0, 4, 8...) has 0 stock for "Premium"
  const premiumStock = i % 4 === 0 ? 0 : 5;

  // Generate 3 images for the gallery
  const images = [
    `https://placehold.co/600x600/png?text=${brand}+Front+${i+1}`,
    `https://placehold.co/600x600/png?text=${brand}+Side+${i+1}`,
    `https://placehold.co/600x600/png?text=${brand}+Back+${i+1}`
  ];

  return {
    id: (i + 1).toString(),
    title: `${brand} ${title} ${2024 + i}`,
    brand: brand,
    image: images[0], // Use first image as main thumbnail
    images: images,   // Full gallery
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    discount: discount,
    variants: [
      { id: `v${i}-1`, name: 'Standard', price: price, stock: 10 }, // Always in stock
      { id: `v${i}-2`, name: 'Premium', price: price + 1000, stock: premiumStock } // Conditionally OOS
    ]
  };
});

@Injectable({ providedIn: 'root' })
export class ProductDataService {

  getProducts(filters: FilterState): Observable<PaginatedResponse<Product>> {
    let data = [...GENERATED_PRODUCTS];

    // 1. Filter
    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      data = data.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q)
      );
    }

    // 2. Sort
    if (filters.sort === 'price_asc') {
      data.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (filters.sort === 'price_desc') {
      data.sort((a, b) => b.variants[0].price - a.variants[0].price);
    } else if (filters.sort === 'newest') {
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // 3. Pagination
    const total = data.length;
    const startIndex = (filters.page - 1) * filters.pageSize;
    const endIndex = startIndex + filters.pageSize;
    const items = data.slice(startIndex, endIndex);

    return of({ items, total }).pipe(delay(500));
  }

  getProductById(id: string) { 
    return of(GENERATED_PRODUCTS.find(p => p.id === id)); 
  }
}