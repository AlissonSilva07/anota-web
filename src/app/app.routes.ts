import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';

import { authGuard } from './guards/auth.guard';
import { EspacosComponent } from './components/espacos/espacos.component';
import { SearchComponent } from './components/search/search.component';
import { EspacoComponent } from './components/espaco/espaco.component';
import { NoteComponent } from './components/note/note.component';

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
            },
            {
                path: 'espacos',
                component: EspacosComponent
            },
            {
                path: 'espacos/:id',
                component: EspacoComponent
            },
            {
                path: 'espacos/:spaceId/nota/:noteId',
                component: NoteComponent
            },
            {
                path: 'nova-nota',
                component: NoteComponent
            },
            {
                path: 'pesquisar',
                component: SearchComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];