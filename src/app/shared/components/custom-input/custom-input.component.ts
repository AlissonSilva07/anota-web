import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputType } from './input-type.enum';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css'
})

export class CustomInputComponent {
  @Input() placeholder: string = "";
  @Input() type: CustomInputType = CustomInputType.DEFAULT;

  isPasswordVisible = signal(false);

  showToggleIcon = computed(() => this.type === CustomInputType.PASSWORD);
  togglePasswordVisibility() {
    this.isPasswordVisible.update((prev) => !prev);
  }

  inputType = computed(() => {
    if (this.type === CustomInputType.PASSWORD) {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return 'text';
  });
}
