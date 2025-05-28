import { Component, inject, input } from '@angular/core';
import { Note } from '../../../models/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-last-read-note',
  imports: [],
  templateUrl: './last-read-note.component.html',
  styleUrl: './last-read-note.component.css'
})
export class LastReadNoteComponent {
  private router = inject(Router)
  lastReadNote = input<Note>()

  onNavigate(spaceId: string, noteId: string) {
    if (!spaceId || !noteId) return;

    this.router.navigateByUrl(`/main/espacos/${spaceId}/nota/${noteId}`)
  }
}
