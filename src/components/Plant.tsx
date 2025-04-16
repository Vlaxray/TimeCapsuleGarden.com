import React from 'react';
import { Tooltip } from 'react-tooltip';
import Lottie from 'lottie-react';
import growingAnimation from './animations/grow.json';


interface PlantProps {
  type: 'rose' | 'cactus' | 'oak' | 'daisy';
  growth: number;
  daysLeft: number;
  emotion: string;
  openDate?: string;
}

const Plant: React.FC<PlantProps> = ({ type, growth, daysLeft, emotion, openDate }) => {
  const plantIcons = {
    rose: '🌹',
    cactus: '🌵',
    oak: '🌳',
    daisy: '🌼'
  };

  const emotionColors = {
    love: 'bg-pink-100 text-pink-800',
    hope: 'bg-blue-100 text-blue-800',
    joy: 'bg-yellow-100 text-yellow-800',
    fear: 'bg-purple-100 text-purple-800'
  };

  return (
    <div 
      className="flex items-center p-4 bg-white rounded-lg shadow-sm mb-3 relative"
      data-tooltip-id={`plant-tooltip-${type}`}
    >
      {/* Animazione crescita Lottie */}
      <div className="relative w-20 h-20 mr-4">
        <Lottie 
          animationData={growingAnimation} 
          loop={true} 
          style={{ width: 80, height: 80, opacity: growth / 100 }}
        />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">
          {plantIcons[type]}
        </span>
      </div>

      {/* Barra di progresso circolare */}
      <div className="relative w-12 h-12 mr-4">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray={`${growth}, 100`}
          />
        </svg>
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
          {growth}%
        </span>
      </div>

      {/* Dettagli pianta */}
      <div>
        <p className="font-medium capitalize">{type}</p>
        <p className="text-sm text-gray-500">{daysLeft} giorni rimanenti</p>
        <span className={`text-xs px-2 py-1 rounded-full ${emotionColors[emotion as keyof typeof emotionColors] || 'bg-gray-100'}`}>
          {emotion}
        </span>
      </div>

      {/* Tooltip */}
      <Tooltip 
        id={`plant-tooltip-${type}`} 
        place="top"
        className="z-50"
      >
        <div className="p-2">
          <p className="font-bold">Capsula del tempo</p>
          <p>Apertura: {openDate || '15/12/2024'}</p>
          <p>Emozione: {emotion}</p>
          <p>Progresso: {growth}%</p>
        </div>
      </Tooltip>
    </div>
  );
};

export default Plant;