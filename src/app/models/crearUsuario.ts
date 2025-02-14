// Interfaz para crear un nuevo usuario
export interface CrearUsuario {
    nombreCompleto: string;
    movil: string;
    correoElectronico: string;
    rolId: number;
    contrasena: string;
    foto?: string; // Base64 string para byte[]
}
