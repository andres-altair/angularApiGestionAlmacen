import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  if (user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
