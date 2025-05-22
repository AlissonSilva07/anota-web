import { Component, inject } from '@angular/core';
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { CustomInputType } from '../../shared/components/custom-input/input-type.enum';
import { SharedModule } from "../../shared/shared.module";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomButtonType } from '../../shared/components/custom-button/custom-buttom.enum';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CustomInputComponent, SharedModule, CustomButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
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
        this.router.navigateByUrl('/main');
      },
      error: (error) => {
        this.error = true;
        console.error('Email/Password Sign-In error:', error);
      },
    });
  }
}
