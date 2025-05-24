import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-theme-switcher-button',
  imports: [],
  templateUrl: './theme-switcher-button.component.html',
  styleUrl: './theme-switcher-button.component.css'
})
export class ThemeSwitcherButtonComponent {
  themeService = inject(ThemeService);
  currentTheme = this.themeService.currentTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
