import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatToolbar,
    MatButton,
    RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(private router: Router) {}

  logout() {
    // Limpiar el localStorage
    localStorage.clear();
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
