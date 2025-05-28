import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserData } from '../../models/user-data.model';
import { CommonModule } from '@angular/common';
import { Space } from '../../models/space.model';
import { SpacesService } from '../../services/spaces/spaces.service';
import { ManageSpacesComponent } from "../../shared/components/manage-spaces/manage-spaces.component";
import { FloatingActionButtonComponent } from "../../shared/components/floating-action-button/floating-action-button.component";
import { Note } from '../../models/note.model';
import { LastReadNoteComponent } from '../../shared/components/last-read-note/last-read-note.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LastReadNoteComponent, ManageSpacesComponent, FloatingActionButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private spacesService = inject(SpacesService);

  userData = signal<UserData | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  spaces = signal<Space[]>([]);
  lastReadNote = signal<Note>({} as Note)

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchLastReadNote();
    this.fetchSpaces();
  }

  fetchUserData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.userData.set(null);

    this.userService.getUserData().subscribe({
      next: (data) => {
        this.userData.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message || 'An unknown error occurred while fetching profile.');
        this.isLoading.set(false);
        console.error('Error fetching user data in component:', err);
      }
    });
  }

  fetchLastReadNote() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const localStorageNote = localStorage.getItem('last-read-note')
    if (localStorageNote) {
      const parsedNote: Note = JSON.parse(localStorageNote)
      this.lastReadNote.set(parsedNote)
      this.isLoading.set(false)
    } else {
      this.errorMessage.set('Erro ao buscar última nota lida');
      this.isLoading.set(false)
    }
  }

  fetchSpaces(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.spaces.set([]);

    this.spacesService.getSpaces().subscribe({
      next: (data) => {
        this.spaces.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message || 'Erro ao buscar espaços.');
        this.isLoading.set(false);
        console.error('Erro ao buscar espaços', err);
      }
    });
  }

  getProfileImageUrl(): string {
    const base64Image = this.userData()?.profileImage;
    if (base64Image) {
      return `data:image/jpeg;base64,${base64Image}`;
    }
    return '';
  }
}
