# 🚀 AGENT 04 – Vehicles Deliverable

**Author**: Vehicle Systems Designer  
**Date**: 2025-12-14  
**Status**: Complete Vehicle Specifications & Handling Profiles

---

## Vehicle Design Philosophy

### Core Principles
1. **Feel Over Stats**: Each vehicle has distinct personality through handling
2. **No Pay-to-Win**: All vehicles viable; choice is preference, not power
3. **Character Synergy**: Vehicles pair naturally with certain characters (bonus system)
4. **Mobile-Friendly**: Handling differences noticeable even with tilt controls

---

## The Five Vehicles

### **1. Photon Dart** ⚡
**Archetype**: Glass Cannon  
**Tagline**: "Lightning fast, paper thin"

#### Stats (Normalized to 100-point scale)
- **Top Speed**: 95
- **Acceleration**: 90
- **Handling**: 70
- **Weight**: 40
- **Drift Tightness**: 85

#### Handling Profile
- **Best For**: Skilled players, clean racing lines, time trials
- **Strengths**: 
  - Fastest top speed in game
  - Quick acceleration out of corners
  - Tight drift radius (excellent for technical tracks)
- **Weaknesses**:
  - Knocked around easily by heavier ships
  - Less forgiving on collisions (spins out more)
  - Poor recovery from hits

#### Collision Behavior
- **Bump Response**: High knockback (pushed 8 units on medium collision)
- **Weight Class**: Light (loses all weight-based collisions)
- **Recovery Time**: 1.2s to regain full control after bump

#### Best Synergies
- **Zyxx Volt** (+5% speed bonus) = "Speed Demon"
- **Vela Nova** (+10% drift boost duration) = "Precision Racer"
- **Lil' Comet** (+15% acceleration) = "Quick Start"

---

### **2. Iron Hauler** 🏗️
**Archetype**: Tank  
**Tagline**: "Move aside or get moved"

#### Stats
- **Top Speed**: 75
- **Acceleration**: 60
- **Handling**: 60
- **Weight**: 95
- **Drift Tightness**: 50

#### Handling Profile
- **Best For**: Beginners, aggressive players, crowded races
- **Strengths**:
  - Dominates collisions (pushes others aside)
  - Stable and predictable
  - Immune to light bumps (< 5-unit impacts ignored)
- **Weaknesses**:
  - Slowest top speed
  - Wide drift arcs (hard to navigate tight corners)
  - Sluggish acceleration

#### Collision Behavior
- **Bump Response**: Minimal knockback (pushed 2 units on medium collision)
- **Weight Class**: Heavy (wins 90% of weight-based collisions)
- **Recovery Time**: 0.5s (barely affected by hits)

#### Best Synergies
- **Gorblax the Wide** (+10% weight/stability) = "Unstoppable Force"
- **Raxx Fang** (+5% aggression damage) = "Bulldozer"
- **Captain Klynt** (+5% durability) = "Fortress"

---

### **3. Nebula Glide** 🌌
**Archetype**: Balanced All-Rounder  
**Tagline**: "Smooth as starlight"

#### Stats
- **Top Speed**: 85
- **Acceleration**: 80
- **Handling**: 85
- **Weight**: 70
- **Drift Tightness**: 75

#### Handling Profile
- **Best For**: Everyone (recommended starter ship)
- **Strengths**:
  - No major weaknesses
  - Easiest to control
  - Good drift-to-boost ratio
- **Weaknesses**:
  - No standout strengths
  - Master-level players prefer specialists

#### Collision Behavior
- **Bump Response**: Moderate knockback (pushed 5 units on medium collision)
- **Weight Class**: Medium (50/50 collision outcomes vs same class)
- **Recovery Time**: 0.8s

#### Best Synergies
- **Any Character** (universal compatibility)
- **Mira Flux** (+5% all-around boost) = "Perfect Balance"
- **B.O.B-9000** (+10% consistency) = "Reliable Runner"

---

### **4. Void Ripper** 🌑
**Archetype**: Technical Drifter  
**Tagline**: "Master the void, master the track"

#### Stats
- **Top Speed**: 80
- **Acceleration**: 75
- **Handling**: 95
- **Weight**: 55
- **Drift Tightness**: 90

#### Handling Profile
- **Best For**: Drift enthusiasts, technical tracks, cornering specialists
- **Strengths**:
  - Best handling in game
  - Tightest drift radius
  - Fastest drift boost charge (−0.2s per tier)
- **Weaknesses**:
  - Moderate top speed
  - Light weight (vulnerable to collisions)
  - Requires skill to maximize

#### Collision Behavior
- **Bump Response**: High knockback (pushed 7 units on medium collision)
- **Weight Class**: Light-Medium (loses to 60% of ships)
- **Recovery Time**: 1.0s

#### Best Synergies
- **Snikk** (+15% drift boost) = "Corner King"
- **Vela Nova** (+10% handling) = "Drift Master"
- **Zyxx Volt** (+5% speed on drift exit) = "Technical Speedster"

---

### **5. Flux Shell** 🐚
**Archetype**: Adaptive Specialist  
**Tagline**: "Changes with the race"

#### Stats
- **Top Speed**: 82
- **Acceleration**: 85
- **Handling**: 78
- **Weight**: 65
- **Drift Tightness**: 70

#### Handling Profile (Adaptive Trait)
- **Best For**: Strategic players, varied track conditions
- **Strengths**:
  - **Adaptive Aero**: Stats shift based on position
    - **Leading** (1st–2nd): +10% top speed, −10% acceleration
    - **Trailing** (4th–5th): +10% acceleration, −10% top speed
    - **Mid-Pack** (3rd): Balanced (no bonuses)
  - Versatile handling
  - Good weapon synergy (items feel more effective)
- **Weaknesses**:
  - No single stat dominance
  - Adaptive trait requires awareness
  - Slightly slower than specialists in their domain

#### Collision Behavior
- **Bump Response**: Moderate knockback (pushed 5 units)
- **Weight Class**: Medium (standard collision outcomes)
- **Recovery Time**: 0.7s

#### Best Synergies
- **Queen Thal'Ryn** (+10% adaptive bonus) = "Strategic Racer"
- **Mira Flux** (+5% position awareness) = "Tactical Master"
- **B.O.B-9000** (+8% computational efficiency) = "Smart Racer"

---

## Handling Deep Dive

### Steering Response Curves

#### Photon Dart
- **Input Response**: Linear (1:1 tilt to turn)
- **Turn Speed**: 180°/second
- **Oversteer Risk**: High (snap turns possible)

#### Iron Hauler
- **Input Response**: Dampened (0.8:1 tilt to turn)
- **Turn Speed**: 120°/second
- **Understeer**: Moderate (wide arcs)

#### Nebula Glide
- **Input Response**: Slightly dampened (0.9:1)
- **Turn Speed**: 150°/second
- **Balanced**: Neutral steering

#### Void Ripper
- **Input Response**: Enhanced (1.1:1 tilt to turn)
- **Turn Speed**: 200°/second
- **Oversteer Risk**: Moderate (responsive but controllable)

#### Flux Shell
- **Input Response**: Adaptive (0.85–1.05:1 based on position)
- **Turn Speed**: 145–165°/second (varies)
- **Dynamic**: Changes feel during race

---

## Drift Mechanics by Vehicle

### Drift Boost Charge Rates

| Vehicle | Blue Boost | Orange Boost | Purple Boost |
|---------|------------|--------------|--------------|
| Photon Dart | 0.5s | 1.0s | 2.0s |
| Iron Hauler | 0.7s | 1.3s | 2.5s |
| Nebula Glide | 0.5s | 1.0s | 2.0s |
| Void Ripper | 0.3s | 0.8s | 1.8s |
| Flux Shell | 0.5s | 1.0s | 2.0s |

### Drift Exit Behavior

- **Photon Dart**: Snappy exit, immediate boost kick
- **Iron Hauler**: Gradual exit, slower boost activation
- **Nebula Glide**: Standard exit, predictable timing
- **Void Ripper**: Instant exit, can chain drifts seamlessly
- **Flux Shell**: Moderate exit, position-aware timing

---

## Collision & Weight System

### Weight-Based Collision Outcomes

| Collision | Light (40–55) | Medium (65–70) | Heavy (95) |
|-----------|---------------|----------------|------------|
| **vs Light** | 50/50 | 40/60 (lose) | 10/90 (lose) |
| **vs Medium** | 60/40 (lose) | 50/50 | 30/70 (lose) |
| **vs Heavy** | 90/10 (lose) | 70/30 (lose) | 50/50 |

### Collision Physics
- **Momentum Transfer**: `Δv = (m2 × v2 - m1 × v1) / (m1 + m2)`
- **Angle Deflection**: Lighter ship deflects at sharper angle
- **Spin Chance**: Light ships have 30% chance to spin on T-bone collision

---

## Ship-Character Synergy System

### How Synergies Work
1. **Recommended Pairs**: Each vehicle has 3 optimal character matches
2. **Bonus Type**: Small passive boost (5–15% to relevant stat)
3. **Visual Indicator**: UI shows "Synergy Active" icon
4. **No Penalty**: Non-synergy pairs are 100% viable (just no bonus)

### Complete Synergy Matrix

| Vehicle | Character | Bonus | Effect |
|---------|-----------|-------|--------|
| Photon Dart | Zyxx Volt | +5% Speed | Top speed: 95 → 99.75 |
| Photon Dart | Vela Nova | +10% Drift Duration | Boost lasts 1.0s → 1.1s |
| Photon Dart | Lil' Comet | +15% Accel | Accel: 90 → 103.5 |
| Iron Hauler | Gorblax | +10% Weight | Weight: 95 → 104.5 |
| Iron Hauler | Raxx Fang | +5% Collision | Bump damage to others +5% |
| Iron Hauler | Captain Klynt | +5% Durability | Stun resistance −0.1s |
| Nebula Glide | Mira Flux | +5% All Stats | All stats +5% |
| Nebula Glide | B.O.B-9000 | +10% Consistency | Drift window +0.1s |
| Nebula Glide | Any | Universal | No penalty for any pair |
| Void Ripper | Snikk | +15% Drift Boost | Boost power: +25% → +28.75% |
| Void Ripper | Vela Nova | +10% Handling | Handling: 95 → 104.5 |
| Void Ripper | Zyxx Volt | +5% Exit Speed | Drift exit speed +5% |
| Flux Shell | Queen Thal'Ryn | +10% Adaptive | Adaptive bonuses 10% → 11% |
| Flux Shell | Mira Flux | +5% Awareness | HUD indicators enhanced |
| Flux Shell | B.O.B-9000 | +8% Computation | Item efficiency +8% |

---

## Performance Constraints (Mobile)

### Target Frame Rates
- **Physics Update**: 60 Hz (fixed timestep)
- **Rendering**: 30–60 FPS (dynamic based on device)
- **Input Polling**: 120 Hz (reduce latency)

### Vehicle-Specific Optimizations
- **Collision Meshes**: Low-poly (max 50 tris per vehicle)
- **Drift Particles**: Max 30 particles active
- **Speed Effects**: Scale with performance mode

---

## Avoid Pay-to-Win Mechanics

### What We DON'T Do
- ❌ **No tiered vehicles**: No "better" ships unlocked late
- ❌ **No stat upgrades**: Ships don't get stronger with playtime
- ❌ **No premium-only ships**: All 5 vehicles earnable free
- ❌ **No temporary rentals**: Unlock once, keep forever

### What We DO Instead
- ✅ **Sidegrade unlock progression**: Ships unlock 1 → 2 → 3 → 4 → 5
- ✅ **All equally powerful**: Just different playstyles
- ✅ **Cosmetic upgrades**: Skins, trails, colors (premium/earnable)
- ✅ **Skill expression**: Good player wins with any ship

---

## Unlock Progression (Recommended)

### Free Progression Path
1. **Nebula Glide** (Starter): Available immediately
2. **Iron Hauler** (10 races): Unlock after tutorial
3. **Photon Dart** (50 races): Reward consistency
4. **Void Ripper** (100 races): Reward commitment
5. **Flux Shell** (200 races OR top 30% leaderboard): Prestige unlock

### Premium Path (Optional Future)
- Instant unlock all 5 ships: $4.99
- Individual ship unlock: $1.99 each
- **Note**: Free players can unlock all within 30–60 hours playtime

---

## Testing & Balance Validation

### Pre-Launch Tests
- [ ] Each vehicle wins 18–22% of mixed races (balanced viability)
- [ ] Collision physics consistent across all frame rates
- [ ] Drift timings feel responsive on 30 FPS and 60 FPS
- [ ] Synergy bonuses don't create >10% win rate swing
- [ ] All ships viable on all track types

### Track-Specific Validation
- **Technical Tracks** (Verdantia-9): Void Ripper slight advantage (±2%)
- **Speed Tracks** (Cryon Drift): Photon Dart slight advantage (±2%)
- **Crowded Tracks** (Inferna Prime): Iron Hauler slight advantage (±2%)
- **Balanced Tracks**: All ships within ±1% win rate

---

## Cosmetic Customization (Future)

### Ship Skins
- **Recolors**: Free (unlocked via challenges)
- **Material Swaps**: Premium/earnable (chrome, matte, holographic)
- **Special Editions**: Seasonal events

### Trails & Effects
- **Boost Trails**: Color, particle style, sound
- **Drift Sparks**: Different colors/patterns
- **Engine Sounds**: Audio customization

**All cosmetics have ZERO stat impact.**

---

**Summary**: 5 distinct vehicles with clear personalities, no pay-to-win mechanics, and optional character synergies. Photon Dart (speed), Iron Hauler (tank), Nebula Glide (balanced), Void Ripper (drifter), Flux Shell (adaptive). Skill beats stats every time.
