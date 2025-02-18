import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.scss']
})
export class PanelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading: boolean = true; // Variable para indicar si se están cargando los datos
  error: string | null = null; // Variable para almacenar mensajes de error

  constructor(private usuarioService: UsuarioService, private router: Router) { }

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
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          //this.cargarUsuarios(); // Recargar la lista después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
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


  
}

