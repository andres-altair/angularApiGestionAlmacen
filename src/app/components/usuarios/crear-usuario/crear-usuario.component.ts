import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { CrearUsuario } from '../../../models/crearUsuario';
import { Rol } from '../../../models/rol';

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

  roles: Rol[] = [];
  usuarioForm: FormGroup;
  fotoSeleccionada: string | null = null;

  constructor() {
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
      error: (error) => console.error('Error al cargar roles:', error)
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoSeleccionada = e.target?.result as string;
        this.usuarioForm.patchValue({ foto: this.fotoSeleccionada });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      const usuarioData: CrearUsuario = this.usuarioForm.value;
      
      this.usuarioService.createUsuario(usuarioData).subscribe({
        next: () => {
          // Navegar a la lista de usuarios después de crear
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }

  volverAPanelAdmin() {
    this.router.navigate(['/admin']);
  }
}
