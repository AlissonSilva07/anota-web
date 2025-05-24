import { Injectable, signal, effect, PLATFORM_ID, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'app-theme';
  private isBrowser: boolean;
  private renderer: Renderer2;

  currentTheme = signal<Theme>('light');

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    rendererFactory: RendererFactory2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.renderer = rendererFactory.createRenderer(null, null);

    effect(() => {
      const theme = this.currentTheme();
      if (this.isBrowser) {
        this.applyThemeAttribute(theme);
        localStorage.setItem(this.storageKey, theme);
      }
    });

    if (this.isBrowser) {
        const storedTheme = localStorage.getItem(this.storageKey);
        if (storedTheme === 'light' || storedTheme === 'dark') {
            this.currentTheme.set(storedTheme);
        } else {
            this.applyThemeAttribute(this.currentTheme());
        }
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  toggleTheme(): void {
      this.currentTheme.update(current =>
          current === 'light' ? 'dark' : 'light'
      );
  }

  private applyThemeAttribute(theme: Theme): void {
      const htmlElement = document.documentElement;

      if (theme === 'dark') {
          this.renderer.setAttribute(htmlElement, 'data-theme', 'dark');
      } else {
          this.renderer.removeAttribute(htmlElement, 'data-theme');
      }
  }
}