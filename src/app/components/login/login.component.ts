import { Component, inject } from '@angular/core';
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { CustomInputType } from '../../shared/components/custom-input/input-type.enum';
import { SharedModule } from "../../shared/shared.module";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomButtonType } from '../../shared/components/custom-button/custom-buttom.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CustomInputComponent, SharedModule, CustomButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);

  CustomInputType = CustomInputType;
  CustomButtonType = CustomButtonType;

  gotoMain = () => {
    this.router.navigate(['/main']);
  };
}
