import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { MenuComponent } from '../menu/menu.component';
import * as CryptoJS from 'crypto-js';

interface CrearUsuario {
  nombreCompleto: string;
  correoElectronico: string;
  movil: string;
  contrasena: string;
  rolId: number;
  foto?: string;
}

interface Rol {
  id: number;
  rol: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MenuComponent
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  usuarioForm!: FormGroup;
  roles: Rol[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  fotoSeleccionada?: string;

  ngOnInit() {
    this.initForm();
    this.cargarRoles();
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(50)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      movil: [''],
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

  trackRolById(index: number, rol: Rol): number {
    return rol.id;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
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
        movil: this.usuarioForm.get('movil')?.value || '',
        contrasena: contrasenaHash,
        rolId: this.usuarioForm.get('rolId')?.value,
        foto: this.fotoSeleccionada
      };

      this.usuarioService.createUsuario(usuario).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Usuario registrado correctamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Error al registrar usuario:', error);
          this.mostrarError('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      this.mostrarError('Por favor, completa todos los campos requeridos correctamente.');
    }
  }

  private mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  volverALogin() {
    this.router.navigate(['/login']);
  }
}