import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';
import { ModalLayoutComponent } from '../../shared/components/modal-layout/modal-layout.component';
import { SpacesService } from '../../services/spaces/spaces.service';
import { NoteLabel } from '../../models/note-label.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedModule } from "../../shared/shared.module";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomButtonType } from '../../shared/components/custom-button/custom-buttom.enum';
import { NotesService, UpdateNotePayload } from '../../services/notes/notes.service';
import { Note } from '../../models/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, tap, switchMap } from 'rxjs';

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
export class NoteComponent implements OnInit {
  private spaceService = inject(SpacesService);
  private noteService = inject(NotesService)
  private router = inject(Router)
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private location = inject(Location)

  fb: FormBuilder = inject(FormBuilder);
  response = signal<string>("")
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  spaceId: string | null = null;
  noteId: string | null = null;
  isEditMode = signal<boolean>(false);
  currentNoteId = signal<string | null>(null);

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

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => ({
        spaceId: params.get('spaceId'),
        noteId: params.get('noteId')
      })),
      filter(params => !!params.spaceId && !!params.noteId),
      tap(params => {
        this.isEditMode.set(true);
        this.currentNoteId.set(params.noteId);
        this.isLoading.set(true);
      }),
      switchMap(params =>
        this.noteService.getNoteById(params.spaceId!, params.noteId!)
      )
    ).subscribe({
      next: (note) => {
        if (note) {
          this.fillFormWithNoteData(note);
        } else {
          this.errorMessage.set('Nota não encontrada.');
          this.toastService.error('A nota que você tentou carregar não foi encontrada.', 4000);
          this.router.navigateByUrl('/main');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erro ao carregar a nota.');
        this.toastService.error(`Erro ao carregar: ${err.message}`, 4000);
        this.isLoading.set(false);
        console.error('Erro ao carregar nota', err);
      }
    });
  }

  private fillFormWithNoteData(note: Note): void {
    this.form.patchValue({
      title: note.title,
      content: note.content
    });
    this.confirmedSpaceId.set(note.spaceID);
  }

  confirmSelection() {
    const currentSelectionId = this.optionGroup.controls.space.value;

    if (!currentSelectionId) {
      this.toastService.warning('Por favor, selecione um espaço.', 2000);
      return;
    }

    this.confirmedSpaceId.set(currentSelectionId);
    this.closeModal();
  }

  goBack() {
    this.location.back()
  }

  saveNote() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.isEditMode()) {
      const noteIdToUpdate = this.currentNoteId();
      const spaceId = this.confirmedSpaceId();

      if (!noteIdToUpdate || !spaceId) {
        this.toastService.error('Erro: ID da nota ou do espaço não encontrado para edição.', 3000);
        this.isLoading.set(false);
        return;
      }

      const updatePayload: UpdateNotePayload = {
        title: this.form.value.title || '',
        content: this.form.value.content || '',
        updatedAt: new Date().toISOString()
      };

      this.noteService.editNoteById(spaceId, noteIdToUpdate, updatePayload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastService.success('Nota atualizada com sucesso!', 2000);
          this.router.navigateByUrl(`/main/espacos/${spaceId}/nota/${noteIdToUpdate}`);
        },
        error: (err: Error) => {
          this.errorMessage.set(err.message || 'Erro ao atualizar nota.');
          this.isLoading.set(false);
          this.toastService.error('Falha ao atualizar a nota.', 3000);
          console.error('Erro ao atualizar nota', err);
        }
      });

    } else {
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