import { Injectable } from '@angular/core';
import { Database, ref, get, DataSnapshot, set } from '@angular/fire/database';
import { Auth, user, User } from '@angular/fire/auth';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, take } from 'rxjs/operators';
import { UserData } from '../../models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localUserCache = new Map<string, UserData>();

  constructor(private db: Database, private firebaseAuth: Auth) { }

  getUserData(): Observable<UserData> {
    return user(this.firebaseAuth).pipe(
      take(1),
      switchMap((currentUser: User | null) => {
        if (!currentUser || !currentUser.uid) {
          return throwError(() => new Error('No authenticated user found.'));
        }

        const uid = currentUser.uid;
        console.log('Authenticated UID detected:', uid);

        const localUser = this.localUserCache.get(uid);

        if (localUser) {
          console.log('Fetching user from local cache:', localUser);
          return from([localUser]);
        }

        console.log('Fetching user from Firebase RTDB for UID:', uid);
        const userRef = ref(this.db, `users/${uid}`);

        return from(get(userRef)).pipe(
          map((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
              const rawData = snapshot.val();
              if (rawData) {
                const userData: UserData = {
                  uid: uid,
                  name: rawData.name || '',
                  email: rawData.email || '',
                  profileImage: rawData.profileImage || undefined
                };

                if (!userData.name) {
                  console.warn(`User ${uid} data missing 'name'.`);
                }

                this.localUserCache.set(uid, userData);
                console.log('Fetched user from RTDB and cached:', userData);
                return userData;
              } else {
                throw new Error('User data is null from database.');
              }
            } else {
              throw new Error('User not found in database.');
            }
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching user data from RTDB pipeline:', error);
        let errorMessage = 'Failed to fetch user data.';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && error.code) {
          errorMessage = `Firebase Error (${error.code}): ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}