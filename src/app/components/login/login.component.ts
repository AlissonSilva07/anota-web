import { Component, inject } from '@angular/core';
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { CustomInputType } from '../../shared/components/custom-input/input-type.enum';
import { SharedModule } from "../../shared/shared.module";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomButtonType } from '../../shared/components/custom-button/custom-buttom.enum';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [CustomInputComponent, SharedModule, CustomButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private toastService = inject(ToastService);
  error: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);

  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  CustomInputType = CustomInputType;
  CustomButtonType = CustomButtonType;

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe({
      next: () => {
        this.toastService.success('Login successful! Welcome back.', 3000);
        this.router.navigateByUrl('/main');
      },
      error: (error) => {
        this.error = true;
        console.error('Email/Password Sign-In error:', error);
        let errorMessage = 'Login failed. Please try again.';
        if (error.code) {
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              errorMessage = 'Email ou senha incorretos.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'O email fornecido é inválido.';
              break;
            default:
              errorMessage = error.message || 'Erro de servidor. Tente novamente mais tarde.';
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.toastService.error(errorMessage, 3000);
      },
    });
  }
}
