const CalendarWidget = ({ events }: { events: any[] }) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-emerald-800">Calendario Semi</h2>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center p-3 border-b border-gray-100">
              <div className={`w-8 h-8 rounded-full bg-${event.plant}-100 text-${event.plant}-600 flex items-center justify-center mr-3`}>
                {event.plant === "rosa" ? "🌹" : "🌳"}
              </div>
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">{event.date} • {event.emotion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
 