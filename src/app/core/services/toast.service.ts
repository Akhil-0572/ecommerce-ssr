import { Injectable, signal } from '@angular/core';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Signal to hold the current toast state
  private _toast = signal<ToastData | null>(null);
  
  // Expose as readonly
  toast = this._toast.asReadonly();

  show(message: string, type: 'success' | 'error' = 'success') {
    this._toast.set({ message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.dismiss();
    }, 3000);
  }

  dismiss() {
    this._toast.set(null);
  }
}