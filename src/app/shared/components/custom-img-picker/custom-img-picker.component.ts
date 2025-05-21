import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-custom-img-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-img-picker.component.html',
  styleUrl: './custom-img-picker.component.css'
})
export class CustomImgPickerComponent {
  imageUrl = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl.set(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }
}
