# 🌐 AGENT 07 – Multiplayer Deliverable

**Author**: Multiplayer Systems Architect  
**Date**: 2025-12-14  
**Status**: Complete Async & Real-Time Multiplayer Design

---

## Multiplayer Philosophy

### Core Principles
1. **Async First, Real-Time Later**: Ghost racing is MVP, live multiplayer is Phase 2
2. **Low Cost, High Scale**: Optimize for minimal server costs
3. **Fair Matchmaking**: Skill-based ghost selection
4. **No Waiting**: Instant races, no lobby queues (async mode)

---

## Phase 1: Async Ghost Racing (MVP)

### How It Works

#### 1. **Matchmaking Flow**
```
Player Selects Track
    ↓
Server Queries Ghost Pool
    ↓
Skill-Based Selection (3–5 ghosts)
    ↓
Download Ghost Data
    ↓
Race Locally (Unity)
    ↓
Submit Results + New Ghost (optional)
```

#### 2. **Ghost Selection Algorithm**

##### Skill Rating Calculation
```typescript
playerSkillRating = (
  averageFinishTime * 0.6 +
  bestFinishTime * 0.3 +
  racesCompleted * 0.1
)
```

##### Ghost Pool Query
```sql
SELECT * FROM GhostReplays
WHERE trackId = :trackId
  AND finishTime BETWEEN (playerSkillRating * 0.85) AND (playerSkillRating * 1.15)
  AND NOT playerId = :currentPlayer
  AND downloadCount < 10000 -- Freshness filter
ORDER BY RANDOM()
LIMIT 5
```

##### Fallback Logic
- **No ghosts in skill range**: Widen to ±25%
- **Still no ghosts**: Use developer-created ghosts (bronze/silver/gold times)
- **First-time player**: Use "tutorial ghosts" (easy times)

#### 3. **Ghost Data Format**

##### Metadata (Stored in DB)
```json
{
  "ghostId": "uuid",
  "playerId": "player-uuid",
  "trackId": "inferna-01",
  "trackVersion": "1.0",
  "finishTime": 152000,
  "characterId": "zyxx-volt",
  "vehicleId": "photon-dart",
  "createdAt": "2025-12-14T12:00:00Z",
  "downloadCount": 42,
  "integrityStatus": "clean"
}
```

##### Replay Data (Compressed JSON or Binary)
```json
{
  "sampleRate": 100,
  "positions": [
    [0, 0, 0],
    [1.2, 0.1, 0.3],
    ...
  ],
  "rotations": [
    [0, 0, 0, 1],
    [0.01, 0.02, 0, 0.99],
    ...
  ],
  "timestamps": [0, 100, 200, ...],
  "actions": [
    {"t": 1200, "type": "drift_start"},
    {"t": 2500, "type": "item_use", "itemId": "rocket"},
    ...
  ]
}
```

##### Compression Strategy
- **Position Delta Encoding**: Store differences, not absolutes
- **Quaternion Compression**: Use smallest-three compression
- **Action Sparsity**: Only store meaningful events
- **Target Size**: <50KB per ghost (30–60 seconds of data)

---

### Matchmaking Tiers

| Tier | Player Skill Percentile | Ghost Difficulty | Rubber-Banding |
|------|-------------------------|------------------|----------------|
| **Rookie** | 0–20th | Very Easy (90–100th percentile times) | +5% slowdown |
| **Amateur** | 20–50th | Easy (70–90th) | +3% slowdown |
| **Pro** | 50–80th | Medium (40–70th) | +1% slowdown |
| **Elite** | 80–95th | Hard (20–40th) | 0% |
| **Legend** | 95–100th | Very Hard (0–20th) | 0% |

### Rewards Structure

| Placement | XP Reward | Currency | Ghost Upload Eligible? |
|-----------|-----------|----------|------------------------|
| **1st** | 100 XP | 50 credits | Yes (if new PB) |
| **2nd** | 75 XP | 35 credits | Yes (if top 30%) |
| **3rd** | 60 XP | 25 credits | Maybe (if top 50%) |
| **4th** | 50 XP | 20 credits | No |
| **5th** | 40 XP | 15 credits | No |

---

## Ghost Quality Control

### Upload Requirements
1. **Minimum Race Completion**: 90% of track (no quitters)
2. **Integrity Check**: Pass anti-cheat validation (see AGENT_08)
3. **Skill Threshold**: Better than player's worst 3 ghosts in pool
4. **Rate Limit**: Max 10 ghost uploads per hour per player

### Ghost Pool Management

#### Curation Strategy
- **Recent Bias**: Ghosts from last 7 days weighted 3x
- **Diversity**: Ensure mix of characters/vehicles in pool
- **Skill Distribution**: Maintain bell curve across percentiles
- **Removal**: Delete ghosts with <10 downloads after 30 days

#### Developer Ghosts
- **Always Available**: Bronze, Silver, Gold time ghosts for each track
- **Unbeatable Reference**: Platinum ghost (WR-level, aspirational)
- **Personality**: Use different characters for each tier

---

## Leaderboard Integration

### Global Leaderboard
- **Ranking**: Best finish time per track (async races count)
- **Display**: Top 100 globally, player's rank
- **Updates**: Real-time on new PB submission
- **Filtering**: By track, by vehicle, by character

### Daily Leaderboard
- **Reset**: Midnight UTC
- **Rewards**: Top 10 get bonus currency
- **Seasons**: Weekly tournaments (future)

### Friend Leaderboard (Phase 2)
- **Display**: Friends' best times
- **Ghost Priority**: Friend ghosts appear more often in matchmaking

---

## Async Lobby System (Optional MVP Feature)

### How It Works
1. **Player Creates Async Lobby**
   - Select track
   - Set expiration (1 hour, 6 hours, 24 hours)
   - Invite friends or make public

2. **Others Join Anytime**
   - Race solo against same ghost set
   - Results posted to shared lobby leaderboard

3. **Lobby Closes**
   - Final standings determined
   - Rewards distributed

### Use Cases
- **Friendly Challenges**: "Beat my time on Inferna Prime"
- **Guild Races**: Clan vs clan async tournaments
- **Daily Challenges**: Official event lobbies

---

## Phase 2: Real-Time Multiplayer

### Architecture Overview

```
Unity Client ←→ WebSocket Server ←→ Redis Pub/Sub ←→ Next.js API
                      ↓
                Race State Manager
                      ↓
            Position Sync (10Hz)
```

### Technology Stack
- **WebSocket Server**: Node.js + Socket.io or ws
- **State Management**: Redis for lobby state
- **Message Queue**: Bull (Redis-backed) for async jobs
- **Database**: PostgreSQL for persistent data

---

### Real-Time Lobby Lifecycle

#### 1. **Lobby Creation**
```
Client → API: POST /api/lobbies/create
    {
      trackId: "inferna-01",
      maxPlayers: 8,
      isPublic: true,
      mode: "realtime"
    }
API → Response: { lobbyId, websocketUrl }
```

#### 2. **Player Joins**
```
Client → WebSocket: connect(lobbyId)
Server → Broadcast: { type: "player_joined", player }
Server → Client: { type: "lobby_state", players: [...] }
```

#### 3. **Ready System**
```
Client → WebSocket: { type: "ready", playerId }
Server → Broadcast: { type: "player_ready", playerId }

When all ready:
Server → Broadcast: { type: "countdown_start", startTime: T+3s }
```

#### 4. **Race Start**
```
Server → Broadcast: { type: "race_start", serverTime }
Clients: Begin race at synchronized time
```

#### 5. **Position Updates (10Hz)**
```
Client → Server (every 100ms):
{
  type: "position_update",
  pos: [x, y, z],
  rot: [x, y, z, w],
  velocity: [vx, vy, vz],
  timestamp: clientTime
}

Server → Broadcast (interpolated):
{
  type: "positions",
  players: [
    { id, pos, rot, timestamp },
    ...
  ]
}
```

#### 6. **Race Finish**
```
Client → Server: { type: "finish", finishTime, checkpoints }
Server → Validation: Anti-cheat checks
Server → Broadcast: { type: "player_finished", playerId, placement }

When all finish or timeout (3 minutes):
Server → Broadcast: { type: "race_end", results: [...] }
Server → API: POST /api/races/submit-multiplayer
```

---

### Real-Time Optimizations

#### Bandwidth Reduction
- **Position Updates**: 10Hz (100ms intervals), not 60Hz
- **Delta Compression**: Send only changed values
- **Culling**: Don't send positions of players >100 units away
- **Prediction**: Client-side interpolation between updates

#### Latency Handling
- **Client-Side Prediction**: Locally simulate, reconcile with server
- **Server Reconciliation**: Correct major deviations (>5 units)
- **Lag Compensation**: Rewind time for hit detection (weapons)

#### Scalability
- **Lobby Sharding**: Each lobby on separate Node.js process
- **Regional Servers**: US-East, US-West, EU, Asia
- **Matchmaking Region Preference**: Same region first, then expand

---

### Real-Time Matchmaking

#### Quick Match Flow
```
1. Player clicks "Quick Match"
2. Server finds lobbies:
   - Same region
   - Similar skill (±15%)
   - <8 players
   - Status = waiting
3. If found: Join
4. If not found: Create new lobby, wait for others (max 60s)
5. If timeout: Fill with bots OR start with <8 players
```

#### Skill-Based Matchmaking (SBMM)
- **Skill Rating**: ELO-based system (future)
- **Matchmaking Range**: ±100 ELO initially, widen by +50 every 10s
- **Party Balance**: Premade groups balanced against each other

---

## Cost Optimization Strategies

### Async Racing Costs (MVP)
- **Ghost Storage**: 50KB × 10,000 ghosts = 500MB (~$0.02/month)
- **Database Queries**: Matchmaking queries (~1M/month) = ~$5/month
- **Bandwidth**: Downloads (50KB × 100K races/month) = 5GB = ~$1/month

**Total MVP Cost**: ~$10/month for 10K active users

### Real-Time Racing Costs (Phase 2)
- **WebSocket Servers**: $50–$200/month (1–4 instances)
- **Redis**: $15–$50/month (managed Redis)
- **Bandwidth**: 10KB/s × 8 players × 3 min × 10K races/month = ~150GB = ~$20/month

**Total Phase 2 Cost**: ~$100–$300/month for 10K concurrent users

### Scaling to 100K Users
- **CDN for Ghosts**: Move to S3 + CloudFront = ~$50/month
- **Database Read Replicas**: +$100/month
- **WebSocket Cluster**: Auto-scaling (5–20 instances) = $500–$2000/month
- **Redis Cluster**: $200/month

**Total 100K Users**: ~$1000–$2500/month

---

## Transition Strategy: Async → Real-Time

### Phase 1 (Launch): Async Only
- Ghost racing fully featured
- Leaderboards
- Daily challenges
- No waiting, instant races

### Phase 1.5 (Post-Launch +30 days): Hybrid
- **Async remains default**
- **Real-time beta** (opt-in)
- Collect data on server load, player engagement
- Iterate on netcode

### Phase 2 (+90 days): Real-Time Primary
- **Quick Match** prominent in UI
- Async still available (solo practice, challenges)
- Seasonal tournaments (real-time)
- Ranked mode (real-time ELO)

---

## Failure Modes & Handling

### Async Racing
| Failure | Cause | Mitigation |
|---------|-------|------------|
| No ghosts available | New track/region | Use developer ghosts |
| Ghost download fails | Network issue | Retry 3x, then use cached ghost |
| Submit fails | Server down | Queue locally, retry on reconnect |

### Real-Time Racing
| Failure | Cause | Mitigation |
|---------|-------|------------|
| Disconnection mid-race | Network loss | 10s grace period, auto-rejoin |
| Host migration | Lobby creator leaves | Migrate to next player |
| Desync | Packet loss | Server reconciliation |
| Cheating | Modified client | Anti-cheat validation + ban |

---

## Social Features (Future)

### Friend System
- **Add Friends**: By username or QR code
- **Challenge Friends**: Send ghost challenge invites
- **Friend Ghosts**: Prioritized in matchmaking
- **Spectate**: Watch friends' live races (Phase 3)

### Guilds/Clans
- **Guild Leaderboards**: Aggregate member scores
- **Guild vs Guild**: Async tournaments
- **Guild Chat**: Simple text chat (moderated)

### Replays & Sharing
- **Save Highlights**: Best moments from races
- **Share Ghosts**: Generate shareable links
- **Video Export**: Replay → MP4 (cloud service, premium?)

---

## Testing & Validation

### Async Racing Tests
- [ ] Ghost matchmaking finds appropriate skill levels (95%+ accuracy)
- [ ] Ghost download completes in <3 seconds on 4G
- [ ] Submit race results succeeds 99%+ of time
- [ ] Leaderboard updates within 5 seconds of submission

### Real-Time Tests
- [ ] Lobby creation/join <2 seconds
- [ ] Position updates arrive within 150ms (10Hz + 50ms buffer)
- [ ] Race completes with 8 players, 0 disconnects (stress test)
- [ ] Cheating attempts detected and rejected

---

## Monitoring & Observability

### Key Metrics
- **Async**:
  - Ghost matchmaking time (p50, p95)
  - Ghost download success rate
  - Submission success rate
  - Average ghosts per track in pool

- **Real-Time**:
  - Lobby join success rate
  - Average players per lobby
  - Disconnection rate
  - Position update latency (p50, p95, p99)
  - Server CPU/memory per lobby

### Alerts
- Ghost pool <100 per track → Generate developer ghosts
- Submit failures >5% → Investigate backend
- WebSocket latency >200ms → Scale servers
- Disconnection rate >10% → Check netcode

---

**Summary**: Async ghost racing (MVP) for instant, scalable races. Real-time multiplayer (Phase 2) for competitive live matches. Skill-based matchmaking, low server costs, smooth transition from solo to social.
