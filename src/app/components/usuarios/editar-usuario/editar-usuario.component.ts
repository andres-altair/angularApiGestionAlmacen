import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { CrearUsuario } from '../../../models/crearUsuario';
import { Rol } from '../../../models/rol';
import { Usuario } from '../../../models/usuario';
import { finalize } from 'rxjs/operators';

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
    MatIconModule,
    RouterModule
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
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
  fotoPreview?: string;
  fotoSeleccionada?: string;

  // Lista predefinida de roles para asegurar que todos estén disponibles
  rolesDisponibles: Rol[] = [
    { id: 1, rol: 'Administrador' },
    { id: 2, rol: 'Gestor' },
    { id: 3, rol: 'Operario' },
    { id: 4, rol: 'Usuario' },
    { id: 5, rol: 'Transportista' }
  ];

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();
    this.cargarRoles();
    
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      console.log('ID de usuario a cargar:', this.usuarioId);
      if (this.usuarioId) {
        this.cargarUsuario();
      }
    });
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      movil: ['', [Validators.required]],
      rolId: [null, [Validators.required]]
    });

    this.usuarioForm.get('rolId')?.valueChanges.subscribe(value => {
      console.log('Valor de rolId cambiado a:', value);
    });
  }

  private cargarRoles(): void {
    // Usar la lista predefinida de roles
    this.roles = this.rolesDisponibles;
    console.log('Roles cargados:', this.roles);
  }

  private cargarUsuario(): void {
    this.loading = true;
    console.log('Iniciando carga de usuario...');
    
    this.usuarioService.getUsuario(this.usuarioId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (usuario) => {
          console.log('Usuario cargado:', usuario);
          const rolId = typeof usuario.rolId === 'string' ? parseInt(usuario.rolId) : usuario.rolId;
          console.log('RolId procesado:', rolId);
          
          this.usuarioForm.patchValue({
            nombreCompleto: usuario.nombreCompleto,
            correoElectronico: usuario.correoElectronico,
            movil: usuario.movil,
            rolId: rolId
          });

          console.log('Estado del formulario después de patch:', this.usuarioForm.value);

          if (usuario.foto) {
            this.fotoPreview = usuario.foto;
            this.fotoSeleccionada = usuario.foto;
          }

          if (rolId && !this.roles.some(r => r.id === rolId)) {
            console.warn('El rol del usuario no está en la lista de roles:', rolId);
            console.log('Roles disponibles:', this.roles.map(r => ({ id: r.id, rol: r.rol })));
          }
        },
        error: (error) => {
          console.error('Error al cargar usuario:', error);
          this.errorMessage = 'Error al cargar los datos del usuario';
        }
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
        this.fotoSeleccionada = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const usuarioActualizado: Partial<CrearUsuario> = {
        nombreCompleto: this.usuarioForm.get('nombreCompleto')?.value,
        correoElectronico: this.usuarioForm.get('correoElectronico')?.value,
        movil: this.usuarioForm.get('movil')?.value,
        rolId: this.usuarioForm.get('rolId')?.value,
        foto: this.fotoSeleccionada
      };

      console.log('Enviando actualización:', usuarioActualizado);

      this.usuarioService.updateUsuario(this.usuarioId, usuarioActualizado)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            this.router.navigate(['/admin']);
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            this.errorMessage = 'Error al actualizar el usuario. Por favor, inténtalo de nuevo.';
          }
        });
    }
  }

  cancelar() {
    this.router.navigate(['/admin']);
  }
}