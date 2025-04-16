import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Tipi TypeScript
type Plant = {
  id: string;
  name: string;
  emotion: 'joy' | 'nostalgia' | 'hope' | 'fear';
  openDate: Date;
  progress: number;
};

type NFT = {
  id: string;
  plantId: string;
  imageUrl: string;
  emotion: string;
  date: string;
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activePlants, setActivePlants] = useState<Plant[]>([
    { id: '1', name: 'Cactus Speranza', emotion: 'hope', openDate: new Date('2023-12-25'), progress: 65 },
    { id: '2', name: 'Rosa Nostalgia', emotion: 'nostalgia', openDate: new Date('2024-02-14'), progress: 30 },
  ]);

  const [nfts, setNfts] = useState<NFT[]>([
    { id: '1', plantId: '1', imageUrl: '/nft1.png', emotion: 'hope', date: '2023-10-01' },
  ]);

  // Stile attivo per il menu
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      {/* Logo compatto (opzionale) */}
      <div className="sidebar-logo">
        <span role="img" aria-label="logo">🌿</span>
      </div>

      <nav className="sidebar-nav">
        {/* Home */}
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <span role="img" aria-label="home">🏠</span>
          <span className="nav-text">Home</span>
        </Link>

        {/* Crea un Seme */}
        <Link to="/create-seed" className={`nav-item ${isActive('/create-seed')}`}>
          <span role="img" aria-label="crea">🌱</span>
          <span className="nav-text">Crea un Seme</span>
        </Link>

        {/* Calendario */}
        <Link to="/calendar" className={`nav-item ${isActive('/calendar')}`}>
          <span role="img" aria-label="calendario">📅</span>
          <span className="nav-text">Calendario</span>
        </Link>

        {/* Giardino */}
        <div className="nav-section">
          <Link to="/garden" className={`nav-item ${isActive('/garden')}`}>
            <span role="img" aria-label="giardino">🌳</span>
            <span className="nav-text">Giardino</span>
          </Link>
          <div className="plants-progress">
            {activePlants.map(plant => (
              <div key={plant.id} className="plant-item">
                <span>{plant.name}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${plant.progress}%`,
                      backgroundColor: getEmotionColor(plant.emotion)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Galleria NFT */}
        <Link to="/nft-gallery" className={`nav-item ${isActive('/nft-gallery')}`}>
          <span role="img" aria-label="nft">🖼️</span>
          <span className="nav-text">Galleria NFT</span>
          {nfts.length > 0 && <span className="nft-count">{nfts.length}</span>}
        </Link>

        {/* Posta Temporale */}
        <Link to="/time-mail" className={`nav-item ${isActive('/time-mail')}`}>
          <span role="img" aria-label="posta">📬</span>
          <span className="nav-text">Posta Temporale</span>
        </Link>

        {/* Impostazioni */}
        <Link to="/settings" className={`nav-item ${isActive('/settings')}`}>
          <span role="img" aria-label="impostazioni">⚙️</span>
          <span className="nav-text">Impostazioni</span>
        </Link>
      </nav>
    </aside>
  );
};

// Helper per i colori delle emozioni
const getEmotionColor = (emotion: string): string => {
  const colors: Record<string, string> = {
    joy: '#FFD700',
    nostalgia: '#9B59B6',
    hope: '#2ECC71',
    fear: '#E74C3C'
  };
  return colors[emotion] || '#2A7F62';
};

export default Sidebar;