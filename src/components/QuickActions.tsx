import React from 'react';
import { FiPlus, FiRefreshCw, FiCpu } from 'react-icons/fi';

const QuickActionButton = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors w-full">
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
};

const QuickActions = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-emerald-800">Azioni Rapide</h2>
      <div className="grid grid-cols-3 gap-3">
        <QuickActionButton icon={<FiPlus size={18} />} text="Pianta Seme" />
        <QuickActionButton icon={<FiRefreshCw size={18} />} text="Scambia Seme" />
        <QuickActionButton icon={<FiCpu size={18} />} text="Genera con AI" />
      </div>
    </div>
  );
};

export default QuickActions;