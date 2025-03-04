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
  private readonly API_URL = 'http://localhost:8081/api';
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
    const hashedPassword = CryptoJS.SHA256(contrasena).toString();

    const loginData = {
      correoElectronico,
      contrasena: hashedPassword
    };

    console.log('Datos de login:', loginData);

    return this.http.post<any>(`${this.API_URL}/usuarios/autenticar`, loginData)
      .pipe(
        tap({
          next: (response) => {
            console.log('Respuesta del servidor en AuthService:', response);
            if (response && response.id) {
              localStorage.setItem('currentUser', JSON.stringify(response));
              localStorage.setItem('token', response.token);
              this.usuarioSubject.next(response);
              
              // Redirigir según el rol
              if (response.rolId === 1) {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/noAdmin']);
              }
            }
          },
          error: (error) => {
            console.error('Error completo:', error);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            this.usuarioSubject.next(null);
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
