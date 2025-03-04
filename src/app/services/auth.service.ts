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
  private readonly CURRENT_SESSION_KEY = 'currentSessionId';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Recuperar sessionId actual o crear uno nuevo
    const currentSessionId = localStorage.getItem(this.CURRENT_SESSION_KEY);
    if (currentSessionId) {
      const user = this.getUserBySessionId(currentSessionId);
      if (user) {
        this.usuarioSubject.next(user);
      }
    }
  }

  private getUserBySessionId(sessionId: string): Usuario | null {
    const sessions = this.getAllSessions();
    return sessions[sessionId] || null;
  }

  private getAllSessions(): { [key: string]: Usuario } {
    const sessionsStr = localStorage.getItem('userSessions');
    return sessionsStr ? JSON.parse(sessionsStr) : {};
  }

  private saveSession(user: Usuario, token: string) {
    // Generar nuevo sessionId
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // Guardar sessionId actual
    localStorage.setItem(this.CURRENT_SESSION_KEY, sessionId);
    
    // Guardar usuario en sesiones
    const sessions = this.getAllSessions();
    sessions[sessionId] = user;
    localStorage.setItem('userSessions', JSON.stringify(sessions));

    // Guardar token
    const tokens = this.getAllTokens();
    tokens[user.id] = token;
    localStorage.setItem('userTokens', JSON.stringify(tokens));

    // Actualizar BehaviorSubject
    this.usuarioSubject.next(user);
  }

  private removeSession() {
    const sessionId = localStorage.getItem(this.CURRENT_SESSION_KEY);
    if (sessionId) {
      // Eliminar usuario de sesiones
      const sessions = this.getAllSessions();
      const user = sessions[sessionId];
      if (user) {
        // Eliminar token
        const tokens = this.getAllTokens();
        delete tokens[user.id];
        localStorage.setItem('userTokens', JSON.stringify(tokens));
      }
      delete sessions[sessionId];
      localStorage.setItem('userSessions', JSON.stringify(sessions));
    }
    
    // Limpiar sessionId actual
    localStorage.removeItem(this.CURRENT_SESSION_KEY);
    this.usuarioSubject.next(null);
  }

  private getAllTokens(): { [key: number]: string } {
    const tokensStr = localStorage.getItem('userTokens');
    return tokensStr ? JSON.parse(tokensStr) : {};
  }

  login(correoElectronico: string, contrasena: string): Observable<any> {
    const hashedPassword = CryptoJS.SHA256(contrasena).toString();
    const loginData = {
      correoElectronico,
      contrasena: hashedPassword
    };

    return this.http.post<any>(`${this.API_URL}/usuarios/autenticar`, loginData)
      .pipe(
        tap({
          next: (response) => {
            if (response && response.id) {
              const { token, ...userData } = response;
              this.saveSession(userData, token);
              
              if (userData.rolId === 1) {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/noAdmin']);
              }
            }
          },
          error: (error) => {
            console.error('Error en login:', error);
            this.removeSession();
          }
        })
      );
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const sessionId = localStorage.getItem(this.CURRENT_SESSION_KEY);
    if (!sessionId) return null;

    const user = this.getUserBySessionId(sessionId);
    if (!user) return null;

    const tokens = this.getAllTokens();
    return tokens[user.id] || null;
  }

  getCurrentUser(): Usuario | null {
    const sessionId = localStorage.getItem(this.CURRENT_SESSION_KEY);
    if (!sessionId) return null;
    return this.getUserBySessionId(sessionId);
  }
}
