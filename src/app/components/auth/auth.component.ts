import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuario.service';
import { CrearUsuario } from '../../models/crearUsuario';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  fotoSeleccionada: string | null = null;
  fotoFile: File | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(50)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      movil: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{9,15}$'),
        Validators.minLength(9),
        Validators.maxLength(15)
      ]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rolId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fotoFile = file;
      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoSeleccionada = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.usuarioForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      try {
        const usuarioData: CrearUsuario = {
          nombreCompleto: this.usuarioForm.get('nombreCompleto')?.value,
          correoElectronico: this.usuarioForm.get('correoElectronico')?.value,
          movil: this.usuarioForm.get('movil')?.value,
          rolId: this.usuarioForm.get('rolId')?.value,
          contrasena: this.usuarioForm.get('contrasena')?.value
        };
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

        await this.usuarioService.createUsuario(usuario).toPromise();
        
        if (this.fotoFile) {
          // Aquí iría la lógica para subir la foto si es necesario
          // Por ejemplo: await this.usuarioService.uploadFoto(usuarioData.id, this.fotoFile).toPromise();
        }

        this.snackBar.open('Usuario creado con éxito', 'Cerrar', {
          duration: 3000
        });
        // Redirigir a login después de crear el usuario
        this.router.navigate(['/login']);
      } catch (error: any) {
        console.error('Error al crear usuario:', error);
        this.errorMessage = error.message || 'Error al crear el usuario';
        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 3000
        });
      } finally {
        this.loading = false;
      }
    }
  }

  cancelar(): void {
    // Redirigir a la landing page al cancelar
    this.router.navigate(['/']);
  }
}