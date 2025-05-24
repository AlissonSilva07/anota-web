import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Space } from '../../../models/space.model';

@Component({
  selector: 'app-manage-spaces',
  imports: [CommonModule],
  templateUrl: './manage-spaces.component.html',
  styleUrl: './manage-spaces.component.css'
})
export class ManageSpacesComponent {
  spaces = input<Space[]>()


}
