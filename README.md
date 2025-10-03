# Sampatrouille - Landing Page de Pré-lancement

## 🚗 Concept

Sampatrouille est un service révolutionnaire de conduite personnelle inspiré du succès en Chine. Un chauffeur formé et certifié vient à votre localisation, conduit **votre propre véhicule** et vous ramène à destination en toute sécurité.
## ✨ Fonctionnalités de la Landing Page

### 🎯 Sections principales
- **Hero Section** : Présentation du concept avec animations
- **Explication du Concept** : 4 étapes claires avec icônes
- **Comment ça marche** : Processus détaillé en 4 étapes
- **Avantages** : 6 points forts du service
- **Vote des Villes** : Système interactif pour choisir la ville de lancement
- **Newsletter** : Inscription pour être notifié du lancement

### Design & UX
- **Design moderne** avec dégradés et animations fluides
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Animations CSS** : Effets de parallax, hover et scroll
- **Icônes Font Awesome** : Interface visuelle claire
- **Couleurs cohérentes** : Palette professionnelle

### Interactions JavaScript
- **Système de vote** avec persistance locale
- **Animations au scroll** avec Intersection Observer
- **Header dynamique** qui se cache/affiche selon le scroll
- **Notifications** pour les actions utilisateur
- **Modal de confirmation** pour les votes
- **Scroll fluide** entre les sections
- **Mobile-first** : Design responsive

## 🔥 Intégration Firebase

### Base de données Firestore
- **Collection `votes`** : Stockage des votes par ville avec compteurs temps réel
- **Collection `newsletter`** : Sauvegarde des emails avec timestamps
- **Synchronisation** automatique entre tous les utilisateurs
- **Persistance hybride** : LocalStorage + Firebase pour la robustesse

## 🔒 Configuration Sécurisée

### Variables d'environnement
1. Créez un fichier `.env` à la racine du projet
2. Copiez le contenu de `env.example` dans `.env`
3. Remplacez les valeurs par vos vraies clés Firebase :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

⚠️ **Important** : Le fichier `.env` est ignoré par Git pour la sécurité.

## 🚀 Déploiement

### Variables d'environnement requises
Configurez ces variables sur votre plateforme de déploiement :
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Plateformes supportées
- **Netlify** (recommandé)
- **Vercel**
- **Firebase Hosting**
- **GitHub Pages** (avec actions)

## 📊 Collections Firebase

### Collection `votes`
```javascript
{
  cityKey: {
    name: "Nom de la ville",
    votes: 0,
    createdAt: timestamp,
    isDefault: true/false
  }
}
```

### Collection `newsletter`
```javascript
{
  email: "user@example.com",
  subscribedAt: timestamp,
  status: "active"
}
```

---

**Sampatrouille** - La révolution du transport sécurisé arrive en France ! 🇫🇷
