import React, { useEffect, useCallback, useState  } from 'react';
import { loadFull } from 'tsparticles';
import { tsParticles } from 'tsparticles-engine';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import Nebbia from './components/Nebbia';
import Lucciole from './components/Lucciole';
import useParallax from './hooks/useParallax';
import './styles/effects.css';
import Dashboard from './components/Dashboard';
import './styles/App.css';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';



const App = () => {
  // Configurazione particelle
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    fullScreen: {
      enable: false,
      zIndex: -1
    },
    particles: {
      number: {
        value: 80,
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
        outModes: { default: 'out' as const },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      },
      links: {
        enable: true,
        distance: 150,
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
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  };

  // Stati per autenticazione
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Stati per form
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Handler per autenticazione (come prima)
  const handleLogin = async () => { 
    setError('');
    try {
      const formData = new FormData();
      formData.append('email', loginData.email);
      formData.append('password', loginData.password);

      const response = await fetch('http://tuoserver.com/path/to/login.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setShowLogin(false);
        setSuccess('Login effettuato con successo!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Errore durante il login');
      }
    } catch (err) {
      setError('Errore di connessione al server');
      console.error('Login error:', err);
    }    
   };

  const handleSignup = async () => { 
    if (signupData.password !== signupData.confirmPassword) {
      setError('Le password non coincidono!');
      return;
    }

    setError('');
    try {
      const formData = new FormData();
      formData.append('name', signupData.name);
      formData.append('email', signupData.email);
      formData.append('password', signupData.password);

      const response = await fetch('http://tuoserver.com/path/to/register.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setShowSignup(false);
        setSuccess('Registrazione completata! Ora puoi effettuare il login');
        setTimeout(() => setSuccess(''), 5000);
        setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Errore durante la registrazione');
      }
    } catch (err) {
      setError('Errore di connessione al server');
      console.error('Signup error:', err);
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
      <div className="content-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        {/* Messaggi e modali... */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Pulsanti auth */}
        <header className="auth-buttons">
          <Button className="auth-btn login-btn" onClick={() => setShowLogin(true)}>
            Accedi
          </Button>
          <Button className="auth-btn signup-btn" onClick={() => setShowSignup(true)}>
            Registrati
          </Button>
        </header>

        
      </div>

      {/* Modali... */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)}>
      <Modal.Header closeButton>
            <Modal.Title>Accedi al tuo account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci la tua email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Inserisci la tua password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogin(false)}>
              Chiudi
            </Button>
            <Button className="signup-btn" onClick={handleLogin}>
              Accedi
            </Button>
          </Modal.Footer>
      </Modal>

      <Modal show={showSignup} onHide={() => setShowSignup(false)}>
      <Modal.Header closeButton>
            <Modal.Title>Crea un nuovo account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci il tuo nome"
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci la tua email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Crea una password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Conferma Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Conferma la password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSignup(false)}>
              Chiudi
            </Button>
            <Button className="signup-btn" onClick={handleSignup}>
              Registrati
            </Button>
          </Modal.Footer>
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
    
  );
};

export default App;