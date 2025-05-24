import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Space } from '../../models/space.model';
import { SpacesService } from '../../services/spaces/spaces.service';
import { CommonModule, Location } from '@angular/common'; // 1. Import Location
import { NotesListComponent } from '../../shared/components/notes-list/notes-list.component';

@Component({
  selector: 'app-espaco',
  imports: [NotesListComponent, CommonModule],
  templateUrl: './espaco.component.html',
  styleUrl: './espaco.component.css'
})
export class EspacoComponent {
  private location = inject(Location)
  private route = inject(ActivatedRoute);
  private spacesService = inject(SpacesService)
  espacoId: string | null = null;

  spaceDetails = signal<Space>({} as Space);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.espacoId = this.route.snapshot.params['id']; 

    if (this.espacoId) this.fetchSpaceById(this.espacoId);
  }

  fetchSpaceById(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.spaceDetails.set({} as Space);

    this.spacesService.getSpaceById(id).subscribe({
      next: (data) => {
        console.log('Fetched space:', data);
        this.spaceDetails.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message || 'Erro ao buscar espaços.');
        this.isLoading.set(false);
        console.error('Erro ao buscar espaços', err);
      }
    });
  }

  goBack() {
    this.location.back()
  }
}
