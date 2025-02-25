import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Rol } from '../models/rol';
import { CrearUsuario } from '../models/crearUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = 'http://localhost:8081/api';
  private http = inject(HttpClient);

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`).pipe(
      map(usuarios => {
        return usuarios.map(usuario => {
          if (usuario.foto) {
            usuario.foto = this.convertirByteBase64ASrc(usuario.foto);
          }
          return usuario;
        });
      })
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/usuarios/${id}`).pipe(
      map(usuario => {
        if (usuario.foto) {
          usuario.foto = this.convertirByteBase64ASrc(usuario.foto);
        }
        return usuario;
      })
    );
  }

  createUsuario(usuario: CrearUsuario): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Si hay una foto, convertirla de formato src a byte[] base64
    if (usuario.foto) {
      usuario.foto = this.convertirSrcAByteBase64(usuario.foto);
    }

    return this.http.post(`${this.API_URL}/usuarios`, usuario, { headers });
  }

  updateUsuario(id: number, usuario: Partial<CrearUsuario>): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Si hay una foto, convertirla de formato src a byte[] base64
    if (usuario.foto) {
      usuario.foto = this.convertirSrcAByteBase64(usuario.foto);
    }

    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${id}`, usuario, { headers });
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/usuarios/${id}`);
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.API_URL}/roles`);
  }

  // Convierte de byte[]base64 a formato src para imagen
  private convertirByteBase64ASrc(byteBase64: string): string {
    return `data:image/jpeg;base64,${byteBase64}`;
  }

  // Convierte de formato src a byte[]base64
  private convertirSrcAByteBase64(src: string): string {
    return src.split(',')[1];
  }
}
