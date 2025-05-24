import { Component, computed, Input, signal } from '@angular/core';
import { CustomButtonType } from './custom-buttom.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css'
})
export class CustomButtonComponent {
  private _type = signal<CustomButtonType>(CustomButtonType.DEFAULT);

  @Input()
  set type(value: CustomButtonType) {
    this._type.set(value);
  }

  @Input() disabled: boolean = false;

  bgColor = computed(() => {
    switch (this._type()) {
      case CustomButtonType.MUTED:
        return '--background-color';
      case CustomButtonType.DISABLED:
        return '--secondary-text-color';
      default:
        return '--primary-color';
    }
  });

  textColor = computed(() => {
    switch (this._type()) {
      case CustomButtonType.MUTED:
        return '--primary-text-color';
      case CustomButtonType.DISABLED:
        return '--secondary-text-color';
      default:
        return '--background-color';
    }
  });

  isDisabled = computed(() => this.disabled || this._type() === CustomButtonType.DISABLED);
}
