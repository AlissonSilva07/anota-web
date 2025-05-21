import { Component } from '@angular/core';
import { CustomButtonType } from '../../shared/components/custom-button/custom-buttom.enum';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomInputType } from '../../shared/components/custom-input/input-type.enum';
import { SharedModule } from '../../shared/shared.module';
import { CustomImgPickerComponent } from "../../shared/components/custom-img-picker/custom-img-picker.component";

@Component({
  selector: 'app-register',
  imports: [CustomInputComponent, SharedModule, CustomButtonComponent, CustomImgPickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  CustomInputType = CustomInputType;
  CustomButtonType = CustomButtonType;
}
