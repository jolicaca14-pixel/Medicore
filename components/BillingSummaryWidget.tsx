import React from 'react';
import { User, ContractType } from '../types';
import { formatCurrency } from '../constants';
import { Calculator, TrendingUp, Users } from 'lucide-react';

interface BillingSummaryWidgetProps {
  users: User[];
}

export const BillingSummaryWidget: React.FC<BillingSummaryWidgetProps> = ({ users }) => {
  const calculations = users.reduce((acc, user) => {
    const activeContract = user.contracts?.find(c => c.isActive);
    if (!activeContract) return acc;

    if (activeContract.type === ContractType.NOMINA) {
      acc.totalNomina += activeContract.baseSalary || 0;
      acc.countNomina += 1;
    } else {
      acc.totalOPS += activeContract.opsValue || 0;
      acc.countOPS += 1;
    }
    return acc;
  }, { totalNomina: 0, totalOPS: 0, countNomina: 0, countOPS: 0 });

  const grandTotal = calculations.totalNomina + calculations.totalOPS;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-xl font-bold flex items-center mb-4">
          <Calculator className="mr-2 text-blue-400" size={20}/>
          Nómina Proyectada Mensual
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Personal Nómina ({calculations.countNomina})</p>
            <p className="text-lg font-bold">{formatCurrency(calculations.totalNomina)}</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Honorarios OPS ({calculations.countOPS})</p>
            <p className="text-lg font-bold">{formatCurrency(calculations.totalOPS)}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-400">Costo Total Operativo</p>
            <p className="text-3xl font-black text-blue-400">{formatCurrency(grandTotal)}</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full font-bold flex items-center">
                <TrendingUp size={12} className="mr-1"/> +2.4% vs mes anterior
             </span>
          </div>
        </div>
      </div>
      <div className="absolute right-[-20px] top-[-20px] opacity-10 text-white">
        <Calculator size={140} />
      </div>
    </div>
  );
};
