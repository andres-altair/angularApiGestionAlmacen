import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-eliminar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './eliminar-usuario.component.html',
  styleUrls: ['./eliminar-usuario.component.css']
})
export class EliminarUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  eliminarForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  usuarioId: number = 0;

  ngOnInit() {
    // Verificar si el usuario está autenticado y es admin
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.rolId !== 1) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.usuarioId = +params['id'];
        this.eliminarForm.patchValue({
          usuarioId: this.usuarioId
        });
      }
    });
  }

  private initForm(): void {
    this.eliminarForm = this.fb.group({
      usuarioId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  onSubmit() {
    if (this.eliminarForm.valid) {
      // Verificar si el usuario sigue autenticado y es admin
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser || currentUser.rolId !== 1) {
        this.router.navigate(['/login']);
        return;
      }

      this.loading = true;
      this.errorMessage = '';
      const idAEliminar = parseInt(this.eliminarForm.get('usuarioId')?.value);

      if (idAEliminar !== this.usuarioId) {
        this.snackBar.open('No se ha encontrado el usuario con el ID proporcionado', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });this.loading = false;
        return;
      }

      this.usuarioService.deleteUsuario(idAEliminar).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Usuario eliminado con éxito', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al eliminar el usuario', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

}
