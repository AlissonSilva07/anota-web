import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserData } from '../../models/user-data.model';
import { CommonModule } from '@angular/common';
import { Space } from '../../models/space.model';

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

  spaces: Space[] = [
    {
      id: "space-zen-001",
      title: "The Zen Garden Retreat",
      description: "A digital sanctuary for mindfulness, meditation, and personal growth. Contains insights, calming visuals, and daily reflections.",
      color: "#E8F5E9", // Light Green hex
      notes: [
        {
          id: "note-zen-001",
          title: "Morning Meditation Guide",
          content: "Start your day with 10 minutes of guided meditation. Focus on your breath and observe thoughts without judgment.",
          spaceID: "space-zen-001",
          spaceTitle: "The Zen Garden Retreat",
          createdAt: "2024-05-15T08:00:00Z",
          updatedAt: "2024-05-15T08:00:00Z"
        },
        {
          id: "note-zen-002",
          title: "Gratitude Journal Prompts",
          content: "List three things you are grateful for today. Be specific. E.g., 'The warmth of my coffee,' 'A kind word from a colleague.'",
          spaceID: "space-zen-001",
          spaceTitle: "The Zen Garden Retreat",
          createdAt: "2024-05-16T10:30:00Z",
          updatedAt: "2024-05-17T14:15:00Z"
        }
      ],
      createdAt: "2024-05-14T09:00:00Z",
      updatedAt: "2024-05-21T16:00:00Z"
    },
    {
      id: "space-galaxy-002",
      title: "Galactic Explorers Club",
      description: "A community space for discussing intergalactic travel, alien civilizations, and the mysteries of the universe. For sci-fi lovers!",
      color: "#BBDEFB", // Light Blue hex
      notes: [
        {
          id: "note-galaxy-001",
          title: "Wormhole Theory Debunked?",
          content: "Recent theoretical physics suggest wormholes might not be stable enough for FTL travel without exotic matter. Discuss your thoughts!",
          spaceID: "space-galaxy-002",
          spaceTitle: "Galactic Explorers Club",
          createdAt: "2024-05-10T19:00:00Z",
          updatedAt: "2024-05-12T11:00:00Z"
        },
        {
          id: "note-galaxy-002",
          title: "Best Alien Species (Ranked)",
          content: "My top 5: 1. Vogons, 2. Klingons, 3. Xenomorphs, 4. Cylons, 5. Ewoks. What are yours and why?",
          spaceID: "space-galaxy-002",
          spaceTitle: "Galactic Explorers Club",
          createdAt: "2024-05-18T14:30:00Z",
          updatedAt: "2024-05-18T14:30:00Z"
        }
      ],
      createdAt: "2024-05-08T10:00:00Z",
      updatedAt: undefined
    }
  ]

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
