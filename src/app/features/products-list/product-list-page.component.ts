import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductDataService } from '../../core/services/product-data.service';
import { debounceTime, distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';
import { combineLatest, startWith } from 'rxjs';
import { Product } from '../../core/services/models/ecommerce.models';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent implements OnInit {
  private productService = inject(ProductDataService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  
  // Pagination State
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  pageSize = 8; // Show 8 items per page

  filterForm: FormGroup = this.fb.group({
    search: [''],
    sort: ['newest']
  });

  ngOnInit() {
    // Combine Form Changes with Page Changes
    combineLatest([
      this.filterForm.valueChanges.pipe(
        startWith(this.filterForm.value),
        debounceTime(500), // Wait 500ms after typing
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap(() => {
          // Reset to page 1 if search/sort changes
          if (this.currentPage() !== 1) this.currentPage.set(1);
        })
      ),
      // We convert the signal to an observable manually or just use the current value in switchMap
    ]).pipe(
      switchMap(([filters]) => {
        this.loading.set(true);
        // Call API with current filters AND current page
        return this.productService.getProducts({
          query: filters.search,
          sort: filters.sort,
          page: this.currentPage(),
          pageSize: this.pageSize
        });
      })
    ).subscribe(response => {
      this.products.set(response.items);
      this.totalItems.set(response.total);
      this.loading.set(false);
    });

    // Trigger initial load
    this.filterForm.updateValueAndValidity();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    // Force re-emit to trigger pipeline
    this.filterForm.updateValueAndValidity({ emitEvent: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.pageSize);
  }
  
  // Helper to generate page numbers array [1, 2, 3...]
  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}