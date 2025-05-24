import { Component, inject, signal } from '@angular/core';
import { Space } from '../../models/space.model';
import { SpacesService } from '../../services/spaces/spaces.service';
import { CommonModule } from '@angular/common';
import { ManageSpacesComponent } from '../../shared/components/manage-spaces/manage-spaces.component';

@Component({
  selector: 'app-espacos',
  imports: [CommonModule, ManageSpacesComponent],
  templateUrl: './espacos.component.html',
  styleUrl: './espacos.component.css'
})
export class EspacosComponent {
  private spacesService = inject(SpacesService);

  spaces = signal<Space[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchSpaces();
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
}
