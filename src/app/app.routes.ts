import { authGuard } from './auth/guards/auth-guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
  { path: 'tasks', loadComponent: () => import('./task/task-list/task-list').then(m => m.TaskList) },
  { path: 'tasks/create', loadComponent: () => import('./task/task-create/task-create').then(m => m.TaskCreate) },
  { path: 'tasks/:id/edit', loadComponent: () => import('./task/task-edit/task-edit').then(m => m.TaskEdit) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
