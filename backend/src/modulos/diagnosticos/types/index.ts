export interface DiagnosticResult {
    id: string;
    paciente_id: string;
    profesional_id: string; // Quien solicita
    especialista_id?: string; // Quien valida (Bacteriólogo/Radiólogo)
    tipo: 'LABORATORIO' | 'IMAGENOLOGIA';
    nombre_examen: string;
    resultado_texto?: string;
    unidades?: string;
    valores_referencia?: string;
    estado: 'PENDIENTE' | 'VALIDADO';
    url_adjunto?: string;
    fecha_solicitud: string;
    fecha_resultado?: string;
}

export interface CreateDiagnosticDTO {
    pacienteId: string;
    profesionalId: string;
    tipo: 'LABORATORIO' | 'IMAGENOLOGIA';
    nombreExamen: string;
}
