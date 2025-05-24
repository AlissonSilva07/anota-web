import { Component, computed, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-logo-svg',
  standalone: true,
  imports: [],
  templateUrl: './logo-svg.component.html',
  styleUrl: './logo-svg.component.css'
})
export class LogoSvgComponent {
  themeService = inject(ThemeService);
  currentTheme = this.themeService.currentTheme;

  fillColor = computed(() => {
    const theme = this.currentTheme();
    return theme === 'dark' ? '#FAFAFA' : '#1C1C1C';
  });

}
