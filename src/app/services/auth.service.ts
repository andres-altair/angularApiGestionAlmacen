import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Observable, BehaviorSubject, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../models/usuario';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://13.48.178.15:8081/api';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Recuperar usuario del localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.usuarioSubject.next(JSON.parse(storedUser));
    }
  }

  login(correoElectronico: string, contrasena: string): Observable<any> {
    // Hashear la contraseña con SHA256
    const hashedPassword = CryptoJS.SHA256(contrasena).toString();

    return this.http.post<any>(`${this.API_URL}/auth/login`, {
      correoElectronico,
      contrasena: hashedPassword
    }).pipe(
      tap(response => {
        if (response.usuario) {
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          localStorage.setItem('token', response.token);
          this.usuarioSubject.next(response.usuario);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): Usuario | null {
    return this.usuarioSubject.value;
  }
}
