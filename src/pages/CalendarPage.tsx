import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';
// Definizione del tipo Plant locale
export type Plant = {
  id: string;
  name: string;
  emotion: 'joy' | 'nostalgia' | 'hope' | 'fear';
  openDate: Date;
};

const CalendarPage = ({ plants }: { plants: Plant[] }) => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Colori emozioni
  const emotionColors: Record<string, string> = {
    joy: '#FFD700',
    nostalgia: '#9B59B6',
    hope: '#2ECC71',
    fear: '#E74C3C'
  };

  return (
    <div className="calendar-page">
      <h2>Calendario {format(currentDate, 'MMMM yyyy')}</h2>
      
      <div className="calendar-grid">
        {/* Intestazioni giorni settimana */}
        {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
          <div key={day} className="calendar-header">{day}</div>
        ))}

        {/* Giorni del mese */}
        {days.map(day => {
          const dayPlants = plants.filter(p => isSameDay(p.openDate, day));
          return (
            <div 
              key={day.toString()} 
              className={`calendar-day ${dayPlants.length > 0 ? 'has-plant' : ''}`}
            >
              <span>{format(day, 'd')}</span>
              {dayPlants.map(plant => (
                <div 
                  key={plant.id} 
                  className="plant-marker"
                  style={{ backgroundColor: emotionColors[plant.emotion] }}
                  title={`${plant.name} (${plant.emotion})`}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;