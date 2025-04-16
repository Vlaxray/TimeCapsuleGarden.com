import React, { useEffect, useCallback, useState, useRef } from 'react';
import { loadFull } from 'tsparticles';
import { tsParticles } from 'tsparticles-engine';
import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import Nebbia from './components/Nebbia';
import Lucciole from './components/Lucciole';
import useParallax from './hooks/useParallax';
import './styles/effects.css';
import Dashboard from './components/Dashboard';
import './styles/App.css';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import './styles/GlassModal.css'; // CSS per l'effetto vetro
import * as THREE from 'three'; // Per la generazione della noise map



const App = () => {
  
  // Stati autenticazione
  const [authData, setAuthData] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || null)
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

   // Stati per form
   const [loginForm, setLoginForm] = useState({ email: '', password: '' });
   const [signupForm, setSignupForm] = useState({ 
     name: '', 
     email: '', 
     password: '', 
     confirmPassword: '' 
   });
   // Stati di caricamento e errore
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handler per il login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('email', loginForm.email);
      formData.append('password', loginForm.password);

      const response = await fetch('http://tuoserver.com/path/to/login.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthData({ token: data.token, user: data.user });
        setShowLogin(false);
        setSuccess('Login effettuato con successo!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Credenziali non valide');
      }
    } catch (err) {
      setError('Errore di connessione al server');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

// Handler per la registrazione
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (signupForm.password !== signupForm.confirmPassword) {
    setError('Le password non coincidono');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const formData = new FormData();
    formData.append('name', signupForm.name);
    formData.append('email', signupForm.email);
    formData.append('password', signupForm.password);

    const response = await fetch('http://tuoserver.com/path/to/register.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setShowSignup(false);
      setSuccess('Registrazione completata! Effettua il login');
      setTimeout(() => setSuccess(''), 5000);
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    } else {
      setError(data.message || 'Errore durante la registrazione');
    }
  } catch (err) {
    setError('Errore di connessione al server');
    console.error('Signup error:', err);
  } finally {
    setLoading(false);
  }
};
// Logout
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuthData({ token: null, user: null });
  setSuccess('Logout effettuato con successo');
  setTimeout(() => setSuccess(''), 3000);
};

  // Configurazione particelle
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  // Stato per gestire le particelle visibili
  const [visibleParticles, setVisibleParticles] = useState(true);
  const particlesRef = useRef<any>(null);

/* inserire granulosità noisemap */

  // Configurazione particelle con opzioni di decay
  const particlesOptions = {
    fullScreen: {
      enable: false,
      zIndex: -1
    },
    particles: {
      number: {
        value: 10,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#3aff85", "#00ffaa", "#80ffdb"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: {
          default: "out" as const,
          top: "bounce" as const,
          bottom: "bounce" as const,
          left: "bounce" as const,
          right: "bounce" as const,
        },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      },
      links: {
        enable: true,
        distance: 200,
        color: "#3aff85",
        opacity: 0.4,
        width: 1
      }
    },
    interactivity: {
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push" // Modificato da "push" a "remove"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 120,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          quantity: 1, // Numero di particelle da rimuovere al click
          speed: 20// Velocità di rimozione
        }
      }
    },
    retina_detect: true
  };

  // Funzione per resettare le particelle dopo un tempo
  const resetParticles = () => {
    setVisibleParticles(false);
    setTimeout(() => {
      setVisibleParticles(true);
    }, 3000); // Resetta dopo 3 secondi
  };

  // Handler per il click che attiva il decay
  const handleCanvasClick = () => {
    if (particlesRef.current) {
      particlesRef.current.refresh();
      resetParticles();
    }
  };
 

  return (
    <div className="app-container">
      {/* Componente Particles - deve essere renderizzato direttamente qui */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* Contenuto principale */}
      <div className="content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Messaggi globali */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}

        {/* Pulsanti auth */}
        <div className="auth-buttons">
          {authData.token ? (
            <>
              <span className="text-light me-3">Ciao, {authData.user?.name}</span>
              <Button onClick={handleLogout} className="glass-btn">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setShowLogin(true)} 
                className="me-2 glass-btn"
              >
                Login
              </Button>
              <Button 
                onClick={() => setShowSignup(true)}
                className="glass-btn-primary"
              >
                Signup
              </Button>
            </>
          )}
        </div>

      {/* Modale Login */}
      <Modal
          show={showLogin}
          onHide={() => setShowLogin(false)}
          centered
          dialogClassName="glass-modal"
          contentClassName="glass-content"
        >
          <Modal.Header className="glass-header">
            <Modal.Title>Accedi</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleLogin}>
            <Modal.Body className="glass-body">
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="tua@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="glass-input"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="glass-footer">
              <Button 
                variant="secondary" 
                onClick={() => setShowLogin(false)}
                className="glass-btn"
                disabled={loading}
              >
                Chiudi
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="glass-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Accedi'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modale Registrazione */}
        <Modal
          show={showSignup}
          onHide={() => setShowSignup(false)}
          centered
          dialogClassName="glass-modal"
          contentClassName="glass-content"
        >
          <Modal.Header className="glass-header">
            <Modal.Title>Registrati</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSignup}>
            <Modal.Body className="glass-body">
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo nome"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  className="glass-input"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="tua@email.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className="glass-input"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className="glass-input"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Conferma Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Conferma Password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="glass-footer">
              <Button 
                variant="secondary" 
                onClick={() => setShowSignup(false)}
                className="glass-btn"
                disabled={loading}
              >
                Chiudi
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="glass-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Registrati'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      <div className="text-center p-5 text-light">
            <h1 className="glow display-4 fw-bold">
            Coltiva i tuoi ricordi<br />nel giardino digitale
          </h1>
          <p className="mt-3 mb-4 fs-5">
            Un ecosistema dove ogni pensiero è un seme NFT<br />
            che cresce e fiorisce sulla blockchain.
          </p>
          <div className="d-flex justify-content-center mb-4 flex-wrap">
            <Button className="btn-custom me-2">🌻 Pianta il tuo seme</Button>
            <Button className="btn-custom">🐟 Connetti Wallet</Button>
          </div>
          
          <h2 className="glow mt-5">Il tuo ecosistema digitale</h2>
          <Dashboard />
          <p className="fs-5">Nutri i tuoi ricordi e guardali crescere nel metaverso</p>
          <div className="mt-4"><span style={{ fontSize: '3rem' }}>🌳</span></div>
          <h6 className="mb-2">Beta 0.10 - Polygon Ecosystem</h6>
        </div>
      </div>
    </div>
  );
};

export default App;