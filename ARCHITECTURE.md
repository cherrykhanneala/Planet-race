# Architecture Notes

## System Design

### Overview
Planet Race is a **mobile-first multiplayer arcade racing game platform** designed to support:
- Async ghost racing (primary mode)
- Real-time multiplayer (future enhancement)
- Unity game client integration
- Scalable backend infrastructure

### Architecture Principles

1. **API-First Design**
   - RESTful API for all game operations
   - Stateless request handling
   - JWT-based authentication
   - JSON request/response format

2. **Mobile-Optimized**
   - Lightweight data payloads
   - Efficient ghost replay compression (JSON format, ready for binary upgrade)
   - Pagination on all list endpoints
   - Support for intermittent connectivity (via guest accounts)

3. **Scalable Foundations**
   - Database-agnostic via Prisma ORM
   - Horizontal scaling ready (stateless API)
   - Background job hooks for async processing
   - Caching layer ready

## Technology Stack Rationale

### Next.js with App Router
- **Why**: Server-side rendering, API routes, TypeScript support, production-ready
- **Benefits**: 
  - Unified codebase for web UI and APIs
  - Built-in optimization
  - Easy deployment (Vercel, etc.)
  - Great developer experience

### TypeScript
- **Why**: Type safety, better IDE support, fewer runtime errors
- **Benefits**:
  - Catch errors at compile time
  - Self-documenting code
  - Better refactoring
  - Unity C# developers will feel at home

### Prisma ORM
- **Why**: Type-safe database queries, migrations, multi-database support
- **Benefits**:
  - Auto-generated TypeScript types
  - Query builder prevents SQL injection
  - Easy schema evolution
  - Can switch from SQLite to PostgreSQL without code changes

### SQLite (Development) → PostgreSQL (Production)
- **Development**: SQLite for simplicity and portability
- **Production**: PostgreSQL for:
  - Better concurrency
  - Full-text search
  - JSON query capabilities
  - Proven scalability

## Database Schema Design

### Core Entities

#### Player
- Supports both guest and registered accounts
- OAuth-ready (provider + ID fields)
- Tracks stats (races, wins, rank)
- Soft extensible (can add fields without breaking existing code)

#### RaceResult
- Immutable record of completed races
- Stores detailed timing data as JSON
- Includes platform metadata for analytics
- Links to optional ghost replay

#### GhostReplay
- Separates metadata from replay data
- Download tracking for popularity metrics
- Versioned data format for future upgrades
- Indexed for fast track-based queries

#### Lobby + LobbyMember
- Flexible lobby system for multiplayer
- Status tracking (waiting → ready → racing → finished)
- Public/private with optional password
- Host reassignment on leave

#### Session
- Simple token-based auth
- Expiry tracking
- Easy to move to Redis later

### Indexing Strategy

Performance-critical indexes:
- `Player`: username, email, oauth (login lookups)
- `RaceResult`: trackId + finishTime (leaderboards)
- `RaceResult`: playerId + createdAt (player history)
- `GhostReplay`: trackId + finishTime (ghost selection)
- `Lobby`: status + isPublic (lobby listing)

## API Design Patterns

### Consistent Response Format
```typescript
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

### Authentication Flow
1. Client calls `/api/auth/{register|login|guest}`
2. Server returns `{ player, token, expiresAt }`
3. Client stores token
4. Client includes token in subsequent requests: `Authorization: Bearer {token}`
5. Server validates token via session lookup

### Pagination Pattern
```typescript
{
  items: [...],
  total: number,
  limit: number,
  offset: number
}
```

### Error Handling
- 4xx for client errors (validation, auth, not found)
- 5xx for server errors (database, unexpected)
- Consistent error messages
- No sensitive data in error responses

## Ghost Replay System

### Design Goals
- **Lightweight**: Minimize bandwidth for mobile clients
- **Accurate**: Sufficient data for smooth replay
- **Scalable**: Support thousands of ghosts per track

### Data Format (Current)
```typescript
{
  positions: [[x, y, z], ...],  // Position samples
  rotations: [[x, y, z, w], ...], // Rotation quaternions
  timestamps: [0, 100, 200, ...], // Milliseconds
  metadata: {
    sampleRate: 100, // ms between samples
    interpolationType: "linear" | "cubic"
  }
}
```

### Optimization Strategies
1. **Sampling**: Record at fixed intervals (e.g., 100ms)
2. **Compression**: JSON for MVP, can upgrade to binary format
3. **Interpolation**: Client-side interpolation between samples
4. **Delta Encoding**: Future: store deltas instead of absolute values

### Storage Considerations
- Small ghosts (~50KB): Store in database
- Large ghosts (>1MB): Move to object storage (S3)
- Compression: gzip at rest, decompress on download

## Leaderboard System

### Current Implementation (MVP)
- **Global**: All-time best times per track
- **Daily**: Best times since midnight UTC
- **Calculation**: Synchronous rank calculation on submit

### Ranking Logic
```typescript
// Global rank
const fasterCount = await countRaceResults({
  trackId,
  finishTime: { lt: myTime }
})
const rank = fasterCount + 1

// Daily rank (same but filtered by date)
```

### Production Enhancements
1. **Pre-computed Ranks**: Background job updates ranks
2. **Cached Leaderboards**: Redis cache for top 100
3. **Incremental Updates**: Only recalculate affected ranks
4. **Separate Tables**: DailyLeaderboard table (already in schema)

## Matchmaking Algorithm

### Current (Simple)
1. Find public lobbies with space
2. Filter by track/mode if specified
3. Join first available
4. Create new if none available

### Future (Skill-Based)
1. Calculate player skill rating (ELO, TrueSkill)
2. Find lobbies within skill range
3. Prefer closer skill matches
4. Widen range if waiting too long
5. Create new lobby with similar-skill players

### Lobby Lifecycle
```
waiting → ready → racing → finished
   ↑________________↓
   (can return to waiting)
```

## Multiplayer Coordination

### Phase 1: Async Ghost Racing (Current)
- Players race against pre-recorded ghosts
- No real-time synchronization needed
- Simpler, more scalable
- Works well with intermittent connectivity

### Phase 2: Real-Time Multiplayer (Future)
- WebSocket server for live updates
- Race state synchronization
- Player position updates
- Countdown and start coordination

#### Proposed Real-Time Architecture
```
Unity Client → WebSocket → Node.js Service → Redis Pub/Sub
                              ↓
                         Next.js API (results)
```

#### Components
- **WebSocket Server**: Socket.io or ws
- **Redis**: Pub/sub for lobby/race updates
- **Message Queue**: Race results, events
- **State Management**: In-memory race state

## Security Considerations

### Authentication
- ✅ Password hashing (bcryptjs, 10 rounds)
- ✅ Session tokens with expiry
- ✅ Token validation on protected endpoints
- 🔄 Rate limiting (future)
- 🔄 Account lockout after failed attempts (future)

### Data Validation
- ✅ Required field validation
- ✅ Type checking via TypeScript
- ✅ SQL injection prevention (Prisma)
- 🔄 Race result validation (anti-cheat)
- 🔄 Input sanitization for XSS

### Anti-Cheat (Future)
- Server-side validation of race times
- Physics-based validation (max speed, acceleration)
- Checkpoint timing validation
- Replay analysis for anomalies
- Player reputation/trust system

## Scalability Roadmap

### Current Capacity (Single Server)
- ~1000 concurrent users
- ~10,000 race results/day
- ~1,000 ghost downloads/day

### Scaling to 10K Concurrent Users

1. **Database**
   - PostgreSQL with read replicas
   - Connection pooling (PgBouncer)
   - Query optimization and indexes

2. **Caching**
   - Redis for sessions, leaderboards
   - CDN for static assets
   - API response caching (Varnish)

3. **Application**
   - Horizontal scaling (multiple Next.js instances)
   - Load balancer (Nginx, AWS ALB)
   - Stateless design (no server affinity)

4. **Background Jobs**
   - Bull queue + Redis
   - Separate worker processes
   - Async rank calculations

5. **Storage**
   - S3 for ghost replay data
   - Database for metadata only
   - Compression for bandwidth

### Scaling to 100K+ Concurrent Users

1. **Database Sharding**
   - Shard by region or player ID
   - Consistent hashing
   - Cross-shard query aggregation

2. **Microservices**
   - Separate services: Auth, Races, Lobbies, Leaderboard
   - Service mesh (Istio)
   - gRPC for inter-service communication

3. **Global Distribution**
   - Multi-region deployment
   - Geo-distributed database (CockroachDB, Spanner)
   - CDN with edge caching

4. **Real-time Infrastructure**
   - Dedicated WebSocket cluster
   - Redis Cluster for pub/sub
   - Message queue (RabbitMQ, Kafka)

## Monitoring and Observability

### Metrics to Track
- API response times (p50, p95, p99)
- Database query times
- Error rates by endpoint
- Active users (concurrent)
- Race submissions per minute
- Ghost downloads per minute
- Lobby creation/join rates

### Logging
- Structured logging (JSON)
- Error tracking (Sentry)
- Request/response logging
- Audit logs for admin actions

### Alerts
- API error rate spike
- Database connection exhaustion
- High response times
- Failed race submissions
- Unusual activity patterns

## Development Workflow

### Local Development
1. Install dependencies: `npm install`
2. Set up database: `npx prisma db push`
3. Start dev server: `npm run dev`
4. Access API: http://localhost:3000/api/*

### Database Changes
1. Modify `prisma/schema.prisma`
2. Generate client: `npx prisma generate`
3. Push to database: `npx prisma db push`
4. For production: Create migration: `npx prisma migrate dev`

### Testing Strategy (Future)
- Unit tests: Jest for utilities and helpers
- Integration tests: Supertest for API endpoints
- E2E tests: Playwright for critical flows
- Load tests: Artillery or k6 for performance

## Deployment

### Recommended Stack
- **Hosting**: Vercel (Next.js), AWS ECS, or Railway
- **Database**: Railway PostgreSQL, AWS RDS, or Supabase
- **Cache**: Upstash Redis or AWS ElastiCache
- **Storage**: AWS S3 or Cloudflare R2
- **CDN**: Cloudflare or AWS CloudFront

### Environment Setup
- Development: SQLite, no cache, local
- Staging: PostgreSQL, Redis, cloud
- Production: PostgreSQL (HA), Redis (cluster), multi-region

### CI/CD Pipeline
1. Code push to GitHub
2. Automated tests run
3. Type checking and linting
4. Build Next.js app
5. Run Prisma migrations
6. Deploy to staging
7. Smoke tests on staging
8. Deploy to production (with approval)

## Unity Client Integration Guide

### Setup
1. Import Unity HTTP library (UnityWebRequest)
2. Create API client wrapper
3. Store auth token in PlayerPrefs

### Example Flow
```csharp
// 1. Create guest account
var response = await PostAsync("/api/auth/guest", new {
    displayName = "Player123"
});
var token = response.data.token;

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

// 3. Download ghost
var ghost = await GetAsync($"/api/ghosts/{ghostId}");
PlaybackGhost(ghost.data.replayData);
```

### Best Practices
- Cache frequently accessed data (player profile, leaderboards)
- Retry failed requests with exponential backoff
- Handle offline mode gracefully
- Compress request/response bodies
- Use connection pooling

## Future Considerations

### Mobile-Specific Optimizations
- Binary protocol for race data (Protocol Buffers)
- Delta compression for ghost replays
- Offline queue for race submissions
- Background sync when connectivity returns

### Social Features
- Friend system (follow, challenge)
- Replay sharing (shareable links)
- In-game chat (lobby, post-race)
- Social media integration

### Monetization Ready
- Player inventory system
- Virtual currency
- IAP verification endpoints
- Subscription management
- Ad integration hooks

### Analytics
- Player retention tracking
- Funnel analysis (registration → first race → return)
- Track popularity metrics
- Ghost download patterns
- A/B test framework

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-14  
**Maintainer**: Planet Race Team
