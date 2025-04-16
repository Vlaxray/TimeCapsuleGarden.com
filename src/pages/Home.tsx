import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
//import CalendarWidget from "../components/CalendarWidget";
import GardenPreview from "../components/GardenPreview";
import TokenBalance from "../components/TokenBalance";
import QuickActions from "../components/QuickActions";

const Home = () => {
  // Dati mock per il calendario
  const events = [
    {
      id: 1,
      date: "2023-12-25",
      title: "Regalo di Natale",
      plant: "rosa",
      emotion: "joy",
    },
    {
      id: 2,
      date: "2024-02-14",
      title: "Letter to Future Me",
      plant: "quercia",
      emotion: "hope",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 mt-16 p-8">
        <Header />

        {/* Griglia principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sezione sinistra */}
          <div className="space-y-6">
         
            <GardenPreview />
          </div>

          {/* Sezione destra */}
          <div className="space-y-6">
            <TokenBalance balance={150} />
            <QuickActions />
            <div>
    <a
      href="/marketplace"
      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
    >
      Vai al Marketplace
    </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Home;