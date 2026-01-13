# Météore — Plateforme de réservation de vols

Application web fullstack de réservation de vols d'avion, développée dans le cadre du module **UML & Développement Fullstack** (2e année Informatique).

## Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | React 18 (Vite) + Tailwind CSS 3 |
| Backend | Node.js 20 + Express 4 |
| Base de données | MySQL 8 |
| ORM | Sequelize 6 |
| Authentification | JWT + bcryptjs |
| Conteneurisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## Prérequis

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) et Docker Compose
- [Git](https://git-scm.com/)

## Installation et lancement

### Avec Docker (recommandé)

```bash
# Cloner le dépôt
git clone https://github.com/votre-repo/meteore.git
cd meteore

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer l'application (3 conteneurs : frontend, backend, MySQL)
docker-compose up --build
```

- Frontend : http://localhost:5173
- Backend API : http://localhost:3001
- Base de données : localhost:3306

### Sans Docker (développement local)

```bash
# Backend
cd backend
cp .env.example .env
# Modifier .env avec vos paramètres MySQL locaux
npm install
npm run seed   # Créer les tables et insérer les données de test
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

## Données de test (seed)

Le script `npm run seed` crée :

| Compte | Email | Mot de passe | Rôle |
|--------|-------|-------------|------|
| Admin | admin@meteore.fr | admin123 | admin |
| Utilisateur | jean.dupont@email.com | user123 | user |

Ainsi que 8 aéroports, 4 compagnies aériennes et 12 vols.

## Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|------------|-------------------|
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_NAME` | Nom de la base | `meteore` |
| `DB_USER` | Utilisateur MySQL | `meteore_user` |
| `DB_PASSWORD` | Mot de passe MySQL | `meteore_pass` |
| `JWT_SECRET` | Clé secrète JWT | (à définir) |
| `JWT_EXPIRES_IN` | Durée de validité du token | `24h` |
| `PORT` | Port du serveur backend | `3001` |

## Architecture

```
meteore/
├── frontend/                    # Application React (Vite)
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   ├── pages/               # Pages de l'application
│   │   ├── services/            # Appels API (Axios)
│   │   ├── context/             # Context React (Auth)
│   │   ├── hooks/               # Hooks personnalisés
│   │   └── utils/               # Utilitaires
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                     # API REST Express
│   ├── src/
│   │   ├── controllers/         # Logique métier
│   │   ├── models/              # Modèles Sequelize
│   │   ├── routes/              # Endpoints HTTP
│   │   ├── middlewares/         # Auth, validation
│   │   ├── validators/          # Règles express-validator
│   │   └── config/              # BDD, seed
│   └── __tests__/               # Tests Jest
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

## Endpoints API

### Authentification
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |
| GET | `/api/auth/me` | Profil connecté | Oui |
| PUT | `/api/auth/profile` | Modifier profil | Oui |

### Vols
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/flights/search` | Recherche de vols | Non |
| GET | `/api/flights/:id` | Détail d'un vol | Non |
| POST | `/api/flights` | Créer un vol | Admin |
| PUT | `/api/flights/:id` | Modifier un vol | Admin |
| DELETE | `/api/flights/:id` | Supprimer un vol | Admin |

### Aéroports
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/airports` | Liste des aéroports | Non |
| POST | `/api/airports` | Créer un aéroport | Admin |
| PUT | `/api/airports/:id` | Modifier un aéroport | Admin |
| DELETE | `/api/airports/:id` | Supprimer un aéroport | Admin |

### Compagnies aériennes
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/airlines` | Liste des compagnies | Non |
| POST | `/api/airlines` | Créer une compagnie | Admin |
| PUT | `/api/airlines/:id` | Modifier une compagnie | Admin |
| DELETE | `/api/airlines/:id` | Supprimer une compagnie | Admin |

### Réservations
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/bookings` | Créer une réservation | Oui |
| GET | `/api/bookings/my` | Mes réservations | Oui |
| GET | `/api/bookings/admin/all` | Toutes les réservations | Admin |
| GET | `/api/bookings/:id` | Détail d'une réservation | Oui |
| PATCH | `/api/bookings/:id/cancel` | Annuler une réservation | Oui |

### Paiements
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/payments/:bookingId/pay` | Payer une réservation | Oui |
| GET | `/api/payments/:bookingId` | Consulter un paiement | Oui |

## Tests

```bash
cd backend
npm test
```

## Déploiement

- **Frontend** : Vercel (déploiement automatique sur push `main`)
- **Backend** : Render (service Node.js)
- **CI/CD** : GitHub Actions (lint, tests, build)

## Équipe

Projet réalisé par 3 étudiants en 2e année d'Informatique.

## Licence

Projet universitaire — usage éducatif uniquement.
