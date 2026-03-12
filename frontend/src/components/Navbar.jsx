import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('meteore_dark') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('meteore_dark', dark);
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">
            Météore
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-300 transition-colors">Accueil</Link>
            <Link to="/search" className="hover:text-primary-300 transition-colors">Rechercher</Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="hover:text-primary-300 transition-colors">
                Mes réservations
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="hover:text-primary-300 transition-colors">
                Administration
              </Link>
            )}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
              aria-label="Toggle dark mode"
              title={dark ? 'Mode clair' : 'Mode sombre'}
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-primary-300 transition-colors">
                  {user.first_name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hover:text-primary-300 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-primary-300" onClick={() => setMenuOpen(false)}>Accueil</Link>
            <Link to="/search" className="block py-2 hover:text-primary-300" onClick={() => setMenuOpen(false)}>Rechercher</Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="block py-2 hover:text-primary-300" onClick={() => setMenuOpen(false)}>
                Mes réservations
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="block py-2 hover:text-primary-300" onClick={() => setMenuOpen(false)}>
                Administration
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block py-2 hover:text-primary-300" onClick={() => setMenuOpen(false)}>
                  Mon profil
                </Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-accent-500">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-primary-300" onClick={() => setMenuOpen(false)}>Connexion</Link>
                <Link to="/register" className="block py-2 hover:text-primary-300" onClick={() => setMenuOpen(false)}>Inscription</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
