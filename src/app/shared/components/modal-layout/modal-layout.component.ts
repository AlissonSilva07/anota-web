import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-layout',
  imports: [],
  templateUrl: './modal-layout.component.html',
  styleUrl: './modal-layout.component.css'
})
export class ModalLayoutComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;

  @Output() closeRequest = new EventEmitter<void>();

  requestClose() {
    this.closeRequest.emit();
  }
}
