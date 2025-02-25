import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { CrearUsuario } from '../../../models/crearUsuario';
import { Rol } from '../../../models/rol';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-editar-usuario',
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
  templateUrl: './editar-usuario.component.html',
  styles: [`
    .form-card {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .error-message {
      color: red;
      margin-top: 16px;
    }
  `]
})
export class EditarUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  usuarioForm!: FormGroup;
  roles: Rol[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  usuarioId!: number;

  ngOnInit() {
    // Verificar autenticación
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();
    this.cargarRoles();
    
    // Obtener el ID del usuario de la URL
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      this.cargarUsuario();
    });
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      movil: ['', [Validators.required]],
      rolId: ['', [Validators.required]]
    });
  }

  private cargarRoles(): void {
    this.usuarioService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.errorMessage = 'Error al cargar los roles';
      }
    });
  }

  private cargarUsuario(): void {
    this.loading = true;
    this.usuarioService.getUsuario(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          nombreCompleto: usuario.nombreCompleto,
          correoElectronico: usuario.correoElectronico,
          movil: usuario.movil,
          rolId: usuario.rolId
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.errorMessage = 'Error al cargar los datos del usuario';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const usuarioActualizado: Partial<CrearUsuario> = {
        nombreCompleto: this.usuarioForm.get('nombreCompleto')?.value,
        correoElectronico: this.usuarioForm.get('correoElectronico')?.value,
        movil: this.usuarioForm.get('movil')?.value,
        rolId: this.usuarioForm.get('rolId')?.value
      };

      this.usuarioService.updateUsuario(this.usuarioId, usuarioActualizado).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/panel-admin']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al actualizar usuario:', error);
          this.errorMessage = 'Error al actualizar el usuario. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/panel-admin']);
  }
}