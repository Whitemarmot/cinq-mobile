# Cinq Mobile 📱

Application mobile React Native (Expo) pour **Cinq** - Le réseau social limité à tes 5 personnes les plus proches.

## 🚀 Quick Start

```bash
# Installation des dépendances
npm install

# Lancer en mode développement
npm start

# Ou directement sur une plateforme
npm run ios      # iOS Simulator (macOS only)
npm run android  # Android Emulator
npm run web      # Web browser
```

## 📁 Structure du projet

```
cinq-mobile/
├── App.tsx                 # Point d'entrée
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── ContactSlot.tsx
│   │   ├── Header.tsx
│   │   ├── Input.tsx
│   │   ├── MessageBubble.tsx
│   │   └── Post.tsx
│   │
│   ├── screens/            # Écrans de l'app
│   │   ├── AppScreen.tsx      # Écran principal (5 contacts)
│   │   ├── ChatScreen.tsx     # Conversation
│   │   ├── FeedScreen.tsx     # Fil d'actualité
│   │   ├── LoginScreen.tsx    # Connexion
│   │   ├── RegisterScreen.tsx # Inscription
│   │   └── SettingsScreen.tsx # Paramètres
│   │
│   ├── services/           # Logique métier
│   │   ├── api.ts          # Client API backend
│   │   └── storage.ts      # Stockage local
│   │
│   ├── hooks/              # React hooks custom
│   │   ├── useAuth.ts
│   │   ├── useContacts.ts
│   │   └── useMessages.ts
│   │
│   ├── theme/              # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   └── navigation/         # Navigation config
│       └── types.ts
```

## 🎨 Design System

Le design system mobile est basé sur celui du web :

### Couleurs principales
- **Primary**: `#6366F1` (Indigo)
- **Secondary**: `#EC4899` (Pink)
- **Success/Online**: `#10B981` (Emerald)
- **Error/Busy**: `#EF4444` (Red)

### Typographie
- Headings: System font, bold
- Body: 16px regular
- Caption: 12px

## 🔌 API Backend

L'app communique avec le backend Cinq existant via `src/services/api.ts`.

### Configuration
```bash
# .env (ou app.config.js)
EXPO_PUBLIC_API_URL=https://api.cinq.app
```

### Endpoints utilisés
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /auth/me` - Profil utilisateur
- `GET /contacts` - Liste des 5 contacts
- `POST /contacts` - Ajouter un contact
- `GET /conversations` - Liste des conversations
- `GET /conversations/:id/messages` - Messages
- `POST /conversations/:id/messages` - Envoyer message
- `GET /feed` - Fil d'actualité

## 📦 Dépendances à installer

```bash
# Navigation (si vous utilisez React Navigation)
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Storage
npm install @react-native-async-storage/async-storage
```

## 🏗️ TODO / Prochaines étapes

- [ ] Intégrer React Navigation
- [ ] Ajouter la gestion WebSocket pour le real-time
- [ ] Implémenter les notifications push
- [ ] Ajouter le support des images/média
- [ ] Mode sombre
- [ ] Tests unitaires
- [ ] Internationalisation (i18n)

## 📱 Features Cinq

1. **5 Slots de contacts** - Interface unique en cercle
2. **Chat privé** - Messages avec vos proches
3. **Feed limité** - Uniquement vos 5 contacts
4. **Statuts** - Online/Offline/Busy

## 🛠️ Development

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build production
expo build:ios
expo build:android
# ou avec EAS
eas build
```

## 📄 License

MIT © Cinq Team
