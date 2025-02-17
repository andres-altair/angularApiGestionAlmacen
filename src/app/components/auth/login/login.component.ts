import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    correoElectronico: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required]
  });

  errorMessage: string = '';

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { correoElectronico, contrasena } = this.loginForm.value;
      
      console.log('Intentando login con email:', correoElectronico); // Para debug
      
      this.authService.login(correoElectronico, contrasena).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          // Forzar la navegación
          Promise.resolve().then(() => {
            this.router.navigate(['/admin']).then(
              success => console.log('Navegación exitosa:', success),
              error => console.error('Error en navegación:', error)
            );
          });
        },
        error: (error) => {
          console.error('Error detallado:', error);
          this.errorMessage = 'Error al iniciar sesión';
        }
      });
    }
  }

  loginValid: boolean = true;
  year: number = new Date().getFullYear();

  login(): void {
    this.onSubmit();
  }
}
