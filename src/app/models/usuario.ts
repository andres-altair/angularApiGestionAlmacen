// Interfaz para el modelo de Usuario
export interface Usuario {
    id: number;
    nombreCompleto: string;
    movil: string;
    correoElectronico: string;
    rolId: number;
    foto?: string | null;
    fechaCreacion: string; // ISO string para LocalDateTime
}
