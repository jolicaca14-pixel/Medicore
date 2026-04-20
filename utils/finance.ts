/**
 * 💰 Ledger: Finance and Payroll Utilities
 * Handles calculations based on Colombian Labor Law and IPS standards.
 */

export const SURCHARGE_RATES = {
  NIGHT: 0.35,      // Recargo Nocturno (35%)
  HOLIDAY: 0.75,    // Recargo Dominical/Festivo (75%)
  NIGHT_HOLIDAY: 1.10, // Recargo Nocturno Festivo (35% + 75%)
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
 * 💰 LEDGER: Tax Retention Utilities (Colombian Standards)
 */
export const TAX_RATES = {
  RETEFUENTE: 0.11, // 11% for professional services
  ICA: 0.00966,     // 0.966% for ICA
};

/**
 * Calculates tax retentions for a given gross amount.
 */
export const calculateRetentions = (grossAmount: number) => {
  const retefuente = grossAmount * TAX_RATES.RETEFUENTE;
  const ica = grossAmount * TAX_RATES.ICA;
  const totalRetentions = retefuente + ica;
  const netAmount = grossAmount - totalRetentions;

  return {
    grossAmount,
    retefuente: Number(retefuente.toFixed(2)),
    ica: Number(ica.toFixed(2)),
    totalRetentions: Number(totalRetentions.toFixed(2)),
    netAmount: Number(netAmount.toFixed(2)),
  };
};
