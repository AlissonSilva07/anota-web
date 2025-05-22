import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastMessage } from '../../shared/components/custom-toast/custom-toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

  private nextId = 0; // Simple ID generator

  constructor() { }

  /**
   * Shows a success toast notification.
   * @param message The message to display.
   * @param duration Optional duration in milliseconds.
   */
  success(message: string, duration: number) {
    this.showToast({ message, type: 'success', duration });
  }

  /**
   * Shows an error toast notification.
   * @param message The message to display.
   * @param duration Optional duration in milliseconds.
   */
  error(message: string, duration: number) {
    this.showToast({ message, type: 'error', duration });
  }

  /**
   * Shows a warning toast notification.
   * @param message The message to display.
   * @param duration Optional duration in milliseconds.
   */
  warning(message: string, duration: number) {
    this.showToast({ message, type: 'warning', duration });
  }

  /**
   * Shows an info toast notification.
   * @param message The message to display.
   * @param duration Optional duration in milliseconds.
   */
  info(message: string, duration: number) {
    this.showToast({ message, type: 'info', duration });
  }

  /**
   * Adds a toast message to the list and sets a timer for removal.
   * @param toast The ToastMessage object.
   */
  private showToast(toast: Omit<ToastMessage, 'id'>) { // Omit 'id' as we generate it here
    const currentToasts = this.toastsSubject.value;
    const newToast: ToastMessage = { ...toast, id: `toast-${this.nextId++}` };
    this.toastsSubject.next([...currentToasts, newToast]);

    // Auto-remove after duration
    if (newToast.duration !== 0 && newToast.duration !== undefined) {
      setTimeout(() => {
        this.removeToast(newToast.id!); // Use the generated ID
      }, newToast.duration);
    }
  }

  /**
   * Removes a toast message by its ID.
   * This is called by the toast component when it closes itself.
   * @param id The ID of the toast to remove.
   */
  removeToast(id: string) {
    const updatedToasts = this.toastsSubject.value.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }
}