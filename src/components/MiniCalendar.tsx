import { format, isSameDay, addDays } from 'date-fns';

type Plant = {
  openDate: Date;
  // add other properties as needed
};

const MiniCalendar = ({ plants }: { plants: Plant[] }) => {
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="mini-calendar">
      <h3>Prossimi 7 giorni</h3>
      <div className="days-list">
        {next7Days.map(day => {
          const dayPlants = plants.filter(p => isSameDay(p.openDate, day));
          return (
            <div key={day.toString()} className="day-item">
              <span>{format(day, 'EEE d')}</span>
              {dayPlants.length > 0 && (
                <span className="plant-count">{dayPlants.length}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};