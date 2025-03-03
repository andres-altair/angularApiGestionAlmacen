import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario';
import { MenuComponent } from "../../menu/menu.component";

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MenuComponent
],
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.scss']
})
export class PanelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading: boolean = true; // Variable para indicar si se están cargando los datos
  error: string | null = null; // Variable para almacenar mensajes de error
  displayedColumns: string[] = ['foto', 'nombreCompleto', 'correoElectronico', 'movil', 'rolId', 'fechaCreacion', 'acciones'];

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
    this.loading = true; // Indica que se están cargando los datos
    this.error = null; // Inicializa el mensaje de error

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        
        this.loading = false; // Indica que se han cargado los datos
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'Error al cargar los usuarios. Por favor, inténtalo de nuevo más tarde.'; // Muestra un mensaje de error
        this.loading = false; // Indica que la carga ha terminado (con error)
      }
    });
  }

  eliminarUsuario(id: number) {
    this.router.navigate(['/eliminar-usuario'], { queryParams: { id: id } });
  }

  irACrearUsuario() {
    console.log('Intentando navegar a crear usuario...');
    this.router.navigateByUrl('/crear-usuario').then(
      success => {
        console.log('Resultado de la navegación:', success);
        if (!success) {
          console.error('Error al navegar a crear usuario');
        }
      },
      error => console.error('Error en navegación:', error)
    );
  }

  editarUsuario(id: number) {
    console.log('Editando usuario con ID:', id);
    this.router.navigate(['/editar-usuario', id]);
  }
}
