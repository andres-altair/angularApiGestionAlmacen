import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import { MenuComponent } from "../../menu/menu.component";

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
    RouterLink,
    MenuComponent
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
          console.log('Login exitoso - Respuesta completa:', response);
          // La respuesta viene directamente, no necesitamos buscar en response.usuario
          if (response && response.id) {  // Verificamos si la respuesta tiene un ID de usuario
            setTimeout(() => {
              this.router.navigate(['/admin']).then(
                success => {
                  if (!success) {
                    console.error('Error en navegación: La ruta no está disponible');
                  }
                },
                error => console.error('Error en navegación:', error)
              );
            }, 100);
          } else {
            console.error('Estructura de la respuesta:', response);
            this.errorMessage = 'Error al iniciar sesión: datos de usuario inválidos';
          }
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
