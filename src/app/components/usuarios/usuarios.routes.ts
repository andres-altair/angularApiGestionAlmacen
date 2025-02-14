import { Routes } from '@angular/router';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { PanelAdminComponent } from './panel-admin/panel-admin.component';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    component: PanelAdminComponent
  },
  {
    path: 'crear',
    component: CrearUsuarioComponent
  },
  {
    path: 'editar/:id',
    component: CrearUsuarioComponent
  }
];
