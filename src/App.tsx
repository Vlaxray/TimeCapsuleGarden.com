import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/Parallax';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Dashboard from './components/Dashboard';
import './styles/effects.css';
import './styles/App.css';
import SeedCreator from './components/SeedCreator';
import NFTGallery from './components/NFTGallery';
import { tsParticles } from 'tsparticles-engine';
import Nebbia from './components/Nebbia';
import Lucciole from './components/Lucciole';
import useParallax from './hooks/useParallax';
import type { Engine } from 'tsparticles-engine';
import './styles/GlassModal.css'; // CSS per l'effetto vetro
import * as THREE from 'three'; // Per la generazione della noise map



const App = () => {
  
  // Stati autenticazione
  const [authData, setAuthData] = useState({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  });

  //stati modali
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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

   // Nuovi stati per parallax
   const parallaxRef = useRef<IParallax | null>(null);
   const [currentSection, setCurrentSection] = useState(0);
 
 // Configurazione particelle
 //const particlesInit = useCallback(async (engine: Engine) => {
 // await loadFull(engine);
//}, []);

// Sezioni parallax
const sections = [
  {
    title: "🌿 TimeCapsule Garden",
    content: "Pianta il tuo seme digitale per il futuro",
    bg: "linear-gradient(to bottom, #001f14, #003d1f)"
  },
  {
    title: "🪴 Scegli il tuo seme",
    content: "Cactus, Quercia o Rosa? Ogni pianta rappresenta un'emozione",
    bg: "linear-gradient(to bottom, #003d1f, #005c2b)",
    component: <SeedCreator />
  },
  {
    title: "💌 Crea la tua capsula",
    content: "Aggiungi testo, emozioni e media alla tua time capsule",
    bg: "linear-gradient(to bottom, #005c2b, #007a36)"
  },
  {
    title: "🖼️ Genera NFT",
    content: "Trasforma il tuo seme in un'opera d'arte digitale unica",
    bg: "linear-gradient(to bottom, #007a36, #009942)",
    component: <NFTGallery />
  },
  {
    title: "🌍 Condividi",
    content: "Scambia i tuoi semi NFT alla cieca con altri giardinieri digitali",
    bg: "linear-gradient(to bottom, #009942, #00b74f)",
    component: <Dashboard />
  }
];

// Handler per scroll con rotella
const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  if (!parallaxRef.current) return;
  if (e.deltaY > 0) {
    parallaxRef.current.scrollTo((currentSection + 1) % sections.length);
  } else {
    parallaxRef.current.scrollTo((currentSection - 1 + sections.length) % sections.length);
  }
};

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
    <div className="app-container" onWheel={handleWheel}>
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
    
      {/* Parallax scrolling */}
      <Parallax 
        ref={parallaxRef} 
        pages={sections.length}
      >
        {sections.map((section, index) => (
          <ParallaxLayer 
            key={index}
            offset={index}
            speed={0.5}
            style={{ 
              background: section.bg,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              padding: '2rem'
            }}
          >
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{section.title}</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{section.content}</p>
            
            {/* Mostra il componente specifico per la sezione */}
            {section.component && (
              <div style={{ width: '80%', maxWidth: '800px' }}>
                {section.component}
              </div>
            )}

            {/* Pulsanti solo nella prima sezione */}
            {index === 0 && (
              <div className="hero-buttons">
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="me-3"
                  onClick={() => setShowLogin(true)}
                >
                  {authData.token ? 'Il mio giardino' : 'Accedi'}
                </Button>
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={() => { if (parallaxRef.current) parallaxRef.current.scrollTo(1); }}
                >
                  Esplora
                </Button>
              </div>
            )}
          </ParallaxLayer>
        ))}
      </Parallax>

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
      </div>
    </div>
  );
};

export default App;