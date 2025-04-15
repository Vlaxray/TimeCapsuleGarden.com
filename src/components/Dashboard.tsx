import React, { useEffect, useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // 1. Prima dichiara il ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 2. Poi dichiara lo stato
  const [seeds] = React.useState([
    { id: 1, name: 'Seme della Speranza', planted: '2025-04-01', status: 'Crescendo', emotion: 'Speranza' },
    { id: 2, name: 'Seme della Gioia', planted: '2025-03-15', status: 'Fiorito', emotion: 'Gioia' },
    { id: 3, name: 'Seme della Forza', planted: '2025-02-10', status: 'Crescendo', emotion: 'Forza' },
    { id: 4, name: 'Seme dell\'Amore', planted: '2025-01-20', status: 'Fiorito', emotion: 'Amore' },
    { id: 5, name: 'Seme della Libertà', planted: '2025-06-05', status: 'Crescendo', emotion: 'Libertà' },
    { id: 6, name: 'Seme della Pace', planted: '2025-05-12', status: 'Germogliando', emotion: 'Pace' },
    { id: 7, name: 'Seme della Resilienza', planted: '2025-04-22', status: 'Fiorito', emotion: 'Resilienza' },
    { id: 8, name: 'Seme della Creatività', planted: '2025-03-30', status: 'Crescendo', emotion: 'Creatività' },
    { id: 9, name: 'Seme della Pazienza', planted: '2025-02-15', status: 'Germogliando', emotion: 'Pazienza' },
    { id: 10, name: 'Seme della Saggezza', planted: '2025-01-10', status: 'Fiorito', emotion: 'Saggezza' },
  ]);

  useEffect(() => {
    // 3. Qui puoi usare scrollContainerRef perché è già dichiarato
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* 4. Assegna il ref al div container */}
      <div 
        ref={scrollContainerRef}
        className="dashboard-scroll-container"
      >
        {seeds.map((seed) => (
          <Card key={seed.id} className="dashboard-card">
            <Card.Body className="card-body">
              <Card.Title className="card-title">{seed.name}</Card.Title>
              <div className="card-icon">
                {seed.status === 'Fiorito' ? '🌻' : '🌱'}
              </div>
              <Card.Text className="card-text">
                <span className="card-label">Piantato il:</span> {seed.planted}
                <br />
                <span className="card-label">Stato:</span> <span className={`status-${seed.status.toLowerCase()}`}>{seed.status}</span>
                <br />
                <span className="card-label">Emozione:</span> {seed.emotion}
              </Card.Text>
              <Button variant="primary" className="card-button">Apri il seme</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;