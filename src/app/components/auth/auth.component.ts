import { Component } from '@angular/core';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    MenuComponent
],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLogin = true; // Estado inicial en login

  toggleForm() {
    this.isLogin = !this.isLogin;
  }
}
