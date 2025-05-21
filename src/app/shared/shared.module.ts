import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { CustomImgPickerComponent } from './components/custom-img-picker/custom-img-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CustomButtonComponent,
    CustomImgPickerComponent
  ],
  exports: [
    CustomInputComponent,
    CustomButtonComponent,
    CustomImgPickerComponent
  ]
})
export class SharedModule { }