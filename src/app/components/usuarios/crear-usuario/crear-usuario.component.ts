import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { CrearUsuario } from '../../../models/crearUsuario';
import { Rol } from '../../../models/rol';
import { AuthService } from '../../../services/auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  usuarioForm!: FormGroup;
  roles: Rol[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  fotoSeleccionada?: string;

  ngOnInit() {
    // Verificar si el usuario está autenticado
    const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  this.router.navigate(['/login']);
  return;
}

    this.initForm();
    this.cargarRoles();
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(50)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      movil: ['', [Validators.maxLength(15)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rolId: ['', [Validators.required]],
      foto: [undefined]
    });
  }

  private cargarRoles() {
    this.roles = [
      { id: 1, rol: 'Administrador' },
      { id: 2, rol: 'Gestor' },
      { id: 3, rol: 'Operario' },
      { id: 4, rol: 'Usuario' },
      { id: 5, rol: 'Transportista' }
    ];
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    // Validar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.mostrarError('El archivo debe ser una imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fotoSeleccionada = e.target?.result as string;
      this.usuarioForm.patchValue({ foto: this.fotoSeleccionada });
    };
    reader.onerror = () => {
      this.mostrarError('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const contrasenaPlana = this.usuarioForm.get('contrasena')?.value;
      const contrasenaHash = CryptoJS.SHA256(contrasenaPlana).toString();

      const usuario: CrearUsuario = {
        nombreCompleto: this.usuarioForm.get('nombreCompleto')?.value,
        correoElectronico: this.usuarioForm.get('correoElectronico')?.value,
        movil: this.usuarioForm.get('movil')?.value,
        contrasena: contrasenaHash,
        rolId: this.usuarioForm.get('rolId')?.value,
        foto: this.fotoSeleccionada === null ? undefined : this.fotoSeleccionada
      };

      this.usuarioService.createUsuario(usuario).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Usuario creado con éxito', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          // Asegurarnos de que mantenemos la sesión al redireccionar
          if (localStorage.getItem('currentUser')) {
            this.router.navigate(['/admin']);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al crear usuario:', error);
          this.errorMessage = 'Error al crear el usuario. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
    }
  }

  private mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  volverAPanelAdmin() {
    this.router.navigate(['/admin']);
  }
}