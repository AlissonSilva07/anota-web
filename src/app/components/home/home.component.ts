import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserData } from '../../models/user-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);

  userData = signal<UserData | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchUserData();
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

  getProfileImageUrl(): string {
    const base64Image = this.userData()?.profileImage;
    if (base64Image) {
      return `data:image/jpeg;base64,${base64Image}`;
    }
    return '';
  }
}
