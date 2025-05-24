import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';
import { ModalLayoutComponent } from '../../shared/components/modal-layout/modal-layout.component';
import { SpacesService } from '../../services/spaces/spaces.service';
import { NoteLabel } from '../../models/note-label.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedModule } from "../../shared/shared.module";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomButtonType } from '../../shared/components/custom-button/custom-buttom.enum';

@Component({
  selector: 'app-new-note',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ModalLayoutComponent,
    SharedModule,
    CustomButtonComponent
  ],
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.css'
})
export class NewNoteComponent {
  private spaceService = inject(SpacesService);
  fb: FormBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  loading = signal(false);

  CustomButtonType = CustomButtonType;

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

  spaceOptions: Signal<NoteLabel[] | undefined> = toSignal(
    this.spaceService.getAllSpaceLabels()
  );

  optionGroup = this.fb.group({
    space: ['']
  });

  confirmedSpace: WritableSignal<string | null> = signal(null);

  confirmSelection() {
    const currentSelection = this.optionGroup.controls.space.value;

    if (!currentSelection) {
      this.toastService.warning('Por favor, selecione um espaço.', 2000);
      return;
    }

    this.confirmedSpace.set(currentSelection);
    this.closeModal();
  }

  saveNote() {
    const selectedSpaceId = this.confirmedSpace();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Preencha os campos antes de prosseguir.', 3000);
      return;
    }

    if (!selectedSpaceId) {
      this.toastService.warning('Por favor, selecione um espaço para salvar a nota.', 3000);
      this.openModal();
      return;
    }
  }

  isModalOpen = signal(false);

  openModal() {
    this.optionGroup.controls.space.setValue(this.confirmedSpace());
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}