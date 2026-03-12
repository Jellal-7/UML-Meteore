import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-primary-600 mb-4">404</p>
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page introuvable</h1>
      <p className="text-gray-500 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
