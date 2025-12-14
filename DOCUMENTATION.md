# Planet Race - Multiplayer Racing Platform

A mobile-first multiplayer arcade racing game platform built with Next.js, TypeScript, and Prisma.

## 🌟 Features

### Player Features
- **Authentication System**
  - Guest accounts (no registration required)
  - Full account registration with email/password
  - OAuth-ready architecture (Google, Apple)
  - Session-based token authentication

- **Race Management**
  - Submit race results with detailed lap and checkpoint times
  - Race modes: Time Trial, Ghost Race, Multiplayer
  - Automatic global and daily ranking
  - Comprehensive race history

- **Ghost Replay System**
  - Record and store ghost replay data
  - Download ghosts to race against
  - Sort by fastest time or most popular
  - Automatic download tracking

- **Leaderboards**
  - Global leaderboards per track
  - Daily leaderboards (reset every 24 hours)
  - Pagination support for large datasets

- **Multiplayer Lobbies**
  - Create public or private lobbies
  - Join existing lobbies
  - Ready system for coordinating race starts
  - Automatic host reassignment
  - Empty lobby cleanup

- **Matchmaking**
  - Automatic lobby finding
  - Create new lobby if no suitable match
  - Filter by track and race mode
  - Skill-based matching ready (extensible)

### Developer Features
- **RESTful API**
  - Clean, consistent endpoint structure
  - Comprehensive error handling
  - JSON responses with success/error status
  - API documentation endpoint

- **Admin Tools**
  - Platform statistics dashboard
  - Player analytics
  - Recent activity tracking
  - Top players listing

- **Unity Client Integration**
  - CORS-enabled API endpoints
  - Mobile-optimized data structures
  - Efficient ghost replay format
  - Platform type tracking (iOS, Android, Editor)

## 🏗️ Architecture

### Tech Stack
- **Frontend/Backend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production-ready)
- **ORM**: Prisma
- **Authentication**: JWT + Session tokens
- **Password Hashing**: bcryptjs

### Project Structure

```
planet-race/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── players/       # Player profiles
│   │   │   ├── races/         # Race submission & results
│   │   │   ├── ghosts/        # Ghost replay management
│   │   │   ├── leaderboard/   # Leaderboard queries
│   │   │   ├── lobbies/       # Lobby management
│   │   │   ├── matchmaking/   # Automatic matchmaking
│   │   │   └── admin/         # Admin endpoints
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Authentication utilities
│   │   └── api-helpers.ts     # API helper functions
│   ├── types/
│   │   └── api.ts             # TypeScript type definitions
│   └── services/              # Future: Node.js services
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cherrykhanneala/Planet-race.git
   cd Planet-race
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: Database connection string
   - `JWT_SECRET`: Secret key for JWT tokens (change in production!)

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   - Web interface: http://localhost:3000
   - API documentation: http://localhost:3000/api/docs

## 📚 API Documentation

### Quick Start

1. **Create a guest account**
   ```bash
   curl -X POST http://localhost:3000/api/auth/guest \
     -H "Content-Type: application/json" \
     -d '{"displayName": "Test Player"}'
   ```

2. **Submit a race result**
   ```bash
   curl -X POST http://localhost:3000/api/races/submit \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "trackId": "track_01",
       "raceMode": "time_trial",
       "finishTime": 125000,
       "lapTimes": [62500, 62500],
       "checkpointTimes": [31250, 62500, 93750, 125000],
       "gameVersion": "1.0.0",
       "platformType": "ios"
     }'
   ```

3. **Get leaderboard**
   ```bash
   curl "http://localhost:3000/api/leaderboard?trackId=track_01&type=global&limit=10"
   ```

### Complete API Reference

Visit `/api/docs` endpoint for complete API documentation including:
- All endpoints with request/response schemas
- Authentication requirements
- Type definitions
- Example requests

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login
- `POST /api/auth/guest` - Create guest account
- `POST /api/auth/logout` - Logout

#### Players
- `GET /api/players/me` - Get current player profile
- `GET /api/players/{id}` - Get player by ID

#### Races
- `POST /api/races/submit` - Submit race result
- `GET /api/races/results` - Get race results

#### Ghosts
- `GET /api/ghosts` - List ghost replays
- `GET /api/ghosts/{id}` - Download ghost replay data

#### Leaderboards
- `GET /api/leaderboard` - Get leaderboard

#### Lobbies
- `POST /api/lobbies/create` - Create lobby
- `GET /api/lobbies/list` - List lobbies
- `GET /api/lobbies/{id}` - Get lobby details
- `POST /api/lobbies/{id}/join` - Join lobby
- `POST /api/lobbies/{id}/leave` - Leave lobby
- `POST /api/lobbies/{id}/ready` - Update ready status

#### Matchmaking
- `POST /api/matchmaking` - Find or create lobby

#### Admin
- `GET /api/admin/stats` - Platform statistics

## 🔒 Security

- Password hashing with bcryptjs (10 rounds)
- Session-based token authentication
- JWT secrets should be rotated in production
- CORS headers configured for API access
- Input validation on all endpoints
- SQL injection protection via Prisma ORM

## 📈 Scalability Considerations

### Current Implementation (MVP)
- SQLite database (simple, file-based)
- Synchronous ranking calculations
- In-memory session storage

### Production Recommendations
1. **Database**
   - Switch to PostgreSQL for production
   - Add database indexes for performance
   - Implement connection pooling

2. **Caching**
   - Add Redis for leaderboard caching
   - Cache frequently accessed ghost replays
   - Session storage in Redis

3. **Background Jobs**
   - Move ranking calculations to background jobs
   - Daily leaderboard pre-computation
   - Expired session cleanup jobs

4. **Real-time Features**
   - WebSocket server for live lobby updates
   - Real-time race coordination
   - Live leaderboard updates

5. **CDN & Storage**
   - Store ghost replay data in object storage (S3)
   - CDN for static assets
   - Compress large replay data

## 🎮 Unity Client Integration

### Authentication Flow
1. Call `/api/auth/guest` or `/api/auth/login`
2. Store the returned `token`
3. Include token in all subsequent requests: `Authorization: Bearer {token}`

### Race Submission
1. Record race data (times, checkpoints, optional replay data)
2. Call `/api/races/submit` with race data
3. Receive global and daily rankings

### Ghost Racing
1. Call `/api/ghosts?trackId={track}` to list available ghosts
2. Call `/api/ghosts/{id}` to download ghost replay data
3. Play back replay data in Unity

### Multiplayer Flow
1. Call `/api/matchmaking` to find/create lobby
2. Poll `/api/lobbies/{id}` for lobby updates
3. Call `/api/lobbies/{id}/ready` when ready
4. Host starts race when all players ready
5. Submit results to `/api/races/submit`

## 🛠️ Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Production
```bash
npm run build
npm start
```

### Database Management

**View database schema**
```bash
npx prisma studio
```

**Create migration**
```bash
npx prisma migrate dev --name migration_name
```

**Reset database**
```bash
npx prisma db push --force-reset
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `JWT_SECRET` | Secret key for JWT tokens | (must be set) |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |

## 🎯 Original IP Compliance

This platform is designed for **original intellectual property only**:
- No copyrighted characters, themes, or assets
- Clean, generic racing platform
- Customizable for any racing theme
- Unity client integration for custom game content

## 🔮 Future Enhancements

### Planned Features
- [ ] OAuth integration (Google, Apple, Facebook)
- [ ] Real-time multiplayer coordination service
- [ ] Player friend system
- [ ] Achievements and unlockables
- [ ] Seasonal events and tournaments
- [ ] Player-created custom tracks
- [ ] Replay sharing and social features
- [ ] Anti-cheat validation
- [ ] Rate limiting and abuse prevention
- [ ] Analytics and telemetry

### Extensibility Points
- Custom track validation
- Player skill rating system
- Tournament bracket system
- Clan/team functionality
- In-game currency/economy
- Cosmetic customization

## 📄 License

This project is provided as-is for the Planet Race platform.

## 🤝 Contributing

This is a production platform. Please follow these guidelines:
- Write tests for new features
- Follow TypeScript best practices
- Update documentation
- Ensure backward compatibility
- Consider mobile performance

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ for mobile-first multiplayer racing
