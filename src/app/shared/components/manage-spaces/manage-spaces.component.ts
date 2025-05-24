import { CommonModule } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { Space } from '../../../models/space.model';
import { Router } from '@angular/router';
import { DividerComponent } from '../divider/divider.component';

@Component({
  selector: 'app-manage-spaces',
  imports: [CommonModule, DividerComponent],
  templateUrl: './manage-spaces.component.html',
  styleUrl: './manage-spaces.component.css'
})
export class ManageSpacesComponent {
  private router = inject(Router)
  spaces = input<Space[]>()

  onNavigate(id: string) {
    if (!id) return;

    this.router.navigateByUrl(`/main/espacos/${id}`)
  }
}
