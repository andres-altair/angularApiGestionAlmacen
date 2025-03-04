import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  { 
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'noAdmin',
    loadComponent: () => import('./components/no-admin/no-admin.component').then(m => m.NoAdminComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/usuarios/panel-admin/panel-admin.component').then(m => m.PanelAdminComponent),
    canActivate: [AuthGuard,AdminGuard]
  },
  {
    path: 'crear-usuario',
    loadComponent: () => import('./components/usuarios/crear-usuario/crear-usuario.component').then(m => m.CrearUsuarioComponent),
    canActivate: [AuthGuard,AdminGuard]
  },
  {
    path: 'editar-usuario/:id',
    loadComponent: () => import('./components/usuarios/editar-usuario/editar-usuario.component').then(m => m.EditarUsuarioComponent),
    canActivate: [AuthGuard,AdminGuard]
  },
  {
    path: 'eliminar-usuario',
    loadComponent: () => import('./components/usuarios/eliminar-usuario/eliminar-usuario.component').then(m => m.EliminarUsuarioComponent),
    canActivate: [AuthGuard,AdminGuard]
  },
  { 
    path: '**', 
    redirectTo: '',
    canActivate: [AuthGuard]
  }
];
