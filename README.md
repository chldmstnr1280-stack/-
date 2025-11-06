# 🌱 SELLERY - Emotional Garden App

**Phase 1 Complete Implementation**

SELLERY is an emotional routine app that helps users track their feelings and grow a virtual mascot named Selly. This repository contains a full-stack implementation with React Native mobile app and Express/Prisma backend.

## 📋 Features Implemented (Phase 1)

### ✅ Completed Features
- 🔐 Email magic link authentication (console-based dev mode)
- 📝 Emotion logging with emoji selection, intensity slider (0-10), and notes
- 🌰🌱🌿 Mascot growth system (3 stages: seed → sprout → kid)
- 💬 Rule-based emotional support messages
- 📊 Weekly statistics report
  - Average intensity
  - Top 3 emotions
  - Days logged count
  - 7-day trend visualization
- 🧪 Comprehensive test coverage
- 📚 OpenAPI documentation with Swagger UI
- 🔄 GitHub Actions CI pipeline

### 🚧 Stub Interfaces (Phase 2/3)
- Step tracking API endpoints
- Cycle tracking API endpoints
- Store & inventory system
- LLM integration hooks
- Outfit & decoration system

## 🏗️ Tech Stack

### Mobile App
- **Framework**: React Native + Expo (~50.0)
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: React Query + Axios
- **Storage**: Expo SecureStore
- **Testing**: Jest + Testing Library

### Server
- **Runtime**: Node.js 20+
- **Framework**: Express
- **ORM**: Prisma
- **Database**: SQLite (dev), PostgreSQL-ready
- **Auth**: JWT with magic links
- **Documentation**: OpenAPI 3.0 + Swagger UI
- **Testing**: Jest + Supertest

## 📁 Project Structure

```
.
├── server/                 # Backend API
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Seed script
│   ├── src/
│   │   ├── auth/          # JWT utilities
│   │   ├── services/      # Business logic (mascot, stats)
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── index.ts       # Main server
│   ├── tests/             # Server tests
│   └── openapi.yaml       # API documentation
│
├── app/                    # Mobile app
│   ├── app/               # Expo Router screens
│   │   ├── (auth)/        # Auth flow
│   │   ├── (tabs)/        # Main app tabs
│   │   └── _layout.tsx
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── stores/        # Zustand stores
│   │   └── types/         # TypeScript types
│   └── tests/             # App tests
│
├── .github/
│   └── workflows/
│       └── ci.yml         # CI pipeline
│
└── pnpm-workspace.yaml    # Monorepo config
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20+
- pnpm 8+
- Expo Go app on your phone (for mobile testing)

### Installation & Running

#### 1. Install all dependencies
```bash
pnpm install
```

#### 2. Setup and start the server
```bash
cd server

# Copy environment variables
cp .env.example .env

# Generate Prisma client and run migrations
pnpm prisma generate
pnpm prisma migrate dev --name init

# Seed database with demo data
pnpm prisma:seed

# Start server (default port 3000)
pnpm dev
```

Server will be available at:
- API: `http://localhost:3000`
- OpenAPI Docs: `http://localhost:3000/docs`
- Health Check: `http://localhost:3000/health`

#### 3. Setup and start the mobile app (in a new terminal)
```bash
cd app

# Copy environment variables
cp .env.example .env

# Start Expo
pnpm start
```

Scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

### 🧪 Running Tests

```bash
# Run all tests
pnpm test

# Server tests only
cd server && pnpm test

# App tests only
cd app && pnpm test
```

### 🔍 Linting

```bash
pnpm lint
```

## 📱 Using the App

### 1. Authentication
1. Enter your email on the login screen
2. Click "Get Magic Link"
3. Check the **server console** for the magic token
4. Copy and paste the token into the app
5. Complete onboarding

### 2. Main Features

#### 🏡 Home (Garden)
- View your mascot's current stage and growth score
- See personalized emotional support message
- Quick access to log emotions and view reports

#### 📝 Emotion Log
- Select emotion from 8 options (happy, sad, anxious, calm, etc.)
- Set intensity on 0-10 scale
- Add optional notes
- Submit to update mascot growth

#### 📊 Weekly Report
- View last 7 days statistics
- See top emotions chart
- Daily trend visualization
- AI-generated insights

#### ⚙️ Settings
- View account information
- Preview coming features (Phase 2/3)
- Logout

## 🎮 Mascot Growth Rules

### Calculation
- **Daily logging**: +2 points per day with at least 1 entry
- **Intensity bonus**: Lower average intensity = more points (promotes awareness)
- **Formula**: `score = Σ(days_logged * 2 + intensity_bonus)`

### Stages
| Score | Stage | Emoji | Name |
|-------|-------|-------|------|
| 0-9   | seed  | 🌰    | 씨앗 셀리 |
| 10-19 | sprout| 🌱    | 새싹 셀리 |
| 20+   | kid   | 🌿    | 꼬마 셀리 |

### Support Messages
Rule-based messages mapped by emotion + intensity level:
- **Low** (0-3): Gentle acknowledgment
- **Medium** (4-7): Supportive guidance
- **High** (8-10): Active intervention

Example: `anxious` + `high` intensity → "지금은 호흡에 집중해요. 천천히, 깊게."

## 🔌 API Endpoints

### Authentication
- `POST /auth/magic-link` - Request magic link
- `POST /auth/callback` - Verify token and get JWT

### User
- `GET /me` - Get current user profile

### Emotions
- `POST /emotion` - Create emotion entry
- `GET /emotion?from&to` - List entries with optional date range

### Mascot
- `GET /mascot/today` - Get current stage, score, and message

### Reports
- `GET /report/weekly` - Get 7-day statistics

### Stubs (Phase 2/3)
- `POST /steps` - Step logging (not implemented)
- `POST /cycle` - Cycle logging (not implemented)
- `GET /store` - Shop items (not implemented)
- `GET /inventory` - User inventory (not implemented)
- `POST /ai/message` - LLM chat (not implemented)

Full API documentation: `http://localhost:3000/docs`

## 🗄️ Database Schema

```prisma
User {
  id, email, createdAt
  emotionEntries[], mascotState
}

EmotionEntry {
  id, userId, timestamp
  emotionLabel, intensity (0-10)
  notes, tags[]
}

MascotState {
  id, userId
  stage (seed|sprout|kid)
  score, updatedAt
}

// Phase 2/3 stubs
StepLog, CycleLog, ShopItem, Inventory
```

## 🔄 Database Migrations

```bash
cd server

# Create new migration
pnpm prisma migrate dev --name description

# Reset database (⚠️ deletes all data)
pnpm prisma migrate reset

# Deploy to production
pnpm prisma migrate deploy
```

## 🐘 PostgreSQL Migration Guide

To switch from SQLite to PostgreSQL:

### 1. Update `server/.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sellery?schema=public"
```

### 2. Update `server/prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. Recreate migrations
```bash
# Delete old migrations
rm -rf prisma/migrations

# Create new migration for PostgreSQL
pnpm prisma migrate dev --name init_postgres
```

### 4. No code changes needed!
All queries are database-agnostic thanks to Prisma.

## 🧩 Environment Variables

### Server (`server/.env`)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
MAGIC_LINK_BASE_URL="http://localhost:3000/auth/callback"
```

### App (`app/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ENV=development
```

**⚠️ Security Note**: Never commit `.env` files. Use strong secrets in production.

## 🚀 Deployment

### Server Deployment (Example: Railway/Render)
1. Set environment variables (especially `JWT_SECRET`)
2. Set `DATABASE_URL` to PostgreSQL connection string
3. Run migrations: `pnpm prisma migrate deploy`
4. Start: `pnpm start`

### Mobile Deployment
```bash
cd app

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

See [Expo EAS documentation](https://docs.expo.dev/build/introduction/) for details.

## 🧪 Test Coverage

### Server Tests
- ✅ Auth flow (magic link generation + verification)
- ✅ Emotion CRUD operations
- ✅ Mascot state calculation
- ✅ Weekly statistics generation

### App Tests
- ✅ Auth store logic
- ✅ Emotion store logic
- ✅ API client configuration

Run with coverage:
```bash
cd server && pnpm test -- --coverage
cd app && pnpm test -- --coverage
```

## 📈 Phase 2/3 Roadmap

### Phase 2 (Future)
- [ ] Step tracking integration (Apple Health, Google Fit)
- [ ] Menstrual cycle tracking
- [ ] In-app store with mascot items
- [ ] Inventory management
- [ ] Achievement system

### Phase 3 (Future)
- [ ] LLM-powered emotional insights (OpenAI/Gemini)
- [ ] Personalized coping strategies
- [ ] Outfit & decoration customization
- [ ] Social features (opt-in sharing)
- [ ] Advanced analytics dashboard

**Implementation Pointers**:
- Database schema already includes stub tables
- API endpoints return `{ message: "Not Implemented", phase: N }`
- Frontend can show "Coming Soon" UI
- LLM integration: Add `src/services/llm.ts` and configure API keys

## 🤝 Contributing

This is a Phase 1 implementation. Contributions welcome!

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - feel free to use this code for your projects!

## 🆘 Troubleshooting

### "Cannot connect to server"
- Ensure server is running on port 3000
- Check `EXPO_PUBLIC_API_URL` in `app/.env`
- On physical device, use your computer's local IP instead of `localhost`

### "Prisma Client not found"
```bash
cd server
pnpm prisma generate
```

### "Expo module not found"
```bash
cd app
pnpm install
```

### Database issues
```bash
cd server
pnpm prisma migrate reset  # ⚠️ Deletes all data
pnpm prisma:seed
```

## 📞 Support

- 📧 Issues: [GitHub Issues](https://github.com/yourusername/sellery/issues)
- 📚 Docs: `/server/openapi.yaml`
- 🧪 Tests: `pnpm test`

---

**Built with ❤️ for emotional wellbeing**

Current Version: **1.0.0 (Phase 1)** 🌱
