import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Stili CSS separati

// Estendi l'interfaccia Window per includere ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Tipi TypeScript
type Notification = {
  id: string;
  text: string;
  read: boolean;
};

type User = {
  name: string;
  tokens: number;
  walletAddress?: string;
};

type TokenPackage = {
  id: string;
  amount: number;
  price: number;
};

const Header: React.FC = () => {
  // Stato
  const [user, setUser] = useState<User>({
    name: 'Lucia',
    tokens: 15,
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'Il tuo cactus "Speranza" aprirà tra 2 giorni!', read: false },
    { id: '2', text: 'Hai ricevuto un NFT da Marco!', read: false },
  ]);
  const [unreadMessages, setUnreadMessages] = useState<number>(1);
  const [showTokenShop, setShowTokenShop] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([
    { id: '1', amount: 10, price: 2 },
    { id: '2', amount: 25, price: 4.5 },
  ]);

  // Effetti
  useEffect(() => {
    // Simula caricamento notifiche
    const fetchNotifications = async () => {
      // API call qui
    };
    fetchNotifications();
  }, []);

  // Handlers
  const handleLogout = () => {
    console.log('Logout effettuato');
    // Redirect alla login page
  };

  const handleStripePayment = async (tokenPack: TokenPackage) => {
    console.log(`Acquistati ${tokenPack.amount} gettoni per €${tokenPack.price}`);
    // Integrazione Stripe qui
    setUser({ ...user, tokens: user.tokens + tokenPack.amount });
    setShowTokenShop(false);
  };

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUser({ ...user, walletAddress: accounts[0] });
      } catch (error) {
        console.error('Errore con Metamask:', error);
      }
    } else {
      alert('Installa Metamask!');
    }
  };

  return (
    <header className="header">
      {/* Logo + Nome */}
      <div className="logo-section">
        <Link to="/" className="logo-link">
          <span role="img" aria-label="logo">🌿</span>
          <h1>TimeCapsule Garden</h1>
        </Link>
      </div>

      {/* Widget Gettoni */}
      <div className="token-widget" onClick={() => setShowTokenShop(true)}>
        <span role="img" aria-label="token">🪙</span>
        <span className="count">{user.tokens}</span>
        <button className="buy-btn">+ Acquista</button>
      </div>

      {/* Token Shop Modal */}
      {showTokenShop && (
        <div className="modal">
          <h3>Acquista Gettoni</h3>
          {tokenPackages.map(pack => (
            <div key={pack.id} className="token-pack">
              <span>{pack.amount} gettoni</span>
              <span>€{pack.price.toFixed(2)}</span>
              <button onClick={() => handleStripePayment(pack)}>Compra</button>
            </div>
          ))}
          <button onClick={connectMetamask}>Paga con Crypto</button>
          <button onClick={() => setShowTokenShop(false)}>Chiudi</button>
        </div>
      )}

      {/* Icone Interazione */}
      <div className="icons-section">
        <div className="notification-icon">
          <span role="img" aria-label="notifiche">🔔</span>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="badge">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>

        <Link to="/messages" className="message-icon">
          <span role="img" aria-label="messaggi">💬</span>
          {unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}
        </Link>

        <Link to="/settings" className="settings-icon">
          <span role="img" aria-label="impostazioni">⚙️</span>
        </Link>

        <button onClick={() => setShowLogoutModal(true)} className="logout-icon">
          <span role="img" aria-label="logout">🚪</span>
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal">
          <p>Vuoi davvero uscire? I tuoi semi continueranno a crescere!</p>
          <button onClick={handleLogout}>Conferma</button>
          <button onClick={() => setShowLogoutModal(false)}>Annulla</button>
        </div>
      )}
    </header>
  );
};

export default Header;