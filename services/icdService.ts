/**
 * 🔮 THE ORACLE: ICD-11 (CIE-11) Diagnostic Service
 * Provides standardized diagnostic lookup and AI-assisted suggestions.
 */

export interface ICD11Code {
    code: string;
    name: string;
    category?: string;
}

const COMMON_DIAGNOSES: ICD11Code[] = [
    { code: 'BA00', name: 'Hipertensión esencial', category: 'Sistema Circulatorio' },
    { code: '5A11', name: 'Diabetes mellitus tipo 2', category: 'Endocrino' },
    { code: '1B91', name: 'Infección de las vías urinarias, sitio no especificado', category: 'Infeccioso' },
    { code: '8A80.0', name: 'Migraña sin aura', category: 'Neurológico' },
    { code: 'CA01.0', name: 'Neumonía adquirida en la comunidad', category: 'Respiratorio' },
    { code: 'BC40.0', name: 'Fibrilación auricular', category: 'Cardiovascular' },
    { code: 'DA01', name: 'Dermatitis atópica', category: 'Dermatológico' },
    { code: 'ME00', name: 'Dolor lumbar', category: 'Osteomuscular' },
    { code: '6A70', name: 'Trastorno depresivo de episodio único', category: 'Salud Mental' },
    { code: 'GA00', name: 'Cistitis aguda', category: 'Genitourinario' }
];

export const icdService = {
    /**
     * Searches for ICD-11 codes by name or code string.
     */
    search: async (query: string): Promise<ICD11Code[]> => {
        const term = query.toLowerCase();
        if (term.length < 2) return [];

        return COMMON_DIAGNOSES.filter(d =>
            d.code.toLowerCase().includes(term) ||
            d.name.toLowerCase().includes(term)
        );
    },

    /**
     * Validates if a code is a valid ICD-11 code (mock implementation).
     */
    isValid: (code: string): boolean => {
        return COMMON_DIAGNOSES.some(d => d.code === code) || /^[A-Z0-9]{4,}(\.[A-Z0-9]+)?$/.test(code);
    },

    /**
     * Gets a diagnosis by its exact code.
     */
    getByCode: (code: string): ICD11Code | undefined => {
        return COMMON_DIAGNOSES.find(d => d.code === code);
    }
};
