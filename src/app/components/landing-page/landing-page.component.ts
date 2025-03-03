import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  currentImageIndex = 0;
  images = [
    { 
      src: 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg',
      title: 'Gestión Eficiente',
      description: 'Sistema moderno de gestión de almacén',
      icon: 'inventory'
    },
    {
      src: 'https://images.pexels.com/photos/7348711/pexels-photo-7348711.jpeg',
      title: 'Control Total',
      description: 'Seguimiento en tiempo real de tu inventario',
      icon: 'analytics'
    },
    {
      src: 'https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg',
      title: 'Optimización',
      description: 'Mejora la eficiencia de tu almacén',
      icon: 'trending_up'
    }
  ];

  features = [
    { icon: 'inventory_2', title: 'Control de Stock', description: 'Gestiona tu inventario en tiempo real' },
    { icon: 'local_shipping', title: 'Gestión de Envíos', description: 'Seguimiento de envíos y recepciones' },
    { icon: 'assessment', title: 'Informes', description: 'Análisis detallado y reportes' },
    { icon: 'qr_code_scanner', title: 'Escaneo QR', description: 'Sistema de códigos QR para tracking' }
  ];

  ngOnInit() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000);
  }

  get currentImage() {
    return this.images[this.currentImageIndex];
  }
}