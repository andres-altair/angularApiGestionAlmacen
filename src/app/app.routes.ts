import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'panel-admin',
    loadComponent: () => import('./components/usuarios/panel-admin/panel-admin.component').then(m => m.PanelAdminComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'crear-usuario',
    loadComponent: () => import('./components/usuarios/crear-usuario/crear-usuario.component').then(m => m.CrearUsuarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/panel-admin',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/panel-admin' }
];
