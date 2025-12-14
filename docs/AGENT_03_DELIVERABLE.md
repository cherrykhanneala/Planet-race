# 🔫 AGENT 03 – Weapons & Balance Deliverable

**Author**: Weapons and Balance Designer  
**Date**: 2025-12-14  
**Status**: Complete Weapon Specifications & Balance Tables

---

## Weapon Design Philosophy

### Core Principles
1. **Position-Based Fairness**: Leaders get defensive tools, followers get offensive weapons
2. **Clear Counterplay**: Every weapon has a counter (dodge, shield, or positioning)
3. **Visual Telegraph**: 0.5–1.0s warning before impact
4. **Chaos with Skill**: Items create exciting moments but don't nullify skill advantage

---

## Complete Weapon Roster (10 Items)

### **1. Astro Rocket** 🚀
**Type**: Offensive Projectile  
**Effect**: Fires forward-tracking rocket that stuns target for 1.2s  
**Range**: 50 units, tracking for 3 seconds  
**Cooldown**: N/A (single use)  
**Counter**: Shield, sharp turn to break tracking, slipstream behind obstacle  
**Audio/Visual**: Red targeting laser, explosion on impact, smoke trail  

**Balance Notes**:
- Tracking strength: 70% (can be dodged with skill)
- Damage falloff: None (consistent stun)
- Multi-target: No (locks onto nearest racer ahead)

---

### **2. Plasma Marble** 💎
**Type**: Offensive Trap  
**Effect**: Drops 3 marbles behind that spin out anyone who hits them (1.0s stun)  
**Duration**: 15 seconds or until triggered  
**Cooldown**: N/A (single use)  
**Counter**: Memorize placement, steer around, shield absorbs  
**Audio/Visual**: Purple glowing orbs, electric crackle, warning shimmer  

**Balance Notes**:
- Spread pattern: Triangle formation (3 units apart)
- Trigger radius: 2 units
- Can place max 3 sets per race (server validation)

---

### **3. Gravity Snare** 🌀
**Type**: Offensive Debuff  
**Effect**: Launches forward, creates gravity well that slows all racers in 10-unit radius by 50% for 2.5s  
**Range**: 40 units forward  
**Cooldown**: N/A (single use)  
**Counter**: Warp Boost to escape, shield prevents slowdown, avoid the zone  
**Audio/Visual**: Purple swirling vortex, gravitational distortion effect, warning pulse  

**Balance Notes**:
- Affects user if they enter zone
- Stays in world position (doesn't move)
- Warning: 0.5s pulse before activation

---

### **4. Warp Boost** ⚡
**Type**: Utility Speed  
**Effect**: Instant +50% speed boost for 2.5s, immunity to small collisions  
**Cooldown**: N/A (single use)  
**Counter**: None (pure advantage)  
**Audio/Visual**: Blue energy trail, whoosh sound, screen speed lines  

**Balance Notes**:
- Stacks multiplicatively with drift boost (1.5x × 1.4x = 2.1x total)
- Immunity: Prevents Plasma Marble, small bumps; does NOT prevent rockets or environmental hazards
- Given to mid-pack racers (3rd–5th place)

---

### **5. Ion Shield** 🛡️
**Type**: Defensive Barrier  
**Effect**: Creates protective shield for 5.0s that blocks one weapon hit or 3 environmental hazards  
**Duration**: 5.0s or until depleted  
**Cooldown**: N/A (single use)  
**Counter**: Overwhelm with multiple attacks, wait it out  
**Audio/Visual**: Shimmering blue dome, energy hum, crackle when hit  

**Balance Notes**:
- Priority absorption: Rockets > Gravity Snare > Plasma Marble > Environmental
- Does not prevent collision bumps (physics-based)
- Shield HP: 1 weapon hit OR 3 minor hazards

---

### **6. Comet Drop** ☄️
**Type**: Offensive AOE  
**Effect**: Calls down 5 small meteors in 20-unit zone ahead over 3 seconds  
**Damage**: Each meteor = 0.8s stun if direct hit  
**Cooldown**: N/A (single use)  
**Counter**: Weave between impacts, shield, change lanes  
**Audio/Visual**: Flaming rocks from sky, impact craters, rumble effect  

**Balance Notes**:
- Meteor spacing: Random within zone (skill-based dodging)
- Telegraph: 0.7s warning (shadow indicators on ground)
- Can hit user if they slow down into zone

---

### **7. Phase Mine** 💣
**Type**: Offensive Trap (Invisible)  
**Effect**: Places invisible mine that detonates when opponent passes, causing 1.5s stun  
**Duration**: 20 seconds or until triggered  
**Cooldown**: N/A (single use)  
**Counter**: Shield, memorization, use ghost paths to detect  
**Audio/Visual**: Nearly invisible (slight shimmer), loud beep 0.3s before detonation  

**Balance Notes**:
- Trigger radius: 3 units
- Warning beep: Gives skilled players chance to dodge
- Max 2 active per player on track
- Shimmer visible if racing line crosses it

---

### **8. Chaos Ray** 🌈
**Type**: Offensive Beam  
**Effect**: Fires 180° cone behind user, anyone hit gets reversed controls for 3.0s  
**Range**: 15 units behind  
**Cooldown**: N/A (single use)  
**Counter**: Stay far back, shield, use during straightaway (easier to handle)  
**Audio/Visual**: Rainbow wave blast, visual distortion on screen, confused audio cue  

**Balance Notes**:
- Cone width: 180° (full rear coverage)
- Affects all racers in cone (multi-target)
- Control reversal: Left = Right, Right = Left (but not Forward = Backward)

---

### **9. Meteor Swarm** 🌠
**Type**: Offensive Multi-Projectile  
**Effect**: Fires 8 small meteors forward in spread pattern, each causing 0.5s stun  
**Range**: 30 units  
**Cooldown**: N/A (single use)  
**Counter**: Shield blocks all, dodge between gaps, only hit by 2–3 max  
**Audio/Visual**: Rapid fire sound, flame trails, screen shake on each hit  

**Balance Notes**:
- Spread angle: 45° cone
- Hit limit: Maximum 3 meteors can hit same target (0.5s stun × 3 = 1.5s total)
- Best at medium-close range (15–20 units)

---

### **10. Slipstream Orb** 🔵
**Type**: Utility Speed  
**Effect**: Creates slipstream zone behind user for 8.0s, allies gain +20% speed, enemies lose -10% speed  
**Duration**: 8.0s  
**Cooldown**: N/A (single use)  
**Counter**: Avoid following user, pass them before activation  
**Audio/Visual**: Glowing blue trail, wind tunnel effect, speed boost indicator  

**Balance Notes**:
- Zone size: 10 units behind user, 5 units wide
- Moving zone (follows user's position)
- In ghost racing: Only helps user, ghosts unaffected (future: affects friendly ghosts)

---

## Item Distribution by Race Position

### Position-Based Probability Table

| Item | 1st Place | 2nd Place | 3rd Place | 4th Place | 5th Place |
|------|-----------|-----------|-----------|-----------|-----------|
| **Astro Rocket** | 0% | 5% | 15% | 25% | 30% |
| **Plasma Marble** | 10% | 15% | 20% | 20% | 15% |
| **Gravity Snare** | 0% | 5% | 10% | 15% | 20% |
| **Warp Boost** | 15% | 20% | 25% | 20% | 10% |
| **Ion Shield** | 35% | 25% | 15% | 5% | 0% |
| **Comet Drop** | 0% | 5% | 10% | 15% | 20% |
| **Phase Mine** | 15% | 10% | 5% | 0% | 0% |
| **Chaos Ray** | 0% | 0% | 0% | 0% | 5% |
| **Meteor Swarm** | 0% | 10% | 0% | 0% | 0% |
| **Slipstream Orb** | 25% | 5% | 0% | 0% | 0% |

### Design Intent
- **1st Place**: Defensive (Ion Shield, Slipstream Orb, Phase Mine, Plasma Marble)
- **2nd-3rd**: Balanced (mix of offensive and utility)
- **4th-5th**: Aggressive (Astro Rocket, Gravity Snare, Comet Drop, Chaos Ray)

---

## Cooldowns & Durations Summary

| Item | Effect Duration | Invulnerability Period | Persistence |
|------|----------------|------------------------|-------------|
| Astro Rocket | 1.2s stun | N/A | Instant |
| Plasma Marble | 15s or triggered | N/A | 15s world object |
| Gravity Snare | 2.5s slow | N/A | 2.5s zone |
| Warp Boost | 2.5s boost | 2.5s (collision immunity) | Self buff |
| Ion Shield | 5.0s or 1 hit | 5.0s | Self buff |
| Comet Drop | 3.0s meteor rain | N/A | 3.0s event |
| Phase Mine | 20s or triggered | N/A | 20s world object |
| Chaos Ray | 3.0s reversed controls | N/A | Instant debuff |
| Meteor Swarm | Instant | N/A | Instant |
| Slipstream Orb | 8.0s zone | N/A | 8.0s moving zone |

---

## Counterplay Rules Matrix

| Weapon | Shield Blocks? | Dodge Possible? | Terrain Counter? | Item Counter? |
|--------|----------------|-----------------|------------------|---------------|
| Astro Rocket | ✅ Yes | ✅ Yes (hard turn) | ✅ Hide behind object | Shield |
| Plasma Marble | ✅ Yes | ✅ Yes (steer around) | ❌ No | Shield |
| Gravity Snare | ✅ Yes | ✅ Yes (avoid zone) | ❌ No | Warp Boost, Shield |
| Warp Boost | N/A | N/A | N/A | N/A |
| Ion Shield | N/A | N/A | N/A | N/A |
| Comet Drop | ✅ Yes (all) | ✅ Yes (weave) | ❌ No | Shield |
| Phase Mine | ✅ Yes | ✅ Yes (hear beep) | ❌ No | Shield |
| Chaos Ray | ✅ Yes | ❌ No (instant) | ❌ No | Shield |
| Meteor Swarm | ✅ Yes (all) | ⚠️ Partial (dodge some) | ❌ No | Shield |
| Slipstream Orb | N/A (not harmful) | ✅ Don't follow | N/A | Pass user quickly |

---

## How Chaos Stays Fair

### 1. **No Instant Wins**
- Even best item (Chaos Ray) only gives 3s advantage (~10 units at average speed)
- Skilled player with bad luck can still win 60%+ of races

### 2. **Skill Amplifies Items**
- Warp Boost + Perfect Drift = Massive advantage
- Bad timing wastes items (rocket into wall, shield when no threats)

### 3. **Comeback Mechanic Limits**
- 5th place gets strong items but still must execute well
- 1st place has defensive tools and skill advantage

### 4. **RNG Mitigation**
- Position-based probabilities ensure appropriate items
- No "dead" items (every item is useful in some situation)
- Item boxes placed strategically (not mid-danger zone)

### 5. **Visual/Audio Clarity**
- 0.3–1.0s telegraphs allow reactive play
- Distinct audio cues for each weapon
- Screen indicators for incoming threats

---

## Balance Tuning Levers (Post-Launch)

### If Races Too Random (Chaos > Skill)
- Reduce stun durations by 10–20%
- Increase telegraph times (+0.2s)
- Tighten position-based probabilities (less RNG variance)
- Increase shield spawn rate for leaders

### If Races Too Predictable (Skill >> Chaos)
- Increase item effectiveness (+0.3s stun)
- Reduce telegraph times (−0.1s)
- Broaden item distribution (more variety per position)
- Add occasional "wild" item boxes (random drops)

### If Specific Item Overpowered
- Nerf duration or range
- Increase counter availability
- Add cooldown between uses (future mechanic)
- Adjust spawn probability

---

## Anti-Frustration Rules

### Items That Feel Bad (Avoided)
- ❌ **Blue Shell Clones**: No auto-targeting 1st place from anywhere
- ❌ **Stealing Items**: Players keep their earned items
- ❌ **Instant Deaths**: No one-shot kills, only stuns
- ❌ **Permanent Debuffs**: All effects expire quickly (≤3s)

### Items That Feel Good (Emphasized)
- ✅ **Clutch Shields**: Blocking rocket at last second = exciting
- ✅ **Perfect Boosts**: Warp Boost + Drift chain = skill expression
- ✅ **Revenge Weapons**: Hit the player who just hit you = satisfying
- ✅ **Close Calls**: Dodging meteors by inches = adrenaline

---

## Testing Checklist

### Pre-Launch Balance Validation
- [ ] 1st place wins 40–50% of 5-racer matches (not too strong)
- [ ] 5th place wins 10–15% (comeback possible)
- [ ] No single item accounts for >30% of position changes
- [ ] Shield blocks all intended weapons (regression test)
- [ ] Telegraph timings allow 60%+ dodge rate for skilled players
- [ ] Item distribution probabilities match tables (QA validation)

### Edge Cases
- [ ] Multiple Plasma Marble sets don't stack infinitely
- [ ] Phase Mines despawn correctly after 20s
- [ ] Chaos Ray + Gravity Snare combo doesn't softlock players
- [ ] Slipstream Orb doesn't create infinite speed loops
- [ ] Warp Boost + environmental hazard interaction tested

---

**Summary**: 10 weapons with clear roles, position-based distribution, and robust counterplay. Chaos creates excitement, but skill determines outcomes. Leaders defend, followers attack, everyone has fun.
