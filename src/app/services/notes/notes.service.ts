import { Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Database, DataSnapshot, get, push, ref, update } from '@angular/fire/database';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Note } from '../../models/note.model';

export type UpdateNotePayload = Pick<Note, 'title' | 'content' | 'updatedAt'>;

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private db: Database, private firebaseAuth: Auth) { }

  searchNotes(query: string): Observable<Note[]> {
    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser || !currentUser.uid) {
          return throwError(() => new Error('No authenticated user found.'));
        }

        const uid = currentUser.uid;

        const notesRef = ref(this.db, `users/${uid}/noteHistory`);

        return from(get(notesRef)).pipe(
          map((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
              const rawNotesObject = snapshot.val();

              if (rawNotesObject) {
                const notesArray: Note[] = Object.keys(rawNotesObject).map(key => {
                  const noteData = rawNotesObject[key];
                  return {
                    id: key,
                    title: noteData.title || '',
                    content: noteData.content || '',
                    spaceID: noteData.spaceID || '',
                    spaceTitle: noteData.spaceTitle || '',
                    createdAt: noteData.createdAt || '',
                    updatedAt: noteData.updatedAt || ''
                  } as Note;
                });
                return notesArray;
              } else {
                return [];
              }
            } else {
              console.log(`No note history found for user ${uid}.`);
              return [];
            }
          }),
          map(notes => {
            const lowerCaseQuery = query.toLowerCase();
            return notes.filter(note =>
              note.title.toLowerCase().includes(lowerCaseQuery) ||
              note.content.toLowerCase().includes(lowerCaseQuery)
            );
          }),
          catchError(error => {
            console.error('Error processing notes data:', error);
            return throwError(() => new Error('Failed to process notes data for search.'));
          })
        );
      }),
      catchError(error => {
        console.error('Error in searchNotes pipeline:', error);
        let errorMessage = 'Failed to search notes.';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
          errorMessage = `Firebase Error (${error.code}): ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  saveNote(note: Note): Observable<string> {
    let uid: string;
    let spaceTitle: string;
    let noteId: string;

    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser || !currentUser.uid) {
          return throwError(() => new Error('Usuário não autenticado.'));
        }
        uid = currentUser.uid;
        const spaceRef = ref(this.db, `users/${uid}/spaces/${note.spaceID}`);
        return from(get(spaceRef));
      }),
      switchMap((spaceSnapshot: DataSnapshot) => {
        if (!spaceSnapshot.exists()) {
          return throwError(() => new Error('Espaço não encontrado.'));
        }
        const spaceVal = spaceSnapshot.val();
        spaceTitle = spaceVal?.title;
        if (!spaceTitle) {
          return throwError(() => new Error('Título do espaço não encontrado.'));
        }

        const notesRef = ref(this.db, `users/${uid}/spaces/${note.spaceID}/notes`);
        const newNoteRef = push(notesRef);
        noteId = newNoteRef.key || '';

        if (!noteId) {
          return throwError(() => new Error('Falha ao gerar ID da nota.'));
        }

        const noteMap = {
          id: noteId,
          title: note.title,
          content: note.content,
          spaceID: note.spaceID,
          spaceTitle: spaceTitle,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        };

        const updates: { [key: string]: any } = {};
        updates[`/users/${uid}/spaces/${note.spaceID}/notes/${noteId}`] = noteMap;
        updates[`/users/${uid}/noteHistory/${noteId}`] = noteMap;

        return from(update(ref(this.db), updates));
      }),
      map(() => noteId),
      catchError(error => {
        console.error('Erro ao salvar a nota:', error);
        return throwError(() => error instanceof Error ? error : new Error('Falha ao salvar a nota. ' + (error?.message || '')));
      })
    );
  }

  getNoteById(spaceId: string, noteId: string): Observable<Note> {
    if (!spaceId) {
      return throwError(() => new Error('Space ID must be provided.'));
    }

    if (!noteId) {
      return throwError(() => new Error('Note ID must be provided.'));
    }

    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser?.uid) {
          return throwError(() => new Error('No authenticated user found.'));
        }

        const uid = currentUser.uid;
        const spaceRef = ref(this.db, `users/${uid}/spaces/${spaceId}/notes/${noteId}`);

        return from(get(spaceRef)).pipe(
          map((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
              const noteData = snapshot.val();

              return noteData

            } else {
              console.log(`No space found with ID ${spaceId} for user ${uid}.`);
              throw new Error(`Space not found with ID: ${spaceId}`);
            }
          }),
          catchError(error => {
            console.error('Error fetching or mapping space data:', error);
            return throwError(() => error);
          })
        );
      }),
      catchError(error => {
        console.error('Error in getSpaceById pipeline:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch space.';
        return throwError(() => new Error(message));
      })
    );
  }

  editNoteById(spaceId: string, noteId: string, updatedData: UpdateNotePayload): Observable<void> {
    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser || !currentUser.uid) {
          return throwError(() => new Error('Usuário não autenticado.'));
        }
        const uid = currentUser.uid;
        const noteRef = ref(this.db, `users/${uid}/spaces/${spaceId}/notes/${noteId}`);

        return from(get(noteRef)).pipe(
          switchMap(snapshot => {
            if (!snapshot.exists()) {
              return throwError(() => new Error('Nota não encontrada.'));
            }
            return from(update(noteRef, updatedData));
          })
        );
      }),
      catchError(error => {
        console.error('Erro ao editar a nota:', error);
        return throwError(() => error instanceof Error ? error : new Error('Falha ao editar a nota. ' + (error?.message || '')));
      })
    );
  }
}
