import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from './services/toast/toast.service';
import { ToastMessage, CustomToastComponent } from './shared/components/custom-toast/custom-toast.component';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SharedModule, CustomToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'anota';

  toastService = inject(ToastService);
  toasts$: Observable<ToastMessage[]> = this.toastService.toasts$;
}
