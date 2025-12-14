# 🛠 AGENT 10 – Integration Deliverable

**Author**: Technical Integrator  
**Date**: 2025-12-14  
**Status**: Complete Unity ↔ Backend API Contract

---

## Integration Philosophy

### Core Principles
1. **Implementation-Ready**: All endpoints, schemas, and flows fully specified
2. **Type-Safe**: Strong typing on both sides (C# ↔ TypeScript)
3. **Mobile-Optimized**: Minimize payload sizes, batch requests when possible
4. **Error-Resilient**: Graceful degradation, offline queue, retry logic
5. **Versioned**: API versioning for backward compatibility

---

## API Base Configuration

### **Endpoints**
- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging-api.planetracers.com/api`
- **Production**: `https://api.planetracers.com/api`

### **Headers (All Requests)**
```http
Content-Type: application/json
Accept: application/json
X-Client-Version: 1.0.0
X-Platform: ios | android
Authorization: Bearer {token}  // (except auth endpoints)
```

### **Response Format (Standard)**
```json
{
  "success": true | false,
  "data": { ... } | null,
  "error": "Error message" | null,
  "message": "Success message" | null,
  "timestamp": "2025-12-14T12:00:00Z"
}
```

---

## Authentication API

### **1. Guest Account Creation**
**Endpoint**: `POST /api/auth/guest`

**Request**:
```json
{
  "displayName": "Player123",
  "deviceId": "unique-device-identifier"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "player": {
      "id": "player-uuid",
      "displayName": "Player123",
      "isGuest": true,
      "createdAt": "2025-12-14T12:00:00Z"
    },
    "token": "jwt-token-string",
    "expiresAt": "2025-12-15T12:00:00Z"
  }
}
```

**Unity Implementation**:
```csharp
[Serializable]
public class GuestAccountRequest {
    public string displayName;
    public string deviceId;
}

[Serializable]
public class AuthResponse {
    public bool success;
    public AuthData data;
}

[Serializable]
public class AuthData {
    public Player player;
    public string token;
    public string expiresAt;
}

// Usage
var request = new GuestAccountRequest {
    displayName = "Player123",
    deviceId = SystemInfo.deviceUniqueIdentifier
};
var response = await PostAsync<AuthResponse>("/api/auth/guest", request);
PlayerPrefs.SetString("auth_token", response.data.token);
```

---

### **2. Full Account Registration**
**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "email": "player@example.com",
  "password": "securePassword123",
  "displayName": "ProRacer",
  "guestToken": "existing-guest-token" // Optional: Link guest account
}
```

**Response**: Same as guest account creation

---

### **3. Login**
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "player@example.com",
  "password": "securePassword123"
}
```

**Response**: Same as guest account creation

---

## Player API

### **4. Get Player Profile**
**Endpoint**: `GET /api/players/{playerId}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "player-uuid",
    "displayName": "ProRacer",
    "email": "player@example.com",
    "level": 15,
    "xp": 3500,
    "credits": 12500,
    "starCoins": 250,
    "totalRaces": 87,
    "totalWins": 34,
    "rank": "Gold",
    "createdAt": "2025-11-01T10:00:00Z",
    "lastActive": "2025-12-14T11:55:00Z"
  }
}
```

**Unity Model**:
```csharp
[Serializable]
public class Player {
    public string id;
    public string displayName;
    public string email;
    public int level;
    public int xp;
    public int credits;
    public int starCoins;
    public int totalRaces;
    public int totalWins;
    public string rank;
    public string createdAt;
    public string lastActive;
}
```

---

### **5. Update Player Profile**
**Endpoint**: `PATCH /api/players/{playerId}`

**Request**:
```json
{
  "displayName": "NewName" // Optional
}
```

**Response**: Returns updated player profile

---

## Race Submission API

### **6. Submit Race Result**
**Endpoint**: `POST /api/races/submit`

**Request**:
```json
{
  "trackId": "inferna-01",
  "trackVersion": "1.0",
  "raceMode": "ghost_race",
  "vehicleId": "photon-dart",
  "characterId": "zyxx-volt",
  "finishTime": 152340,
  "placement": 1,
  "lapTimes": [51200, 50890, 50250],
  "checkpointTimes": [
    12500, 25100, 37800, 51200,  // Lap 1
    63800, 76500, 89200, 102090, // Lap 2
    114300, 127000, 139800, 152340 // Lap 3
  ],
  "itemsUsed": [
    {"itemId": "astro-rocket", "timestamp": 23000},
    {"itemId": "warp-boost", "timestamp": 89500}
  ],
  "boostEvents": [
    {"type": "drift", "timestamp": 15000, "tier": "purple"},
    {"type": "drift", "timestamp": 68000, "tier": "orange"}
  ],
  "collisions": 3,
  "perfectDrifts": 12,
  "gameVersion": "1.0.0",
  "platformType": "ios",
  "ghostOpponents": ["ghost-uuid-1", "ghost-uuid-2", "ghost-uuid-3"],
  "raceTicket": "server-issued-ticket-from-matchmaking"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "raceId": "race-uuid",
    "rewards": {
      "xp": 125,
      "credits": 75,
      "starCoins": 0
    },
    "newPersonalBest": true,
    "globalRank": 1247,
    "dailyRank": 89,
    "achievements": [
      {
        "id": "first-win",
        "name": "First Victory",
        "reward": 500
      }
    ],
    "levelUp": {
      "newLevel": 16,
      "rewards": {
        "credits": 100,
        "starCoins": 0
      }
    }
  }
}
```

**Unity Model**:
```csharp
[Serializable]
public class RaceSubmission {
    public string trackId;
    public string trackVersion;
    public string raceMode;
    public string vehicleId;
    public string characterId;
    public int finishTime; // Milliseconds
    public int placement;
    public int[] lapTimes;
    public int[] checkpointTimes;
    public ItemUsage[] itemsUsed;
    public BoostEvent[] boostEvents;
    public int collisions;
    public int perfectDrifts;
    public string gameVersion;
    public string platformType;
    public string[] ghostOpponents;
    public string raceTicket;
}

[Serializable]
public class ItemUsage {
    public string itemId;
    public int timestamp;
}

[Serializable]
public class BoostEvent {
    public string type; // "drift", "slipstream", "item"
    public int timestamp;
    public string tier; // "blue", "orange", "purple"
}

[Serializable]
public class RaceResultResponse {
    public bool success;
    public RaceResultData data;
}

[Serializable]
public class RaceResultData {
    public string raceId;
    public Rewards rewards;
    public bool newPersonalBest;
    public int globalRank;
    public int dailyRank;
    public Achievement[] achievements;
    public LevelUp levelUp;
}
```

---

## Matchmaking & Ghost API

### **7. Request Matchmaking**
**Endpoint**: `POST /api/matchmaking`

**Request**:
```json
{
  "trackId": "inferna-01",
  "playerSkillRating": 85.5,
  "ghostCount": 5
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "raceTicket": "ticket-uuid-with-hmac-signature",
    "ghosts": [
      {
        "ghostId": "ghost-uuid-1",
        "playerId": "player-uuid",
        "displayName": "FastRacer99",
        "characterId": "vela-nova",
        "vehicleId": "void-ripper",
        "finishTime": 153200,
        "downloadUrl": "https://cdn.planetracers.com/ghosts/ghost-uuid-1.json"
      },
      // ... 4 more ghosts
    ]
  }
}
```

**Unity Model**:
```csharp
[Serializable]
public class MatchmakingRequest {
    public string trackId;
    public float playerSkillRating;
    public int ghostCount = 5;
}

[Serializable]
public class MatchmakingResponse {
    public bool success;
    public MatchmakingData data;
}

[Serializable]
public class MatchmakingData {
    public string raceTicket;
    public GhostMetadata[] ghosts;
}

[Serializable]
public class GhostMetadata {
    public string ghostId;
    public string playerId;
    public string displayName;
    public string characterId;
    public string vehicleId;
    public int finishTime;
    public string downloadUrl;
}
```

---

### **8. Download Ghost Replay**
**Endpoint**: `GET /api/ghosts/{ghostId}`

**Response**:
```json
{
  "success": true,
  "data": {
    "ghostId": "ghost-uuid-1",
    "trackId": "inferna-01",
    "finishTime": 153200,
    "sampleRate": 100,
    "replayData": {
      "positions": [
        [0, 0, 0],
        [1.2, 0.1, 0.3],
        // ... compressed position data
      ],
      "rotations": [
        [0, 0, 0, 1],
        [0.01, 0.02, 0, 0.99],
        // ... compressed rotation data
      ],
      "timestamps": [0, 100, 200, 300, ...],
      "actions": [
        {"t": 1200, "type": "drift_start"},
        {"t": 2500, "type": "item_use", "itemId": "rocket"}
      ]
    }
  }
}
```

**Unity Model**:
```csharp
[Serializable]
public class GhostReplay {
    public string ghostId;
    public string trackId;
    public int finishTime;
    public int sampleRate;
    public ReplayData replayData;
}

[Serializable]
public class ReplayData {
    public float[][] positions;  // [x, y, z][]
    public float[][] rotations;  // [x, y, z, w][]
    public int[] timestamps;
    public ReplayAction[] actions;
}

[Serializable]
public class ReplayAction {
    public int t; // timestamp
    public string type;
    public string itemId;
}
```

---

### **9. Upload Ghost Replay**
**Endpoint**: `POST /api/ghosts/upload`

**Request**:
```json
{
  "raceId": "race-uuid-from-submission",
  "replayData": {
    // Same format as download response
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "ghostId": "new-ghost-uuid",
    "uploadedAt": "2025-12-14T12:00:00Z"
  }
}
```

---

## Leaderboard API

### **10. Get Global Leaderboard**
**Endpoint**: `GET /api/leaderboard?trackId={trackId}&limit=100&offset=0`

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "rank": 1,
        "playerId": "player-uuid",
        "displayName": "SpeedKing",
        "characterId": "zyxx-volt",
        "vehicleId": "photon-dart",
        "finishTime": 149800,
        "ghostId": "ghost-uuid"
      },
      // ... 99 more entries
    ],
    "total": 15847,
    "playerRank": {
      "rank": 1247,
      "finishTime": 152340
    }
  }
}
```

**Unity Model**:
```csharp
[Serializable]
public class LeaderboardResponse {
    public bool success;
    public LeaderboardData data;
}

[Serializable]
public class LeaderboardData {
    public LeaderboardEntry[] items;
    public int total;
    public PlayerRank playerRank;
}

[Serializable]
public class LeaderboardEntry {
    public int rank;
    public string playerId;
    public string displayName;
    public string characterId;
    public string vehicleId;
    public int finishTime;
    public string ghostId;
}
```

---

## Progression API

### **11. Get Unlocks**
**Endpoint**: `GET /api/players/{playerId}/unlocks`

**Response**:
```json
{
  "success": true,
  "data": {
    "characters": ["zyxx-volt", "gorblax", "vela-nova"],
    "vehicles": ["nebula-glide", "iron-hauler"],
    "tracks": ["inferna-01", "cryon-01"],
    "trackVariants": {
      "inferna-01": ["reverse", "twilight"],
      "cryon-01": ["night"]
    },
    "cosmetics": {
      "characterSkins": ["zyxx-volt-red"],
      "vehicleSkins": ["photon-dart-chrome"]
    }
  }
}
```

---

### **12. Purchase Item**
**Endpoint**: `POST /api/store/purchase`

**Request**:
```json
{
  "itemType": "character" | "vehicle" | "cosmetic",
  "itemId": "raxx-fang",
  "currency": "credits" | "starCoins",
  "amount": 5000
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "purchased": true,
    "newBalance": {
      "credits": 7500,
      "starCoins": 250
    },
    "itemUnlocked": "raxx-fang"
  }
}
```

---

## Challenges & Battle Pass API

### **13. Get Daily Challenges**
**Endpoint**: `GET /api/challenges/daily`

**Response**:
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "daily-1",
        "type": "race_count",
        "description": "Complete 3 races on Inferna Prime",
        "progress": 1,
        "target": 3,
        "reward": {
          "credits": 100
        },
        "expiresAt": "2025-12-15T00:00:00Z"
      }
    ]
  }
}
```

---

### **14. Get Battle Pass Progress**
**Endpoint**: `GET /api/battlepass/progress`

**Response**:
```json
{
  "success": true,
  "data": {
    "season": "Season 1",
    "tier": 12,
    "xp": 11500,
    "xpForNextTier": 1000,
    "hasPremium": true,
    "rewardsAvailable": [
      {
        "tier": 12,
        "itemType": "characterSkin",
        "itemId": "vela-nova-dark-matter",
        "claimed": false
      }
    ]
  }
}
```

---

## Performance Constraints

### **Request Size Limits**
- **Race Submission**: Max 100KB (including checkpoint/item data)
- **Ghost Upload**: Max 500KB (compressed replay data)
- **Profile Update**: Max 10KB

### **Response Time Targets** (95th percentile)
- **Auth**: <500ms
- **Matchmaking**: <1000ms
- **Race Submit**: <800ms
- **Leaderboard**: <600ms
- **Ghost Download**: <2000ms (depends on size)

### **Retry Logic (Unity)**
```csharp
public async Task<T> RequestWithRetry<T>(string endpoint, object body, int maxRetries = 3) {
    for (int i = 0; i < maxRetries; i++) {
        try {
            return await PostAsync<T>(endpoint, body);
        } catch (NetworkException e) {
            if (i == maxRetries - 1) throw;
            await Task.Delay((int)Math.Pow(2, i) * 1000); // Exponential backoff
        }
    }
    throw new Exception("Max retries exceeded");
}
```

---

## Offline Queue (Unity)

### **Queue Race Submissions**
```csharp
public class OfflineQueue {
    private List<RaceSubmission> queuedSubmissions = new List<RaceSubmission>();
    
    public void QueueRaceSubmission(RaceSubmission submission) {
        queuedSubmissions.Add(submission);
        SaveQueue();
    }
    
    public async Task ProcessQueue() {
        if (!NetworkReachability.Available) return;
        
        foreach (var submission in queuedSubmissions.ToList()) {
            try {
                await APIClient.SubmitRace(submission);
                queuedSubmissions.Remove(submission);
                SaveQueue();
            } catch {
                break; // Stop processing on failure
            }
        }
    }
}
```

---

## Error Handling

### **HTTP Status Codes**
- **200**: Success
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (banned, insufficient permissions)
- **404**: Not Found
- **429**: Rate Limited
- **500**: Server Error

### **Error Response Format**
```json
{
  "success": false,
  "error": "Invalid race ticket",
  "code": "INVALID_TICKET",
  "timestamp": "2025-12-14T12:00:00Z"
}
```

### **Unity Error Handling**
```csharp
try {
    var result = await SubmitRace(raceData);
} catch (APIException e) {
    switch (e.Code) {
        case "INVALID_TICKET":
            // Re-request matchmaking
            break;
        case "RATE_LIMITED":
            // Show cooldown message
            break;
        default:
            // Generic error message
            break;
    }
}
```

---

## API Versioning

### **Version Header**
```http
X-API-Version: 1.0
```

### **Deprecation Policy**
- New versions announced 30 days in advance
- Old versions supported for 90 days post-deprecation
- Breaking changes only on major versions

---

## Data Schemas (TypeScript)

### **Backend Types** (for reference)
```typescript
// src/types/api.ts
export interface RaceSubmissionDTO {
  trackId: string;
  trackVersion: string;
  raceMode: 'ghost_race' | 'time_trial' | 'multiplayer';
  vehicleId: string;
  characterId: string;
  finishTime: number;
  placement: number;
  lapTimes: number[];
  checkpointTimes: number[];
  itemsUsed: ItemUsage[];
  boostEvents: BoostEvent[];
  collisions: number;
  perfectDrifts: number;
  gameVersion: string;
  platformType: 'ios' | 'android';
  ghostOpponents: string[];
  raceTicket: string;
}

export interface GhostReplayDTO {
  ghostId: string;
  trackId: string;
  finishTime: number;
  sampleRate: number;
  replayData: {
    positions: number[][];
    rotations: number[][];
    timestamps: number[];
    actions: ReplayAction[];
  };
}
```

---

## Testing Strategy

### **Unit Tests (Backend)**
- [ ] All endpoints return correct status codes
- [ ] Input validation rejects invalid data
- [ ] Authorization checks work correctly
- [ ] Database queries are optimized

### **Integration Tests (Unity ↔ Backend)**
- [ ] Guest account creation → race submission flow
- [ ] Matchmaking → ghost download → race complete
- [ ] Offline queue → reconnect → process queue
- [ ] Token expiry → refresh → continue

### **Load Tests**
- [ ] 1000 concurrent matchmaking requests
- [ ] 10000 race submissions per minute
- [ ] 50000 leaderboard queries per minute

---

**Summary**: Complete Unity ↔ Backend integration contract with all endpoints, request/response schemas, error handling, and performance constraints. Ready for implementation on both sides.
