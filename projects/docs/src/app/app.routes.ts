import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'bandeira-ui — design system em Angular',
    loadComponent: () => import('./pages/smoke/smoke.component').then((m) => m.SmokeComponent),
  },
  { path: '**', redirectTo: '' },
];
