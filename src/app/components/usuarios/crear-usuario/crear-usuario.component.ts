import { Component, inject } from '@angular/core';
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
export class CrearUsuarioComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  roles: Rol[] = [];
  usuarioForm: FormGroup;
  fotoSeleccionada: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor() {
    // Verificar si el usuario está autenticado
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(50)]],
      movil: ['', [Validators.maxLength(15)]],
      correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      rolId: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      foto: [null]
    });

    // Cargar roles al iniciar
    this.cargarRoles();
  }

  cargarRoles() {
    this.usuarioService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (error) => console.error('Error al cargar roles:', error);
      this.mostrarError('Error al cargar los roles. Por favor, intente nuevamente.');

    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    // Validar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.mostrarError('El archivo debe ser una imagen');
      return;
    }
    if (file) {
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
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      const usuarioData: CrearUsuario = this.usuarioForm.value;
      
      this.usuarioService.createUsuario(usuarioData).subscribe({
        next: () => {
          this.snackBar.open('Usuario creado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          let mensaje = 'Error al crear el usuario';
          if (error.status === 400) {
            mensaje = 'Datos inválidos. Por favor, revise la información.';
          } else if (error.status === 409) {
            mensaje = 'El correo electrónico ya está registrado';
          }
          this.mostrarError(mensaje);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  private mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  volverAPanelAdmin() {
    this.router.navigate(['/admin']);
  }
}