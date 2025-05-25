import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
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
import { NotesService } from '../../services/notes/notes.service';
import { Note } from '../../models/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-note',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ModalLayoutComponent,
    SharedModule,
    CustomButtonComponent
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent {
  private spaceService = inject(SpacesService);
  private noteService = inject(NotesService)
  private router = inject(Router)
  fb: FormBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  response = signal<string>("")
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

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

  confirmedSpaceId: WritableSignal<string | null> = signal(null);

  confirmedSpaceLabel: Signal<string | null> = computed(() => {
    const id = this.confirmedSpaceId();
    if (!id) return null;
    return this.spaceOptions()?.find(opt => opt.id === id)?.label || null;
  });

  confirmSelection() {
    const currentSelectionId = this.optionGroup.controls.space.value;

    if (!currentSelectionId) {
      this.toastService.warning('Por favor, selecione um espaço.', 2000);
      return;
    }

    this.confirmedSpaceId.set(currentSelectionId);
    this.closeModal();
  }

  saveNote() {
    const selectedSpaceId = this.confirmedSpaceId();

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

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: Note = {
      title: this.form.value.title || '',
      content: this.form.value.content || '',
      spaceTitle: this.confirmedSpaceLabel() || '',
      spaceID: selectedSpaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.noteService.saveNote(payload).subscribe({
      next: (newNoteId) => {
        this.response.set(newNoteId);
        this.isLoading.set(false);
        this.toastService.success('Nota salva com sucesso!', 2000);
        this.form.reset();
        this.confirmedSpaceId.set(null);
        this.router.navigateByUrl(`/main/espacos/${selectedSpaceId}`)
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message || 'Erro ao salvar nota.');
        this.isLoading.set(false);
        this.toastService.error('Falha ao salvar a nota.', 3000);
        console.error('Erro ao salvar nota', err);
      }
    });
  }

  isModalOpen = signal(false);

  openModal() {
    this.optionGroup.controls.space.setValue(this.confirmedSpaceId());
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}