<!-- Use MASTER_CONTEXT.md as shared knowledge -->

🛡️ AGENT 08 – Anti‑Cheat & Integrity
AGENT_08_ANTICHEAT.md

You are Agent 08 – Anti‑Cheat & Competitive Integrity Owner.

## Goal (MVP)
Ship **async ghost racing** and **leaderboards** with an integrity layer that:
- blocks obvious cheating cheaply,
- keeps false positives low,
- provides escalation paths (flag, shadow-ban buckets, review),
- supports future real-time multiplayer.

This is NOT about kernel-level anti-cheat. It is about **server validation**, **data sanity**, and **economy/leaderboard protection**.

---

# 1) Threat Model (what we must defend against)
## 1.1 Client-side cheats (most common)
- Speed hacks (time scale manipulation)
- Tampered physics values (accel/top speed/turn rate)
- Teleporting / checkpoint skipping
- Infinite boost / item spam
- Invulnerability / no-stun
- Memory editing of currency/rewards payloads
- Ghost replay forging (uploading synthetic “perfect” runs)

## 1.2 Network/API abuse
- Replay attacks (resubmitting the same run for rewards)
- Botting (mass account creation)
- Endpoint spam (ghost upload/leaderboard reads)
- Forged identities (spoofed guest IDs)

## 1.3 Soft exploits (design/system level)
- Farming low-skill brackets with smurfs
- “Meta abuse” if passives/vehicles stack unexpectedly
- Track shortcut abuse that breaks intended min time

---

# 2) Security Principles (guardrails)
1. **Server is the source of truth for rewards**  
   Client submits *claims* (time/place + evidence). Server decides rewards.
2. **Version everything**  
   Track version, physics/balance version, client build version.
3. **Fail soft, not hard (MVP)**  
   If suspicious: flag and isolate rather than ban immediately.
4. **Cheaters should not know they’re detected**  
   Shadow-ban buckets for matchmaking + leaderboards.
5. **Keep costs low**  
   Async validation should be O(1) per race submission (cheap heuristics).

---

# 3) Data we MUST collect (minimal but sufficient)
## 3.1 RaceResult submission (summary)
Required fields:
- playerId
- trackId
- trackVersion
- gameplayVersion (hash of physics/balance config)
- vehicleId + vehicleVersion
- characterId + characterVersion
- startTimeClient (optional), endTimeClient (optional)
- finishTimeMs (authoritative candidate)
- placement (if racing against ghosts)
- checkpoints: array of (checkpointId, timestampMsSinceStart)
- itemEvents: array of (itemId, timestamp, hitType?)  (optional MVP)
- boostEvents: array of (timestamp, durationMs) (optional MVP)
- deviceInfo: platform, model, osVersion (optional)
- runNonce (unique) + runSignature (see section 6)

## 3.2 Ghost upload metadata (meta)
- ghostId
- raceResultId
- sampleRate
- durationMs
- checksum (sha256)
- blobSizeBytes

---

# 4) Validation Heuristics (MVP must implement)
These are “cheap checks” that catch most obvious cheats.

## 4.1 Track progress validity
- Checkpoints must be in valid order
- No missing required checkpoints
- No duplicate checkpoint spam (rate-limit per segment)
- Segment time bounds:
  - each segment time must be >= segmentMinTime * tolerance
  - tolerance may be generous early (e.g., 0.85) then tighten with data

## 4.2 Time plausibility
- finishTimeMs must be > absoluteMinTimeMs(trackId, trackVersion)
- finishTimeMs must fall within a reasonable percentile band for bracket
- Compare to player’s recent PB improvements:
  - improvements > X% in a single run raise suspicion (e.g., > 15–20%)

## 4.3 Version/Config consistency
- gameplayVersion must match server-known versions
- vehicle/character IDs must exist and be allowed
- reject results from unsupported builds (or accept but exclude from LB)

## 4.4 Ghost meta plausibility
- durationMs ~ finishTimeMs (within small epsilon)
- sampleRate in allowed set
- blobSize within bounds
- checksum must match blob after upload
- (“forged ghost”) detect impossible acceleration patterns if we store inputs or speed samples (phase 2)

## 4.5 Abuse prevention
- runNonce uniqueness: prevent reward duplication
- rate limits:
  - submissions per minute per player
  - ghost uploads per hour per player
  - new guest accounts per IP range (backend-level)

---

# 5) Integrity Outcomes (what we do when suspicious)
Define 4 states:

1. **Clean**  
   Eligible for rewards + leaderboards.

2. **Suspect** (soft flag)
   - still gets base rewards (or reduced rewards)
   - not eligible for global leaderboards (only local/personal)
   - ghost not shared for matchmaking until cleared

3. **Isolated (Shadow bucket)**
   - matchmaking uses only other isolated ghosts
   - excluded from global leaderboards
   - can still play (reduces churn and detection feedback)

4. **Banned** (rare in MVP)
   - only on repeated high-confidence signals
   - device or account level; keep appeals path simple

---

# 6) Request Signing / Integrity Tokens (practical MVP)
We want to make trivial “curl” cheating harder.

## 6.1 Approach (MVP-friendly)
- On auth, server issues a **session token** (JWT or opaque).
- On matchmake, server provides a **raceTicket**:
  - raceId
  - seed (for item box RNG, if used)
  - issuedAt + expiresAt
  - signature (HMAC server secret)

Client must include raceTicket on submit.

## 6.2 Submit requirements
- Race submissions must include:
  - raceTicket
  - runNonce (uuid)
  - raceSummary
- Server verifies:
  - ticket signature + expiry
  - raceId not already submitted by player
  - nonce not reused

This blocks:
- “submit fake time without ever matchmaking”
- replay-spam for rewards

---

# 7) Leaderboard Integrity Rules
- Only “Clean” runs enter global leaderboards.
- “Suspect” runs:
  - may show in “personal best” UX
  - **never** appear globally
- Runs must include gameplayVersion and trackVersion; LBs are per-version (or server migrates).
- Add a “verified” marker if the run has a ghost and passes checksum validation.

---

# 8) Ghost Sharing Rules (matchmaking hygiene)
Even for clean runs:
- Do not immediately use a new ghost in matchmaking until:
  - checksum validated
  - basic heuristics pass
- Keep a pool policy:
  - recent ghosts preferred
  - distribution across skill brackets
  - exclude extreme outliers pending review

---

# 9) Telemetry & Dashboards (anti-cheat operationalization)
Track:
- % of runs flagged suspect by rule
- false-positive probes:
  - number of “suspect” players who churn immediately
  - manual sample verification rate (if any)
- top 100 leaderboard run validation stats
- per-track min-time estimates (update as data grows)
- spikes by build version / device model

---

# 10) Incident Playbook (when cheating spikes)
1) Confirm spike source (trackId/build version/region).
2) Tighten thresholds:
   - reduce tolerance, increase checkpoint strictness
3) Temporarily:
   - disable leaderboard entries for affected build
   - stop sharing ghosts from affected cohort
4) Patch:
   - require updated gameplayVersion
   - add new heuristic
5) Postmortem: document exploit + remediation.

---

# 11) Implementation Task List (handoff)
## Backend (Next.js)
- Add raceTicket issuance at matchmaking
- Add runNonce uniqueness storage
- Implement validation pipeline with rule outputs
- Store flags + integrity state per submission
- Expose admin endpoints (optional) to review/override flags
- Update leaderboard query to filter only “Clean”

## Unity Client
- Include raceTicket and runNonce in submissions
- Record checkpoint timestamps and attach to result
- Provide stable gameplayVersion hash and include in every request
- Handle “suspect/isolate” responses gracefully (no scary messaging)

## QA
- Test common cheat simulation cases:
  - altered time
  - missing checkpoints
  - replay submission
  - wrong version hash
- Ensure legit edge cases don’t false-positive:
  - lag spikes
  - device performance drops
  - pause/resume behavior (if allowed)

---

# 12) Phase 2 (post-MVP improvements)
- Better ghost validation using sampled speed/accel outlier detection
- Physics determinism checks (if feasible)
- Device fingerprinting (privacy-aware)
- Trust score per account
- Limited manual review tooling for top leaderboard positions
- Real-time multiplayer anti-cheat planning (packet sanity, authoritative server options)
