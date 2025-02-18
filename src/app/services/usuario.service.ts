import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      map(usuarios => usuarios.map(usuario => ({
        ...usuario,
        foto: usuario.foto ? this.bytesToBase64Image(usuario.foto) : null
      })))
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/usuarios/${id}`).pipe(
      map(usuario => ({
        ...usuario,
        foto: usuario.foto ? this.bytesToBase64Image(usuario.foto) : null
      }))
    );
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

  private bytesToBase64Image(buffer: any): string {
    if (!Array.isArray(buffer) || buffer.length === 0) {
      return buffer;
    }

    // Detectar el tipo de imagen basado en los magic numbers
    let mimeType = 'image/jpeg'; // default
    
    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      mimeType = 'image/png';
    }
    // GIF: 47 49 46 38
    else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      mimeType = 'image/gif';
    }
    // JPEG: FF D8 FF
    else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      mimeType = 'image/jpeg';
    }
    // WebP: 52 49 46 46 ... 57 45 42 50
    else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
      mimeType = 'image/webp';
    }

    const binary = String.fromCharCode.apply(null, buffer);
    return `data:${mimeType};base64,${btoa(binary)}`;
  }
}
