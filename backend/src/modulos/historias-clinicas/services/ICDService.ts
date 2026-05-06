export interface ICDCode {
    code: string;
    description: string;
}

const ICD_DATABASE: ICDCode[] = [
    { code: '1B91', description: 'Hipertensión esencial' },
    { code: 'CA01.0', description: 'Asma con predominio alérgico' },
    { code: '5B51.1', description: 'Diabetes mellitus tipo 2' },
    { code: '1D50', description: 'Infección por el virus de la inmunodeficiencia humana' },
    { code: '6A70', description: 'Trastorno depresivo de episodio único' },
    { code: '8A80', description: 'Migraña' },
    { code: '9A01', description: 'Glaucoma primario de ángulo abierto' },
    { code: 'AA70', description: 'Otitis media supurativa' },
    { code: 'BA00', description: 'Infarto agudo de miocardio' },
    { code: 'CA40', description: 'Neumonía bacteriana' },
];

export class ICDService {
    static async search(query: string): Promise<ICDCode[]> {
        const lowerQuery = query.toLowerCase();
        return ICD_DATABASE.filter(item =>
            item.code.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
        );
    }
}
