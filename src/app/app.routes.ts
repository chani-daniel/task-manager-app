import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'teams',
    loadComponent: () => import('./features/teams/teams.component').then(m => m.TeamsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'teams/:teamId',
    loadComponent: () => import('./features/teams/team-details/team-details.component').then(m => m.TeamDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'teams/:teamId/projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/tasks',
    loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  }
];
