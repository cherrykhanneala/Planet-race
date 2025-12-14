# 🎮 AGENT 02 – Core Gameplay Deliverable

**Author**: Core Gameplay Designer  
**Date**: 2025-12-14  
**Status**: Race Flow & Mechanics Specification

---

## Race Flow (2–3 Minute Loop)

### Pre-Race (5–10 seconds)
1. **Track Selection** → Character Selection → Vehicle Selection
2. **Matchmaking** → Ghost opponents assigned (3–5 ghosts near player skill)
3. **Loading Screen** → Tips, track preview
4. **Countdown** → 3... 2... 1... GO!

### Race (120–180 seconds)
1. **Lap 1** → Learn track, collect items, establish position
2. **Lap 2** → Execute strategy, use items, overtake
3. **Lap 3** → Final push, defensive play if leading

### Post-Race (10–15 seconds)
1. **Results Screen** → Placement, time, rewards
2. **Rival Callout** → "Beat Gorblax by 1.2s!" or "Zyxx Volt is 0.8s ahead!"
3. **XP/Currency** → Progression rewards
4. **Options** → Rematch, New Track, Quit

---

## Mobile Controls

### Input Method: **Tilt + Touch Hybrid**

#### Auto-Accelerate Mode (Default)
- **Tilt Left/Right**: Steer (sensitivity adjustable in settings)
- **Tap Left Screen**: Brake/Reverse
- **Tap Right Screen**: Use Item
- **Swipe Up**: Activate Boost (when available)

#### Manual Mode (Optional)
- **Right Thumb**: Virtual throttle (hold to accelerate)
- **Tilt**: Steer
- **Tap Left**: Brake
- **Tap Top Right**: Use Item

#### Accessibility
- **Button-Only Mode**: On-screen buttons replace tilt
- **Haptic Feedback**: Collisions, boost, weapon hits
- **Visual Assists**: Racing line (toggleable), arrow indicators

---

## Boost & Drift Mechanics

### **Drift Boost System**

#### How to Drift
1. **Enter Corner** at moderate speed
2. **Hold Brake** while steering into turn
3. **Sparks Appear** after 0.5s (blue → orange → purple)
4. **Release Brake** to exit drift and activate boost

#### Boost Tiers
| Tier | Hold Duration | Speed Bonus | Duration |
|------|---------------|-------------|----------|
| Blue | 0.5–1.0s | +15% | 1.0s |
| Orange | 1.0–2.0s | +25% | 1.5s |
| Purple | 2.0s+ | +40% | 2.0s |

#### Risk/Reward
- **Too Short**: No boost, wasted time
- **Too Long**: Scrub speed, lose position
- **Perfect**: Chain boosts corner-to-corner for massive advantage

### **Item Boost (Warp Boost)**
- Instant +50% speed for 2.5 seconds
- Can stack with drift boost (multiplicative)
- Immunity to small collisions during boost

### **Slipstream Boost**
- Follow closely behind opponent (within 5 units for 2+ seconds)
- Gain +10% speed boost while in slipstream
- Audio cue: Engine pitch increases
- Visual: Speed lines intensify

---

## Recovery from Hits

### Hit Types

#### 1. **Weapon Hit (Stun)**
- **Effect**: 1.0–1.5s stun, lose 30% speed
- **Recovery**: Auto-recover after stun duration
- **Player Input**: Mash accelerate to reduce stun by 0.2s

#### 2. **Collision (Bump)**
- **Effect**: 0.5s slowdown, lose 20% speed
- **Recovery**: Instant, player regains control
- **Physics**: Bounce direction based on collision angle

#### 3. **Environmental Hazard (Crash)**
- **Effect**: 2.0s respawn time, full speed loss
- **Recovery**: Respawn at last checkpoint
- **Examples**: Lava pits, ice crevasses, jungle cliffs

#### 4. **Gravity Snare (Trap)**
- **Effect**: 2.5s slow (50% speed reduction)
- **Recovery**: Can still steer, drift, and use items
- **Counter**: Warp Boost or Ion Shield

### Comeback Mechanics
- **Rubber-banding**: Ghosts slightly slow down if player falls far behind (subtle, <5%)
- **Better Items**: Players in 4th–5th place get offensive items more often
- **Checkpoint Shortcuts**: Risk/reward alternate paths available mid-race

---

## Skill vs Chaos Balance

### Skill Elements (60% Impact)
1. **Racing Line**: Optimal path through corners
2. **Drift Timing**: Perfect boost chains
3. **Item Management**: Save shield for key moments, use rockets at right time
4. **Track Knowledge**: Shortcuts, hazard timing, best boost zones

### Chaos Elements (40% Impact)
1. **Item RNG**: Position-based but still variable
2. **Opponent Weapons**: Can't predict when you'll be hit
3. **Environmental Timing**: Hazards on cycles (lava bursts, ice slides)
4. **Ghost Behavior**: Ghosts don't perfectly repeat every time (small variance)

### Balance Philosophy
- **First-timers can win** → Items and chaos give chance
- **Skilled players win consistently** → 70%+ win rate for top 10% players
- **No unbeatable strategies** → Every tactic has counterplay

---

## Item System Integration

### Item Box Placement
- **Track Design**: 2–3 item boxes per lap
- **Positioning**: After challenging sections (rewards good execution)
- **Visibility**: Clear markers, audio cue when approaching

### Item Usage Strategy
- **Offensive Items** (Rockets, Plasma Marble): Use immediately or save for tight groups
- **Defensive Items** (Shield, Phase Mine): Hold until threatened
- **Utility Items** (Warp Boost): Save for straightaways or recovery

### Item Feedback
- **Pickup**: Visual flash, HUD icon, audio "ding"
- **Activation**: Full-screen effect, haptic feedback
- **Hit Confirmation**: Hit marker, audio cue, screen shake

---

## Mobile Simplicity Rules

### 1. **No Complex Combos**
- Single-tap actions only
- No hold + swipe + release sequences

### 2. **Generous Timing Windows**
- Drift boost: 0.5s window to activate
- Item pickup: Auto-collect within 3 units
- Checkpoint triggers: Forgiving hitboxes

### 3. **Clear Visual Feedback**
- **Boost Ready**: Glowing meter, HUD icon
- **Drift State**: Colored sparks (blue/orange/purple)
- **Item Ready**: Pulsing icon, screen edge highlight

### 4. **Auto-Recovery**
- **Auto-respawn**: No button mashing needed
- **Auto-steer assist** (optional): Gentle correction away from walls
- **Auto-item aim** (optional): Aim-assist for forward-firing weapons

---

## Fun Maximization

### Moment-to-Moment Fun
- **Every 5 seconds**: Decision (drift now? use item? take shortcut?)
- **Every 15 seconds**: Payoff (boost lands, weapon hits, overtake)
- **Every 30 seconds**: Tension (lap complete, position change)

### "Feels Good" Checklist
- ✅ Drifting makes satisfying sparks and sounds
- ✅ Boost feels **fast** (motion blur, wind SFX)
- ✅ Weapons have impact (screen shake, explosions)
- ✅ Overtaking triggers audio callout
- ✅ Near-miss dodges reward player with audio cue

### Avoid Frustration
- ❌ No instant-death hazards (always 2s respawn max)
- ❌ No permanent item loss on hit
- ❌ No forced waiting (auto-accelerate default)
- ❌ No invisible walls (clear track boundaries)

---

## Difficulty Curve (Ghost Matchmaking)

### New Player (0–10 races)
- **Opponents**: Easy ghosts (90–95th percentile finish times)
- **Item Distribution**: Generous offensive items
- **Rubber-banding**: Active (+5% slowdown for leading ghosts)

### Intermediate (10–50 races)
- **Opponents**: Mixed skill (70–90th percentile)
- **Item Distribution**: Balanced
- **Rubber-banding**: Subtle (+2% slowdown)

### Advanced (50+ races)
- **Opponents**: Skilled ghosts (30–70th percentile)
- **Item Distribution**: Position-based only
- **Rubber-banding**: Minimal (0–1%)

### Expert (Top 10% leaderboard)
- **Opponents**: Elite ghosts (top 30th percentile)
- **Item Distribution**: Pure position-based
- **Rubber-banding**: None

---

## Platform-Specific Tuning

### iOS
- **Haptics**: Full Taptic Engine support
- **Screen Size**: Support iPhone SE to iPhone Pro Max
- **Performance**: Target 60fps on iPhone X+

### Android
- **Haptics**: Standard vibration patterns
- **Screen Size**: 4.5" to 7" tablets
- **Performance**: Target 30fps minimum, 60fps on flagship

### Input Latency
- **Target**: <50ms touch to action
- **Optimization**: Predict input 1 frame ahead

---

## Accessibility Features

### Visual
- **Colorblind Modes**: Item colors adjusted
- **High Contrast**: UI elements
- **Motion Sickness**: Reduced camera shake option

### Audio
- **Subtitles**: For audio cues
- **Visual Item Indicators**: On-screen arrows

### Input
- **Steering Sensitivity**: 0.5x to 2.0x
- **Steering Assistance**: Low/Medium/High
- **Auto-Accelerate**: On by default

---

**Summary**: Mobile arcade racing with generous controls, satisfying drift-boost system, and balanced skill/chaos. 2–3 minute races, instant gratification, accessible to all skill levels.
