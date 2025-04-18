import "../styles/SeedPreview.css";

export default function SeedPreview() {
  return (
    <div className="seed-preview d-flex flex-column align-items-center text-center">
      <img src="./src/images/seed_floating.jpeg" alt="Seme di quercia" className="seed-floating" />
      <p className="mt-3 text-white lead">
        Il seme del <strong>Coraggio</strong> è pronto.<br />
        Crescerà e sboccerà nel tempo...
      </p>
    </div>
  );
}
