import { Component, inject, OnInit, signal } from '@angular/core';
import { LogoSvgComponent } from "../logo-svg/logo-svg.component";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

interface NavTreeItem {
  id: number;
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [LogoSvgComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  authService: AuthService = inject(AuthService);

  items: NavTreeItem[] = [
    {
      id: 1,
      title: 'Home',
      icon: 'home',
      route: '/main/home'
    },
    {
      id: 2,
      title: 'Espaços',
      icon: 'workspaces',
      route: '/main/espacos'
    },
    {
      id: 3,
      title: 'Pesquisar',
      icon: 'search',
      route: '/main/pesquisar'
    },
    {
      id: 4,
      title: 'Perfil',
      icon: 'person',
      route: '/main/perfil'
    }
  ];

  currentRoute = signal<string>('');

  constructor(private router: Router) { }

  ngOnInit() {
    this.currentRoute.set(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.urlAfterRedirects);
    });
  }

  navigateTo(path: string): void {
    const current = this.currentRoute();

    if (current === path) {
      return;
    }

    this.router.navigate([path]);
  }

  isActive(path: string, exact: boolean = false): boolean {
    const current = this.currentRoute();
    const result = exact
      ? current === path
      : current.startsWith(path) &&
      (current.length === path.length || current[path.length] === '/' || current[path.length] === '?');
    return result;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
