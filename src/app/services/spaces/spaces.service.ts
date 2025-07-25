import { Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Database, DataSnapshot, get, ref } from '@angular/fire/database';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Space } from '../../models/space.model'; // Ensure Note is imported if your Space model uses it
import { Note } from '../../models/note.model';
import { NoteLabel } from '../../models/note-label.model';

@Injectable({
  providedIn: 'root'
})
export class SpacesService {

  constructor(private db: Database, private firebaseAuth: Auth) { }

  getSpaces(): Observable<Space[]> {
    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser || !currentUser.uid) {
          return throwError(() => new Error('No authenticated user found.'));
        }

        const uid = currentUser.uid;

        const spacesRef = ref(this.db, `users/${uid}/spaces`);

        return from(get(spacesRef)).pipe(
          map((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
              const rawSpacesObject = snapshot.val();

              if (rawSpacesObject) {
                const spacesArray: Space[] = Object.keys(rawSpacesObject).map(key => {
                  const spaceData = rawSpacesObject[key];

                  const notesArray: Note[] | undefined = spaceData.notes
                    ? Object.keys(spaceData.notes).map(noteKey => {
                      const noteData = spaceData.notes[noteKey];
                      return {
                        id: noteKey,
                        title: noteData.title || '',
                        content: noteData.content || '',
                        spaceID: noteData.spaceID || key,
                        spaceTitle: noteData.spaceTitle || '',
                        createdAt: noteData.createdAt || '',
                        updatedAt: noteData.updatedAt || ''
                      } as Note;
                    })
                    : undefined;

                  return {
                    id: key,
                    title: spaceData.title || '',
                    description: spaceData.description || '',
                    color: spaceData.color || undefined,
                    notes: notesArray,
                    createdAt: spaceData.createdAt || '',
                    updatedAt: spaceData.updatedAt || undefined,
                  } as Space;
                });
                return spacesArray;
              } else {
                return [];
              }
            } else {
              console.log(`No spaces found for user ${uid}.`);
              return [];
            }
          }),
          catchError(error => {
            console.error('Error mapping spaces data:', error);
            return throwError(() => new Error('Failed to process spaces data.'));
          })
        );
      }),
      catchError(error => {
        console.error('Error in getSpaces pipeline:', error);
        let errorMessage = 'Failed to fetch spaces.';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
          errorMessage = `Firebase Error (${error.code}): ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getSpaceById(id: string): Observable<Space> {
    if (!id) {
      return throwError(() => new Error('Space ID must be provided.'));
    }

    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser?.uid) {
          return throwError(() => new Error('No authenticated user found.'));
        }

        const uid = currentUser.uid;
        const spaceRef = ref(this.db, `users/${uid}/spaces/${id}`);

        return from(get(spaceRef)).pipe(
          map((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
              const spaceData = snapshot.val();

              const notesArray: Note[] | undefined = spaceData.notes
                ? Object.keys(spaceData.notes).map(noteKey => {
                  const noteData = spaceData.notes[noteKey];
                  return {
                    id: noteKey,
                    title: noteData.title || '',
                    content: noteData.content || '',
                    spaceID: id,
                    spaceTitle: spaceData.title || '',
                    createdAt: noteData.createdAt || '',
                    updatedAt: noteData.updatedAt || ''
                  } as Note;
                })
                : undefined;

              return {
                id: id,
                title: spaceData.title || '',
                description: spaceData.description || '',
                color: spaceData.color || undefined,
                notes: notesArray,
                createdAt: spaceData.createdAt || '',
                updatedAt: spaceData.updatedAt || undefined,
              } as Space;

            } else {
              console.log(`No space found with ID ${id} for user ${uid}.`);
              throw new Error(`Space not found with ID: ${id}`);
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

  getAllSpaceLabels(): Observable<NoteLabel[]> {
    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser?.uid) {
          return throwError(() => new Error('Usuário não autenticado.'));
        }

        const uid = currentUser.uid;
        const spacesRef = ref(this.db, `users/${uid}/spaces`);

        return from(get(spacesRef)).pipe(
          map((snapshot: DataSnapshot) => {
            if (!snapshot.exists()) {
              return [];
            }

            const rawSpacesObject = snapshot.val();
            if (!rawSpacesObject) {
              return [];
            }

            const labels: NoteLabel[] = Object.keys(rawSpacesObject)
              .map(spaceId => {
                const spaceData = rawSpacesObject[spaceId];
                const title = spaceData?.title;

                if (!spaceId || !title) {
                  return null;
                }

                return {
                  id: spaceId,
                  label: title
                } as NoteLabel;
              })
              .filter(label => label !== null) as NoteLabel[];

            return labels;
          }),
          catchError(error => {
            console.error('Erro ao buscar ou mapear os labels dos espaços:', error);
            return throwError(() => new Error(`Erro ao buscar espaços: ${error.message || error}`));
          })
        );
      }),
      catchError(error => {
        console.error('Erro no pipeline de getAllSpaceLabels:', error);
        return throwError(() => error);
      })
    );
  }
}