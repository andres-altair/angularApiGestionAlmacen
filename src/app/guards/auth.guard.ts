import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  console.log('AuthGuard - Usuario actual:', user); // Para debug

  if (user) {
    return true;
  }

  console.log('AuthGuard - No hay usuario, redirigiendo a login'); // Para debug
  router.navigate(['/login']);
  return false;
};
