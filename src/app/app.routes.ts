import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registrar',
        component: RegisterComponent
    },
    {
        path: 'main',
        component: MainComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: HomeComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];