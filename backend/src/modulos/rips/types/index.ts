export interface RipsUser {
    tipoIdentificacion: string;
    identificacion: string;
    tipoUsuario: string;
    primerApellido: string;
    segundoApellido: string;
    primerNombre: string;
    segundoNombre: string;
    edad: string;
    unidadMedidaEdad: string;
    sexo: string;
    codigoDepartamento: string;
    codigoMunicipio: string;
    zonaResidencia: string;
}

export interface RipsConsultation {
    numeroFactura: string;
    codigoPrestador: string;
    tipoIdentificacion: string;
    identificacion: string;
    fechaConsulta: string;
    numeroAutorizacion: string;
    codigoConsulta: string;
    finalidadConsulta: string;
    causaExterna: string;
    codigoDiagnosticoPrincipal: string;
    codigoDiagnosticoRelacionado1: string;
    codigoDiagnosticoRelacionado2: string;
    codigoDiagnosticoRelacionado3: string;
    tipoDiagnosticoPrincipal: string;
    valorConsulta: string;
    valorCuotaModeradora: string;
    valorNetoPagar: string;
}
