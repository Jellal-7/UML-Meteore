export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-3">Météore</h3>
            <p className="text-primary-300 text-sm">
              Réservation de vols simple, transparente et intuitive.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-primary-300">
              <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/search" className="hover:text-white transition-colors">Rechercher un vol</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-primary-300">
              contact@meteore.fr
            </p>
          </div>
        </div>
        <div className="border-t border-primary-700 mt-8 pt-4 text-center text-sm text-primary-400">
          &copy; {new Date().getFullYear()} Météore. Projet universitaire — UML &amp; Fullstack.
        </div>
      </div>
    </footer>
  );
}
