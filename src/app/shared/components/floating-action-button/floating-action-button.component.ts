import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-action-button',
  imports: [],
  templateUrl: './floating-action-button.component.html',
  styleUrl: './floating-action-button.component.css'
})
export class FloatingActionButtonComponent {
  private router = inject(Router);

  @Input() link: string | null = null

  navigate() {
    if (!this.link) return;    
    this.router.navigateByUrl(this.link);
  }
}
