/**
 * 🔮 The Oracle: ICD-11 Service
 * Handles diagnostic code validations and suggestions.
 */

export const icdService = {
  /**
   * Validates if a code follows the ICD-11 pattern.
   * Basic pattern: Alphanumeric, usually 4-5 characters.
   */
  validateICD11Code(code: string): boolean {
    if (!code) return false;
    // Standard ICD-11 codes are usually 4 characters (e.g., 1B91, BA41.1)
    const pattern = /^[A-Z0-9]{1,4}(\.[A-Z0-9]{1,4})?$/i;
    return pattern.test(code.trim());
  },

  /**
   * Mock search for ICD-11 codes
   */
  async search(query: string) {
    const mocks = [
      { code: '1B91', description: 'Hypertension' },
      { code: 'CA40', description: 'Asthma' },
      { code: '5A11', description: 'Type 2 Diabetes Mellitus' },
      { code: 'BA41', description: 'Acute myocardial infarction' }
    ];
    return mocks.filter(m =>
      m.code.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};
