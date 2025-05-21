import { Component, OnInit } from '@angular/core';
import { LogoSvgComponent } from "../logo-svg/logo-svg.component";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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
  items: NavTreeItem[] = [
    {
      id: 1,
      title: 'Home',
      icon: 'home',
      route: '/home'
    },
    {
      id: 2,
      title: 'Espaços',
      icon: 'workspaces',
      route: '/espacos'
    },
    {
      id: 3,
      title: 'Pesquisar',
      icon: 'search',
      route: '/pesquisar'
    },
    {
      id: 4,
      title: 'Perfil',
      icon: 'person',
      route: '/perfil'
    }
  ];

  currentRoute: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string, exact: boolean = false): boolean {
    if (exact) {
      return this.currentRoute === path;
    }
    return this.currentRoute.startsWith(path) &&
           (this.currentRoute.length === path.length || this.currentRoute[path.length] === '/' || this.currentRoute[path.length] === '?');
  }
}
