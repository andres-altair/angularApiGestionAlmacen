import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PanelAdminComponent } from './components/usuarios/panel-admin/panel-admin.component';
import { CrearUsuarioComponent } from './components/usuarios/crear-usuario/crear-usuario.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: PanelAdminComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'crear-usuario', 
    component: CrearUsuarioComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
