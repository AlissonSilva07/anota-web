import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';
import { ModalLayoutComponent } from '../../shared/components/modal-layout/modal-layout.component';

@Component({
  selector: 'app-new-note',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ModalLayoutComponent
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

  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}