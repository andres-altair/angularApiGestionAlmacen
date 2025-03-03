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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  eliminarForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  usuarioId: number = 0;

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();

    // Obtener el ID de los query params
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
      this.loading = true;
      this.errorMessage = '';
      const idAEliminar = parseInt(this.eliminarForm.get('usuarioId')?.value);

      if (idAEliminar !== this.usuarioId) {
        this.errorMessage = 'El ID ingresado no coincide con el usuario a eliminar';
        this.loading = false;
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
          console.error('Error al eliminar usuario:', error);
          this.errorMessage = 'Error al eliminar el usuario. Por favor, verifica el ID e inténtalo de nuevo.';
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/admin']);
  }
}
