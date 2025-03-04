import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from '../menu/menu.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-no-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MenuComponent],
  templateUrl: './no-admin.component.html',
  styleUrls: ['./no-admin.component.css']
})
export class NoAdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: Usuario | null = null;

  ngOnInit() {
    // Verificar si el usuario está autenticado y NO es admin
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Si es admin, redirigir a panel de admin
    if (this.currentUser.rolId === 1) {
      this.router.navigate(['/admin']);
      return;
    }
  }

  getRolName(rolId: number | undefined): string {
    const roles = {
      2: 'Gestor',
      3: 'Operario',
      4: 'Usuario',
      5: 'Transportista'
    };
    return rolId ? roles[rolId as keyof typeof roles] || 'Usuario' : 'Usuario';
  }
}
