import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Note } from '../../../models/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes-list',
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent {
  private router = inject(Router)
  notes = input<Note[] | undefined>([])

  onNavigate(spaceId: string, noteId: string) {
    if (!spaceId) return;
    if (!noteId) return;

    this.router.navigateByUrl(`/main/espacos/${spaceId}/nota/${noteId}`)
  }
}
