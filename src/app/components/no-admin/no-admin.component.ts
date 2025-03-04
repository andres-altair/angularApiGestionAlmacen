import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-no-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MenuComponent],
  templateUrl: './no-admin.component.html',
  styleUrl: './no-admin.component.css'
})
export class NoAdminComponent {

}
