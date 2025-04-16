import React from 'react';
import Plant from './Plant';

const GardenPreview = () => {
  const plants = [
    {
      type: 'rose',
      growth: 75,
      daysLeft: 12,
      emotion: 'love',
      openDate: '25/12/2024'
    },
    {
      type: 'cactus',
      growth: 30,
      daysLeft: 45,
      emotion: 'hope',
      openDate: '14/02/2025'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-emerald-800">Il Tuo Giardino</h2>
      <div className="space-y-3">
        {plants.map((plant, index) => (
          <Plant
            key={index}
            type={plant.type as any}
            growth={plant.growth}
            daysLeft={plant.daysLeft}
            emotion={plant.emotion}
            openDate={plant.openDate}
          />
        ))}
      </div>
      <button className="mt-4 w-full py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors">
        Vedi tutto il giardino
      </button>
    </div>
  );
};

export default GardenPreview;