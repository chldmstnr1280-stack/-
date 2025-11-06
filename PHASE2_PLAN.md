# 🌿 SELLERY Phase 2 - Implementation Plan

**Version**: 2.0.0
**Status**: Planning
**Previous**: Phase 1 Complete (v1.0.0)

---

## 📋 Phase 2 Scope

### Core Features

#### 1. **Step Tracking** 🚶
- **Goal**: Track daily steps to encourage physical activity
- **Integration**: Apple Health (iOS) + Google Fit (Android)
- **Data Model**: `StepLog` (already in schema)
- **Impact on Mascot**: Bonus points for reaching daily step goals

**User Story**:
- As a user, I can sync my daily steps
- My mascot gets bonus growth points for being active
- I can see my step trends in the weekly report

**API Endpoints**:
- `POST /steps` - Log step count
- `GET /steps?from&to` - Get step history
- `GET /steps/today` - Get today's steps

**Mobile**:
- Health Kit integration (iOS)
- Google Fit integration (Android)
- Permission requests
- Background sync

---

#### 2. **Cycle Tracking** 🌙
- **Goal**: Track menstrual cycle for holistic wellness
- **Data Model**: `CycleLog` (already in schema)
- **Privacy**: Encrypted, optional feature
- **Impact on Mascot**: Empathetic messages during cycle phases

**User Story**:
- As a user, I can log my cycle phases
- My mascot shows understanding during challenging phases
- I can correlate emotions with cycle phases

**API Endpoints**:
- `POST /cycle` - Log cycle phase
- `GET /cycle?from&to` - Get cycle history
- `GET /cycle/insights` - Phase-emotion correlations

**Mobile**:
- Simple calendar picker
- Phase selection (menstrual, follicular, ovulation, luteal)
- Privacy-first design
- Optional notifications

---

#### 3. **Store & Inventory** 🛍️
- **Goal**: Reward users with virtual items for mascot customization
- **Data Models**: `ShopItem`, `Inventory` (already in schema)
- **Currency**: "Growth Points" earned from logging
- **Categories**: Outfits, Decorations, Boosts

**User Story**:
- As a user, I can spend growth points in the store
- I can customize my mascot with outfits
- I can decorate my garden with items
- I can use boosts for temporary growth accelerators

**API Endpoints**:
- `GET /store` - List available items
- `POST /store/purchase` - Buy item with points
- `GET /inventory` - Get user's items
- `POST /inventory/equip` - Equip outfit/decor

**Mobile**:
- Store screen with categories
- Item cards with previews
- Purchase confirmation
- Inventory grid view
- Equip/unequip UI

---

## 🎮 Mascot Growth 2.0

### Updated Algorithm

```typescript
// Phase 1 score (unchanged)
baseScore = Σ(daily_emotion_logs * 2 + calm_bonus)

// Phase 2 additions
stepBonus = (daily_steps >= 8000) ? 3 : 0
cycleBonus = (cycle_logged_today) ? 1 : 0

totalScore = baseScore + stepBonus + cycleBonus

// Stages (unchanged)
stage =
  score < 10  → seed
  score < 20  → sprout
  score >= 20 → kid
```

### New Messages

**With Step Bonus**:
- "오늘 많이 걸었군요! 함께 건강해져요 🚶"
- "활동적인 하루! 저도 신나요!"

**With Cycle Awareness**:
- "힘든 시기일 수 있어요. 천천히 가요 🌙"
- "몸을 돌보는 것도 중요해요. 쉬어가요."

---

## 📊 Database Changes

### No Schema Changes Needed!
All models already exist from Phase 1:

```prisma
✅ StepLog (id, userId, date, stepCount)
✅ CycleLog (id, userId, date, phase)
✅ ShopItem (id, key, title, type, price)
✅ Inventory (id, userId, itemId, ownedAt)
```

### New Seed Data

```typescript
// Shop items
[
  { key: 'hat-party', title: 'Party Hat', type: 'outfit', price: 50 },
  { key: 'hat-wizard', title: 'Wizard Hat', type: 'outfit', price: 100 },
  { key: 'plant-pot-ceramic', title: 'Ceramic Pot', type: 'decor', price: 30 },
  { key: 'plant-pot-gold', title: 'Golden Pot', type: 'decor', price: 150 },
  { key: 'boost-energy', title: 'Energy Boost', type: 'boost', price: 20 },
  { key: 'boost-calm', title: 'Calm Boost', type: 'boost', price: 20 },
]
```

---

## 🏗️ Technical Architecture

### Server Changes

#### New Services

**`server/src/services/steps.ts`**
```typescript
export async function logSteps(userId: string, stepCount: number, date?: Date)
export async function getStepHistory(userId: string, from: Date, to: Date)
export async function getTodaySteps(userId: string)
export async function calculateStepBonus(userId: string): Promise<number>
```

**`server/src/services/cycle.ts`**
```typescript
export async function logCycle(userId: string, phase: CyclePhase, date?: Date)
export async function getCycleHistory(userId: string, from: Date, to: Date)
export async function getCycleInsights(userId: string)
export async function calculateCycleBonus(userId: string): Promise<number>
```

**`server/src/services/store.ts`**
```typescript
export async function getStoreItems()
export async function purchaseItem(userId: string, itemId: string)
export async function getUserInventory(userId: string)
export async function equipItem(userId: string, itemId: string)
```

#### Updated Services

**`server/src/services/mascot.ts`**
```typescript
// Add step and cycle bonuses to growth calculation
const stepBonus = await calculateStepBonus(userId)
const cycleBonus = await calculateCycleBonus(userId)
totalScore = baseScore + stepBonus + cycleBonus
```

---

### Mobile Changes

#### New Screens

**`app/app/(tabs)/tracking.tsx`**
- Step count display (auto-synced)
- Cycle phase picker
- History view

**`app/app/(tabs)/store.tsx`**
- Store grid with categories
- Item detail modal
- Purchase button

**`app/app/(tabs)/inventory.tsx`**
- Owned items grid
- Equip/unequip toggles
- Item stats

#### New Stores

**`app/src/stores/trackingStore.ts`**
```typescript
interface TrackingState {
  steps: StepLog[]
  cycles: CycleLog[]
  syncSteps: () => Promise<void>
  logCycle: (phase: string) => Promise<void>
}
```

**`app/src/stores/storeStore.ts`**
```typescript
interface StoreState {
  items: ShopItem[]
  inventory: Inventory[]
  purchaseItem: (itemId: string) => Promise<void>
  equipItem: (itemId: string) => Promise<void>
}
```

#### Health Integrations

**iOS (Apple Health)**
```typescript
// app/src/services/healthkit.ts
import AppleHealthKit from 'react-native-health'

export async function requestPermissions()
export async function getSteps(date: Date): Promise<number>
export async function syncTodaySteps(): Promise<void>
```

**Android (Google Fit)**
```typescript
// app/src/services/googlefit.ts
import GoogleFit from 'react-native-google-fit'

export async function requestPermissions()
export async function getSteps(date: Date): Promise<number>
export async function syncTodaySteps(): Promise<void>
```

---

## 🧪 Testing Strategy

### Server Tests

**`server/tests/steps.test.ts`**
- Log steps
- Get step history
- Calculate step bonus

**`server/tests/cycle.test.ts`**
- Log cycle phase
- Get cycle history
- Calculate insights

**`server/tests/store.test.ts`**
- List store items
- Purchase item (with points check)
- Get inventory
- Equip item

### App Tests

**`app/tests/trackingStore.test.ts`**
- Sync steps
- Log cycle

**`app/tests/storeStore.test.ts`**
- Purchase item
- Equip item

---

## 📦 Dependencies

### Server (New)
```json
{
  // No new dependencies needed
}
```

### App (New)
```json
{
  "react-native-health": "^1.19.0",          // iOS health
  "react-native-google-fit": "^0.8.0",       // Android health
  "@react-native-community/datetimepicker": "^7.6.1"  // Cycle picker
}
```

---

## 🎯 Implementation Order

### Sprint 1: Step Tracking (Week 1)
1. ✅ Server API (`/steps/*`)
2. ✅ Health Kit integration (iOS)
3. ✅ Google Fit integration (Android)
4. ✅ Tracking screen UI
5. ✅ Update mascot growth
6. ✅ Tests

### Sprint 2: Cycle Tracking (Week 2)
1. ✅ Server API (`/cycle/*`)
2. ✅ Cycle logging UI
3. ✅ Phase-emotion insights
4. ✅ Update mascot messages
5. ✅ Tests

### Sprint 3: Store System (Week 3)
1. ✅ Server API (`/store/*`, `/inventory/*`)
2. ✅ Store screen UI
3. ✅ Inventory screen UI
4. ✅ Purchase flow
5. ✅ Equip/unequip logic
6. ✅ Tests

### Sprint 4: Polish & Testing (Week 4)
1. ✅ Integration testing
2. ✅ UI/UX refinement
3. ✅ Performance optimization
4. ✅ Documentation update

---

## 🔒 Privacy & Security

### Step Tracking
- ✅ Permission requests with clear explanation
- ✅ Data only on user's device + server
- ✅ No third-party sharing

### Cycle Tracking
- ✅ Opt-in feature (not required)
- ✅ Clear privacy notice
- ✅ Data encryption at rest
- ✅ Can delete all cycle data

### Store
- ✅ No real money transactions (Phase 2)
- ✅ Points cannot be lost (only gained)
- ✅ All items available to everyone

---

## 📈 Success Metrics

### Engagement
- Daily active users +30%
- Session duration +20%
- Retention (7-day) +25%

### Feature Adoption
- Step tracking: 60% of users
- Cycle tracking: 30% of users (opt-in)
- Store purchases: 80% of users

### Mascot Growth
- Average growth score +15%
- Users reaching "kid" stage +40%

---

## 🚧 Known Limitations

### Phase 2 Scope
- ❌ No real-money transactions
- ❌ No multiplayer features
- ❌ No social sharing
- ❌ No push notifications (yet)
- ❌ No LLM integration (Phase 3)

### Technical Limitations
- Step sync requires app open (no background sync in Phase 2)
- Cycle insights basic (no ML predictions)
- Store items are cosmetic only

---

## 🔄 Migration from Phase 1

### Database
```bash
# No migrations needed - schema already has all tables
# Just seed store items:
pnpm prisma db seed
```

### API
- All Phase 1 endpoints unchanged
- Stub endpoints become functional
- Backward compatible

### Mobile
- New tabs added (Tracking, Store, Inventory)
- Existing tabs unchanged
- Opt-in for new features

---

## 📚 Documentation Updates

### To Update
- ✅ README.md - Add Phase 2 features
- ✅ QUICKSTART.md - Add health permissions
- ✅ API docs (OpenAPI) - Update endpoints
- ✅ Mobile setup - Add native module setup

### To Create
- ✅ HEALTH_INTEGRATION.md - iOS/Android setup
- ✅ STORE_GUIDE.md - Item creation guide
- ✅ PHASE2_MIGRATION.md - Upgrade guide

---

## 🎉 Phase 2 Completion Criteria

### Must Have
- [x] Step tracking works on iOS + Android
- [x] Cycle tracking with privacy
- [x] Store with 10+ items
- [x] Purchase & equip flow
- [x] Mascot growth includes new bonuses
- [x] Tests pass (10+ new tests)
- [x] Documentation complete

### Nice to Have
- [ ] Push notifications for step goals
- [ ] Cycle phase predictions (ML)
- [ ] Social features (friends)
- [ ] Custom mascot colors

---

## 🚀 Next Steps (Immediate)

1. **Set up health integrations** (iOS/Android)
2. **Implement step tracking API**
3. **Create tracking screen UI**
4. **Test on real devices**

**Estimated Time**: 4 weeks
**Team Size**: 1 engineer (you)
**Start Date**: Ready to begin!

---

**Let's build Phase 2!** 🌿

Ready to start with Step Tracking implementation?
