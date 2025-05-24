import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { CustomImgPickerComponent } from './components/custom-img-picker/custom-img-picker.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LogoSvgComponent } from './components/logo-svg/logo-svg.component';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { ManageSpacesComponent } from './components/manage-spaces/manage-spaces.component';
import { ThemeSwitcherButtonComponent } from './components/theme-switcher-button/theme-switcher-button.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ModalLayoutComponent } from './components/modal-layout/modal-layout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CustomButtonComponent,
    CustomImgPickerComponent,
    SidebarComponent,
    LogoSvgComponent,
    CustomToastComponent,
    ManageSpacesComponent,
    ThemeSwitcherButtonComponent,
    NotesListComponent,
    BackButtonComponent,
    ModalLayoutComponent,
  ],
  exports: [
    CustomInputComponent,
    CustomButtonComponent,
    CustomImgPickerComponent,
    SidebarComponent,
    LogoSvgComponent,
    CustomToastComponent,
    ManageSpacesComponent,
    ThemeSwitcherButtonComponent,
    NotesListComponent,
    BackButtonComponent,
    ModalLayoutComponent,
  ]
})
export class SharedModule { }