import { PatientService } from '../../pacientes/services/PatientService';
import { ClinicalRecordService } from '../../historias-clinicas/services/ClinicalRecordService';

export class RIPSService {
    static async generateUS(patientId?: string): Promise<string> {
        // Mock generation of US (Users) file in RIPS format (CSV-like)
        const patients = patientId
            ? [await PatientService.getById(patientId)]
            : await PatientService.getAll();

        let content = "TipoID,NumeroID,CodigoEntidad,TipoUsuario,PrimerApellido,SegundoApellido,PrimerNombre,SegundoNombre,Edad,UnidadMedidaEdad,Sexo,CodigoDepartamento,CodigoMunicipio,Zona\n";

        patients.forEach(p => {
            if (p) {
                const [firstName, ...restName] = p.name.split(' ');
                content += `CC,${p.identification},ENT001,1,${restName[restName.length-1] || ''},${restName[restName.length-2] || ''},${firstName},${restName[0] || ''},30,1,M,05,001,U\n`;
            }
        });

        return content;
    }

    static async generateAC(patientId?: string): Promise<string> {
        // Mock generation of AC (Consultations) file
        // We would normally filter records that are finalized
        let content = "NumeroFactura,CodigoPrestador,TipoID,NumeroID,FechaConsulta,NumeroAutorizacion,CodigoConsulta,FinalidadConsulta,CausaExterna,CodigoDiagnosticoPrincipal,CodigoDiagnosticoRelacionado1,CodigoDiagnosticoRelacionado2,CodigoDiagnosticoRelacionado3,TipoDiagnosticoPrincipal,ValorConsulta,ValorCuotaModeradora,ValorNeto\n";

        content += "FAC001,PRV001,CC,12345678,2024-01-22,,890201,1,13,1B91,,,1,50000,0,50000\n";

        return content;
    }
}
