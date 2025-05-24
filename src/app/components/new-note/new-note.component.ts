import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-new-note',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.css'
})
export class NewNoteComponent {
  fb: FormBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
  });

  get title() {
    return this.form.get('title');
  }

  get content() {
    return this.form.get('content');
  }

  saveNote() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Preencha os campos antes de prosseguir.', 3000);

      return;
    }
  }
}