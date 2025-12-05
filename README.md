# School Management Application

Application complète de gestion scolaire avec un backend Spring Boot, un frontend Angular, une base de données PostgreSQL et une conteneurisation Docker.

## � Démonstration

- [Voir la démo sur Google Drive](https://drive.google.com/drive/folders/1LrVg4WrAv1rM25Yn4_0FB09vInsdoscw?usp=sharing)

## �📋 Prérequis

- Java 17 ou supérieur
- Node.js (dernière version LTS recommandée)
- npm (inclus avec Node.js)
- Docker et Docker Compose
- PostgreSQL (pour le développement local)
- Maven (pour le backend)
- Angular CLI (pour le frontend)

## 🚀 Structure du Projet

```
relead/
├── schoolManagement/              # Backend Spring Boot
│   ├── src/                      # Code source Java
│   └── pom.xml                   # Configuration Maven
├── school-management-frontend/    # Frontend Angular
│   ├── src/                      # Code source Angular
│   └── package.json              # Dépendances et scripts
├── docker-compose.yml            # Configuration Docker Compose
└── README.md
```

## 🛠 Installation

### 1. Backend (Spring Boot)

```bash
# Se déplacer dans le dossier du backend
cd schoolManagement/schoolManagement

# Installer les dépendances et construire le projet
mvn clean install

# Lancer l'application (développement)
mvn spring-boot:run
```

L'API sera disponible à l'adresse : `http://localhost:8080`

### 2. Frontend (Angular)

```bash
# Se déplacer dans le dossier du frontend
cd school-management-frontend

# Installer les dépendances
npm install

# Lancer l'application en mode développement
ng serve
```

L'application sera disponible à l'adresse : `http://localhost:4200`

## 🐳 Docker

### Construire et lancer avec Docker Compose

```bash
# À la racine du projet
docker-compose up --build
```

### Construire manuellement les images

**Backend :**
```bash
cd schoolManagement/schoolManagement
docker build -t school-management-backend .
```

**Frontend :**
```bash
cd school-management-frontend
docker build -t school-management-frontend .
```

## 🌐 Accès aux services

- **Frontend** : http://localhost:80
- **Backend API** : http://localhost:8080
- **Base de données PostgreSQL** : localhost:5432
  - Base de données : `schooldb`
  - Utilisateur : `postgres`
  - Mot de passe : `postgres`

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données
POSTGRES_DB=schooldb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Configuration Spring
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/${POSTGRES_DB}
SPRING_DATASOURCE_USERNAME=${POSTGRES_USER}
SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}
SPRING_JPA_HIBERNATE_DDL_AUTO=update

# Configuration du frontend
API_URL=http://localhost:8080/api
```

##  Tests

### Backend
```bash
cd schoolManagement/schoolManagement
mvn test
```

### Frontend
```bash
cd school-management-frontend
ng test
```

## 🛠 Déploiement

Pour le déploiement en production, assurez-vous de :
1. Configurer correctement les variables d'environnement
2. Utiliser un profil Spring Boot `prod`
3. Construire le frontend pour la production : `ng build --configuration production`
4. Configurer HTTPS


## ⚠️ Problèmes connus

### Problème d'accès aux routes Angular via Nginx

**Symptômes :**
- L'application se charge correctement sur la page d'accueil
- L'accès direct aux routes comme `/login` ou `/students` affiche la page par défaut de Nginx
- Les logs Nginx ne montrent pas d'erreur évidente

**Tentatives de résolution :**
1. Configuration du `baseHref` dans `angular.json`
2. Mise à jour de la configuration Nginx pour le routage côté client
3. Vérification des permissions des fichiers dans le conteneur
4. Nettoyage du cache du navigateur

**État actuel :**
Malgré ces tentatives, l'accès direct aux routes ne fonctionne toujours pas via le conteneur Nginx. L'application fonctionne correctement en développement avec `ng serve`.


## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 🔍 Dépannage

### Vérification des fichiers dans le conteneur
```bash
docker exec -it school_frontend ls -la /usr/share/nginx/html
```

### Consultation des logs Nginx
```bash
docker logs -f school_frontend
```

### Accès au shell du conteneur pour le débogage
```bash
docker exec -it school_frontend /bin/sh
