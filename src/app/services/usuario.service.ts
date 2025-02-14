import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Rol } from '../models/rol';
import { CrearUsuario } from '../models/crearUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = 'http://13.48.178.15:8081/api';
  private http = inject(HttpClient);

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/usuarios/${id}`);
  }

  createUsuario(usuario: CrearUsuario): Observable<Usuario> {
    const formData = new FormData();
    
    // Si hay foto en formato base64, la convertimos a Blob
    if (usuario.foto) {
      const fotoBlob = this.base64ToBlob(usuario.foto);
      formData.append('foto', fotoBlob, 'foto.jpg');
      
      // Eliminamos la foto del objeto para enviarla por separado
      const { foto, ...usuarioSinFoto } = usuario;
      formData.append('usuario', new Blob([JSON.stringify(usuarioSinFoto)], { type: 'application/json' }));
    } else {
      formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    }
    
    return this.http.post<Usuario>(`${this.API_URL}/usuarios`, formData);
  }

  updateUsuario(id: number, usuario: Partial<CrearUsuario>): Observable<Usuario> {
    const formData = new FormData();
    
    if (usuario.foto) {
      const fotoBlob = this.base64ToBlob(usuario.foto);
      formData.append('foto', fotoBlob, 'foto.jpg');
      
      const { foto, ...usuarioSinFoto } = usuario;
      formData.append('usuario', new Blob([JSON.stringify(usuarioSinFoto)], { type: 'application/json' }));
    } else {
      formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    }
    
    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${id}`, formData);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/usuarios/${id}`);
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.API_URL}/roles`);
  }

  getFotoUsuario(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/usuarios/${id}/foto`, {
      responseType: 'blob'
    });
  }

  // Utilidad para convertir Blob a Base64
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Utilidad para convertir Base64 a Blob
  private base64ToBlob(base64: string, contentType = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
