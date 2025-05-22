import { Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Database, DataSnapshot, get, ref } from '@angular/fire/database';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Space } from '../../models/space.model'; // Ensure Note is imported if your Space model uses it
import { Note } from '../../models/note.model';

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

        // Reference to the user's 'spaces' sub-collection
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
}