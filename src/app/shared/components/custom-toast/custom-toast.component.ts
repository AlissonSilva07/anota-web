import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, timer, takeUntil } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';


export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id?: string; 
  message: string;
  type: ToastType;
  duration?: number;
  showProgress?: boolean;
}

@Component({
  selector: 'app-custom-toast',
  imports: [CommonModule],
  templateUrl: './custom-toast.component.html',
  styleUrl: './custom-toast.component.css',
  animations: [
    trigger('toastAnimation', [
      state('void', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('void => *', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class CustomToastComponent implements OnInit, OnDestroy {

  @Input() message: string = '';
  @Input() type: ToastType = 'info';
  @Input() duration: number = 3000;
  @Input() showProgress: boolean = true;
  @Input() toastId: string = '';

  state: 'void' | '*' = '*';

  private destroy$ = new Subject<void>();
  private autoHideTimer: any;

  ngOnInit() {
    this.startAutoHideTimer();
  }

  ngOnDestroy() {
    clearTimeout(this.autoHideTimer);
    this.destroy$.next();
    this.destroy$.complete();
  }

  getIcon(): string {
    switch (this.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  closeToast() {
    this.state = 'void';
    timer(300)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      });
  }

  private startAutoHideTimer() {
    clearTimeout(this.autoHideTimer);
    if (this.duration > 0) {
      this.autoHideTimer = setTimeout(() => {
        this.closeToast();
      }, this.duration);
    }
  }

  onMouseEnter() {
    clearTimeout(this.autoHideTimer);
    const progressBar = (this.elementRef.nativeElement as HTMLElement).querySelector('.toast-progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.style.animationPlayState = 'paused';
    }
  }

  onMouseLeave() {
    this.startAutoHideTimer();
    const progressBar = (this.elementRef.nativeElement as HTMLElement).querySelector('.toast-progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.style.animationPlayState = 'running';
    }
  }

  private elementRef = inject(ElementRef);
}
