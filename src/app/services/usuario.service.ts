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
        map(usuarios => {
            return usuarios.map(usuario => {
                if (usuario.foto) {
                    console.log('Foto original:', usuario.foto); // Verifica el string Base64
                    const mimeType = this.detectMimeType(usuario.foto);
                    if (mimeType) {
                        usuario.foto = this.addMimeType(usuario.foto, mimeType);
                    } else {
                        console.warn(`No se pudo detectar el tipo MIME para la foto del usuario: ${usuario.nombreCompleto}`);
                    }
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
          const mimeType = this.detectMimeType(usuario.foto);
          if (mimeType) {
            usuario.foto = this.addMimeType(usuario.foto, mimeType);
          }
        }
        return usuario;
      })
    );
  }


  private detectMimeType(base64: string): string | null {
    // Asegúrate de que el string Base64 no tenga el prefijo
    const base64WithoutPrefix = base64.split(',')[1] || base64; // Elimina el prefijo si existe

    try {
        const binaryString = atob(base64WithoutPrefix);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const signatures: { [key: string]: string } = {
            'FFD8FF': 'image/jpeg',    // JPEG
            '89504E47': 'image/png',    // PNG
            '47494638': 'image/gif',    // GIF
            '49492A00': 'image/tiff',   // TIFF (tipo II)
            '4D4D002A': 'image/tiff',   // TIFF (tipo I)
            '424D': 'image/bmp',        // BMP
        };

        // Leer los primeros bytes para determinar el tipo
        const byteString = bytes.subarray(0, 4).reduce((acc, byte) => acc + byte.toString(16).toUpperCase().padStart(2, '0'), '');
        return signatures[byteString] || null;
    } catch (error) {
        console.error('Error al detectar el tipo MIME:', error);
        return null;
    }
}

  private addMimeType(base64: string, mimeType: string): string {
    return `data:${mimeType};base64,${base64}`;
    
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

  private base64ToBlob(base64: string, type: string = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64.split(',')[1]); // Decodifica la cadena Base64
    const byteNumbers = new Uint8Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    return new Blob([byteNumbers], { type });
  }




}
