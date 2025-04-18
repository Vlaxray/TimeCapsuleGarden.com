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
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home'
import './styles/SeedPreview.css';
import SeedPreview from './components/SeedPreview'



const App = () => {
     
         
  
  const navigate = useNavigate()
  // Stati autenticazione
  const [authData, setAuthData] = useState({
    token: localStorage.getItem('authToken') || null,
    user: localStorage.getItem('userName') || null
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
    title: "🌳 Inizia il tuo cammino",
    content: "Benvenuto nel giardino del tempo, dove ogni storia conta...",
    bg: "linear-gradient(to bottom, #001f14, #003d1f)"
  },
  {
    title: "🧪 Scegli il tuo seme",
    content: "Ogni seme racchiude un'emozione unica. Cosa vuoi piantare oggi? Coraggio, amore, gratitudine? La tua storia crescerà con lui...",
    bg: "url('/src/images/background_flying_seed_section2.jpg') ",
    component: <SeedPreview />
  },
  {
    title: "💌 Crea la tua capsula",
    content: "Allega un messaggio, una foto o un video. Ogni seme custodisce emozioni da far sbocciare nel tempo...",
    bg: "linear-gradient(to bottom, #005c2b, #007a36)"
  },
  {
    title: "🔗 Trasformalo in NFT",
    content: "Il tuo seme prende forma come NFT unico, vivo e tuo...",
    bg: "linear-gradient(to bottom, #007a36, #009942)",
    component: <NFTGallery />
  },
  {
    title: "🎁 Conserva, o condividi",
    content: "Custodisci il tuo NFT, condividilo con le persone a te care o rendilo accessibile nel Marketplace...",
    bg: "linear-gradient(to bottom, #007f38, #00b654)",
    component: <Dashboard />
  }
];

// Handler per scroll con rotella
const handleWheel = (e: React.WheelEvent) => {
  e.preventDefault();
  return;
};

 
  // Handler per il login con redirect
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
  
    const payload = {
      email: loginForm.email,
      password: loginForm.password
    }
  
    try {
      const res = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
  
      const data = await res.json()
  
      if (res.ok && data.success) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userName', data.user.name)
        setShowLogin(false)
        setLoginForm({ email: '', password: '' })
        navigate('/home');
      } else {
        setError(data.message || 'Credenziali non valide')
      }
    } catch (err) {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }
  
  

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  // 1) Costruisci il body
  const payload = {
    name: signupForm.name,
    email: signupForm.email,
    password: signupForm.password
  }

  try {
    // 2) Chiamata al tuo PHP
    const res = await fetch('http://localhost:8000/signup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()

    // 3) Gestisci la risposta
    if (res.ok && data.success) {
      setSuccess(data.message)             // es. “Registrazione avvenuta…”
      setTimeout(() => {
        setShowSignup(false)               // chiudi il modal
        setShowLogin(true)                 // apri il login
        setSignupForm({ name:'', email:'', password:'', confirmPassword:'' })
        setSuccess('')
      }, 1500)
    } else {
      setError(data.message || 'Errore durante il signup')
    }
  } catch {
    setError('Impossibile raggiungere il server')
  } finally {
    setLoading(false)
  }
};


// Logout
const handleLogout = () => {
  // Mostra loader durante l'operazione
  setLoading(true);
  
  // Simulazione operazione asincrona (puoi rimuovere il timeout se non serve)
  setTimeout(() => {
    // Pulizia dati di autenticazione
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthData({ token: null, user: null });
    
    // Feedback all'utente
    setSuccess('Logout effettuato con successo!');
    
    // Reset stati e redirect
    setTimeout(() => {
      setSuccess('');
      setLoading(false);
      navigate('/'); // Redirect alla landing
      
    }, 1500);
    
  }, 500); // Ritardo simulazione operazione
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
          mode: "push" 
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

       {/* Modale Login */}{/* Modale Login */}{/* Modale Login */}{/* Modale Login */}
       <Modal show={showLogin} onHide={() => setShowLogin(false)} centered dialogClassName="glass-modal" contentClassName="glass-content">
  <Modal.Header className="glass-header">
    <Modal.Title>Accedi</Modal.Title>
  </Modal.Header>
  <Form onSubmit={handleLogin}>
    <Modal.Body className="glass-body">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="tuo@email.com"
          value={loginForm.email}
          onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
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
          onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
          className="glass-input"
          required
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer className="glass-footer">
      <Button variant="secondary" onClick={() => setShowLogin(false)} className="glass-btn" disabled={loading}>
        Chiudi
      </Button>
      <Button variant="primary" type="submit" className="glass-btn-primary" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Accedi'}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>



{/* Modale Registrazione */}{/* Modale Registrazione */}{/* Modale Registrazione */}
         <Modal
  show={showSignup}
  onHide={() => {
    setShowSignup(false);
    setError('');
  }}
  centered
  dialogClassName="glass-modal"
  contentClassName="glass-content"
>
  <Modal.Header className="glass-header">
    <Modal.Title>Registrati</Modal.Title>
  </Modal.Header>
  <Form onSubmit={handleSignup}>
    <Modal.Body className="glass-body">
      {/* Messaggi di feedback */}
      {error && (
        <Alert variant="danger" className="glass-alert">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="glass-alert">
          {success}
        </Alert>
      )}

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
        onClick={() => {
          setShowSignup(false);
          setError('');
        }}
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
              <span className="text-light me-3">Ciao, {authData.user}</span>
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