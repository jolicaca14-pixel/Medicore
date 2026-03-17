/**
 * 💰 Ledger: Finance and Payroll Utilities
 * Handles calculations based on Colombian Labor Law and IPS standards.
 */

export const SURCHARGE_RATES = {
  NIGHT: 0.35,      // Recargo Nocturno (35%)
  HOLIDAY: 0.75,    // Recargo Dominical/Festivo (75%)
  NIGHT_HOLIDAY: 1.10, // Recargo Nocturno Festivo (35% + 75%)
};

export const TAX_RATES = {
  RETEFUENTE_OPS: 0.11, // Retención en la fuente para honorarios (11%)
  ICA_BOGOTA: 0.00966,  // ICA Bogotá (9.66 x 1000)
};

/**
 * Calculates the surcharge amount for a base salary.
 *
 * @param baseAmount The base hourly or daily rate.
 * @param type The type of surcharge to apply.
 * @returns The calculated surcharge amount.
 */
export const calculateSurcharge = (baseAmount: number, type: keyof typeof SURCHARGE_RATES): number => {
  if (baseAmount <= 0) return 0;
  return baseAmount * SURCHARGE_RATES[type];
};

/**
 * Calculates the total pay including surcharges.
 *
 * @param baseAmount The base rate.
 * @param type The type of surcharge.
 * @returns The total amount (base + surcharge).
 */
export const calculateTotalWithSurcharge = (baseAmount: number, type: keyof typeof SURCHARGE_RATES): number => {
  return baseAmount + calculateSurcharge(baseAmount, type);
};

/**
 * Calculates total liquidated pay for a set of hours or events.
 */
export const calculateLiquidatedPay = (baseRate: number, quantity: number, surchargeType?: keyof typeof SURCHARGE_RATES): number => {
  const base = baseRate * quantity;
  if (!surchargeType) return base;
  return base + (base * SURCHARGE_RATES[surchargeType]);
};

/**
 * Calculates tax retentions for a given gross amount.
 * @param grossAmount Total amount before taxes.
 * @returns Object with individual and total retentions.
 */
export const calculateTaxRetentions = (grossAmount: number) => {
    if (grossAmount < 0) return { retefuente: 0, ica: 0, total: 0, net: 0 };
    const retefuente = Math.round(grossAmount * TAX_RATES.RETEFUENTE_OPS);
    const ica = Math.round(grossAmount * TAX_RATES.ICA_BOGOTA);
    const total = retefuente + ica;
    return {
        retefuente,
        ica,
        total,
        net: grossAmount - total
    };
};
