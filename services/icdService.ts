export interface ICDCode {
    code: string;
    name: string;
}

export const ICD_DICTIONARY: ICDCode[] = [
    { code: '1B91', name: 'Hipertensión esencial (primaria)' },
    { code: '5A11', name: 'Diabetes mellitus tipo 2' },
    { code: '8A80.0', name: 'Migraña sin aura' },
    { code: 'BA00', name: 'Insuficiencia cardíaca congestiva' },
    { code: 'CA01.0', name: 'Asma con predominio alérgico' },
    { code: 'BC40', name: 'Fibrilación auricular' },
    { code: 'DA00', name: 'Gastritis aguda' },
    { code: 'FA01.0', name: 'Osteoartritis de la rodilla' },
    { code: 'GA00', name: 'Cistitis aguda' },
    { code: '1B90', name: 'Hipertensión arterial sistémica' },
    { code: '5A10', name: 'Diabetes mellitus tipo 1' },
    { code: '6A00', name: 'Trastorno del espectro autista' },
    { code: '6D70', name: 'Trastorno depresivo mayor' },
    { code: '6B44', name: 'Trastorno de ansiedad generalizada' },
    { code: 'DB90', name: 'Enfermedad por reflujo gastroesofágico' },
    { code: 'BD40', name: 'Infarto agudo de miocardio' }
];

export const icdService = {
    search(term: string): ICDCode[] {
        if (!term || term.length < 2) return [];
        const lowerTerm = term.toLowerCase();
        return ICD_DICTIONARY.filter(item =>
            item.code.toLowerCase().includes(lowerTerm) ||
            item.name.toLowerCase().includes(lowerTerm)
        );
    }
};
