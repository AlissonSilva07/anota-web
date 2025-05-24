import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Note } from '../../../models/note.model';
import { DividerComponent } from '../divider/divider.component';

@Component({
  selector: 'app-notes-list',
  imports: [CommonModule, DividerComponent],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent {
  notes = input<Note[] | undefined>([])
}
