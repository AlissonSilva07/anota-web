import { Component, inject, signal } from '@angular/core';
import { Space } from '../../models/space.model';
import { SpacesService } from '../../services/spaces/spaces.service';
import { CommonModule } from '@angular/common';
import { ManageSpacesComponent } from '../../shared/components/manage-spaces/manage-spaces.component';
import { ModalLayoutComponent } from '../../shared/components/modal-layout/modal-layout.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CustomButtonType } from '../../shared/components/custom-button/custom-buttom.enum';
import { CustomInputType } from '../../shared/components/custom-input/input-type.enum';
import { FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-espacos',
  imports: [CommonModule, ManageSpacesComponent, CustomInputComponent, CustomButtonComponent, ModalLayoutComponent, ReactiveFormsModule],
  templateUrl: './espacos.component.html',
  styleUrl: './espacos.component.css'
})
export class EspacosComponent {
  private spacesService = inject(SpacesService);
  private toastService = inject(ToastService);

  spaces = signal<Space[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  fb: FormBuilder = inject(FormBuilder);

  CustomButtonType = CustomButtonType;
  CustomInputType = CustomInputType;

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    color: ['#1100ff', Validators.required]
  });

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

  onSubmit(): void {
     this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastService.warning('Por favor, preencha os campos antes de prosseguir.', 3000);
      return;
    }

    console.log(this.form.value)
  }

  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
