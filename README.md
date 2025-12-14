# Planet Race 🏎️

A **mobile-first multiplayer arcade racing game platform** built with Next.js, TypeScript, and Prisma.

## ✨ Overview

Planet Race provides a complete backend infrastructure for multiplayer racing games, designed to integrate seamlessly with Unity mobile game clients. Built with production-ready foundations, it supports async ghost racing, real-time multiplayer coordination, and comprehensive player management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the platform landing page and http://localhost:3000/api/docs for API documentation.

## 📋 Features

### For Players
- **Authentication**: Guest accounts, full registration, OAuth-ready
- **Race Results**: Submit race times with detailed lap/checkpoint data
- **Ghost Replays**: Record and race against ghost data
- **Leaderboards**: Global and daily rankings per track
- **Multiplayer Lobbies**: Create/join lobbies with ready system
- **Matchmaking**: Automatic lobby finding and creation

### For Developers
- **RESTful API**: Clean endpoints for all game operations
- **Type-Safe**: Full TypeScript implementation
- **Unity Integration**: CORS-enabled, mobile-optimized data structures
- **Admin Tools**: Statistics and analytics dashboard
- **Scalable**: Production-ready architecture
- **Well-Documented**: Comprehensive API and architecture docs

## 🏗️ Tech Stack

- **Next.js 15** - App Router, API Routes, SSR
- **TypeScript** - Type safety throughout
- **Prisma** - Type-safe ORM with migrations
- **SQLite/PostgreSQL** - Development/Production databases
- **bcryptjs** - Secure password hashing
- **JWT** - Token-based authentication

## 📚 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete user and developer guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and technical decisions
- **[API Docs](http://localhost:3000/api/docs)** - Interactive API reference

## 🎮 Unity Client Integration

### Example: Guest Login & Race Submission

```csharp
// 1. Create guest account
var authResponse = await PostAsync("/api/auth/guest", new {
    displayName = "Player123"
});
string token = authResponse.data.token;

// 2. Submit race result
await PostAsync("/api/races/submit", new {
    trackId = "track_01",
    raceMode = "time_trial",
    finishTime = 125000,
    lapTimes = new[] { 62500, 62500 },
    checkpointTimes = new[] { 31250, 62500, 93750, 125000 },
    gameVersion = "1.0.0",
    platformType = "ios"
}, token);
```

See [DOCUMENTATION.md](./DOCUMENTATION.md#unity-client-integration) for complete integration guide.

## 🔑 Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/guest` | POST | Create guest account |
| `/api/auth/register` | POST | Register full account |
| `/api/auth/login` | POST | Login with credentials |
| `/api/races/submit` | POST | Submit race result |
| `/api/leaderboard` | GET | Get track leaderboard |
| `/api/ghosts` | GET | List ghost replays |
| `/api/matchmaking` | POST | Find/create lobby |
| `/api/lobbies/create` | POST | Create multiplayer lobby |

Visit `/api/docs` for complete API documentation.

## 📁 Project Structure

```
planet-race/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication
│   │   │   ├── players/    # Player profiles
│   │   │   ├── races/      # Race management
│   │   │   ├── ghosts/     # Ghost replays
│   │   │   ├── leaderboard/# Leaderboards
│   │   │   ├── lobbies/    # Lobby system
│   │   │   └── matchmaking/# Auto-matchmaking
│   │   └── page.tsx        # Landing page
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
└── docs/                   # Documentation
```

## 🛠️ Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Database management UI
npx prisma studio
```

## 🔒 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ Session-based token authentication
- ✅ SQL injection protection (Prisma)
- ✅ Input validation on all endpoints
- ✅ CORS configuration for Unity clients

## 📈 Scalability

**Current (MVP)**: Single server, SQLite, synchronous operations  
**Production**: PostgreSQL, Redis caching, background jobs, horizontal scaling  
**Enterprise**: Microservices, database sharding, multi-region deployment

See [ARCHITECTURE.md](./ARCHITECTURE.md#scalability-roadmap) for scaling strategy.

## 🎯 Original IP Only

This platform is designed for **original intellectual property**:
- No copyrighted characters or themes
- Generic racing platform architecture
- Customizable for any racing game concept
- Unity client controls all visual assets

## 🔮 Roadmap

- [x] Core authentication system
- [x] Race result storage
- [x] Ghost replay system
- [x] Leaderboards (global & daily)
- [x] Lobby system
- [x] Matchmaking
- [ ] OAuth integration (Google, Apple)
- [ ] Real-time multiplayer service
- [ ] Friend system
- [ ] Achievements
- [ ] Anti-cheat validation

## 📄 License

This project is provided as-is for the Planet Race platform.

## 🤝 Contributing

We welcome contributions! Please:
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Consider mobile performance

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for mobile-first multiplayer racing**
