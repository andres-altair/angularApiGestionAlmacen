import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PanelAdminComponent } from './components/usuarios/panel-admin/panel-admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: PanelAdminComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin' }
];
