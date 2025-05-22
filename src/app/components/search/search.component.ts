import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { Note } from '../../models/note.model';
import { NotesService } from '../../services/notes/notes.service';

import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, filter } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  private notesService = inject(NotesService);

  searchControl = new FormControl('');

  searchResults = signal<Note[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => typeof query === 'string' && query.trim().length > 0),
      switchMap(query => {
        if (!query || query.trim() === '') {
          this.searchResults.set([]);
          this.isLoading.set(false);
          this.error.set(null);
          return of([]);
        }

        this.isLoading.set(true);
        this.error.set(null);

        return this.notesService.searchNotes(query.trim()).pipe(
          catchError(err => {
            console.error('Search error:', err);
            this.error.set(err.message || 'An unknown error occurred during search.');
            this.isLoading.set(false);
            return of([]);
          })
        );
      }),
      tap(results => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      })
    ).subscribe();
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.searchResults.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }
}