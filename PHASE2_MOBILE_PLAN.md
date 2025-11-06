# Phase 2 Mobile Implementation Plan

## 📱 Overview

This document outlines the mobile implementation plan for SELLERY Phase 2 features. The server APIs are already complete and tested. This plan focuses on building the React Native UI and integrating with device health APIs.

## 🎯 Objectives

1. **Store UI**: Browse and purchase items from the shop
2. **Inventory UI**: View owned items and purchase statistics
3. **Step Tracking UI**: Display daily/weekly steps with charts
4. **Cycle Tracking UI**: Log cycle phases and view insights
5. **Health Kit Integration**: iOS step counting (optional)
6. **Google Fit Integration**: Android step counting (optional)

## 📋 Implementation Priority

### Phase 2A: Store & Inventory (High Priority)
- **Why First**: No device API dependencies, uses existing patterns
- **Effort**: Medium (2-3 screens)
- **Dependencies**: None

### Phase 2B: Step & Cycle Tracking UI (Medium Priority)
- **Why Second**: Builds on Store/Inventory patterns, manual entry first
- **Effort**: Medium (2-3 screens)
- **Dependencies**: Store & Inventory complete

### Phase 2C: Health API Integration (Low Priority)
- **Why Last**: Optional feature, requires native modules
- **Effort**: High (platform-specific code)
- **Dependencies**: Step Tracking UI complete

## 🏗️ Architecture

### File Structure
```
app/
├── app/
│   ├── (tabs)/
│   │   ├── home.tsx           # Update: Add store/inventory buttons
│   │   ├── store.tsx           # NEW: Shop browser
│   │   ├── inventory.tsx       # NEW: User inventory
│   │   ├── tracking.tsx        # NEW: Steps & Cycle
│   │   ├── log.tsx             # Existing
│   │   └── report.tsx          # Existing
│   └── _layout.tsx             # Update: Add new tabs
├── src/
│   ├── api/
│   │   ├── store.ts            # NEW: Store API calls
│   │   ├── inventory.ts        # NEW: Inventory API calls
│   │   ├── steps.ts            # NEW: Steps API calls
│   │   └── cycle.ts            # NEW: Cycle API calls
│   ├── components/
│   │   ├── ShopItem.tsx        # NEW: Shop item card
│   │   ├── InventoryItem.tsx   # NEW: Inventory item card
│   │   ├── StepChart.tsx       # NEW: Step statistics chart
│   │   └── CycleCalendar.tsx   # NEW: Cycle phase calendar
│   ├── stores/
│   │   ├── storeStore.ts       # NEW: Shop state management
│   │   ├── inventoryStore.ts   # NEW: Inventory state
│   │   ├── stepStore.ts        # NEW: Step tracking state
│   │   └── cycleStore.ts       # NEW: Cycle tracking state
│   ├── types/
│   │   └── phase2.ts           # NEW: Phase 2 TypeScript types
│   └── utils/
│       ├── healthKit.ts        # NEW: iOS Health Kit wrapper
│       └── googleFit.ts        # NEW: Android Google Fit wrapper
```

## 📱 Screen Specifications

### 1. Store Screen (`app/(tabs)/store.tsx`)

**Features:**
- List all shop items with images/emojis
- Filter by type (outfit, decor, boost)
- Show item price and user's available points
- Purchase button with confirmation
- "Already Owned" indicator
- Error handling for insufficient points

**UI Elements:**
- Header with points balance
- Filter tabs (All | Outfits | Decor | Boosts)
- Scrollable grid of shop items
- Purchase confirmation modal

**API Integration:**
- `GET /store` - Fetch shop items
- `GET /store/points` - Get user points
- `POST /store/purchase` - Buy item

### 2. Inventory Screen (`app/(tabs)/inventory.tsx`)

**Features:**
- Display all owned items
- Show purchase date
- Group by type (outfits, decor, boosts)
- Show statistics (total items, total spent)
- Empty state for new users

**UI Elements:**
- Header with inventory stats
- Filter tabs (All | Outfits | Decor | Boosts)
- Scrollable list/grid of owned items
- Purchase statistics card

**API Integration:**
- `GET /inventory` - Fetch user's items
- `GET /inventory/stats` - Get statistics

### 3. Tracking Screen (`app/(tabs)/tracking.tsx`)

**Features:**
- Two main sections: Steps & Cycle
- Manual step entry with date picker
- Weekly step chart
- Cycle phase selector
- Emotion correlation insights
- Today's bonuses display

**UI Elements:**
- Tab switcher (Steps | Cycle)
- Step counter with input
- Weekly step chart (bar graph)
- Cycle phase picker (4 phases + none)
- Insights card with emotional patterns

**API Integration:**
- `POST /steps` - Log step count
- `GET /steps/weekly` - Weekly stats
- `POST /cycle` - Log cycle phase
- `GET /cycle/insights` - Get insights

### 4. Home Screen Updates (`app/(tabs)/home.tsx`)

**New Features:**
- "Visit Store" button
- "View Inventory" button
- Display today's step/cycle bonuses
- Show owned items count

## 🎨 Design System

### Colors
```typescript
const colors = {
  primary: '#6B9F7D',      // Green (existing)
  secondary: '#FFB84D',    // Gold (points)
  accent: '#E67E73',       // Pink (cycle)
  background: '#F5F5F5',
  cardBg: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  border: '#DDDDDD',
  success: '#4CAF50',
  error: '#F44336',
}
```

### Typography
- Header: 24px, Bold
- Section Title: 18px, Semibold
- Body: 16px, Regular
- Caption: 14px, Regular

### Components
- **Card**: White background, rounded corners (12px), shadow
- **Button**: Rounded (8px), primary color, white text
- **Badge**: Small rounded (16px), gold background for points

## 🔌 API Client Implementation

### Store API (`src/api/store.ts`)

```typescript
import { apiClient } from './client';

export interface ShopItem {
  id: string;
  key: string;
  title: string;
  type: 'outfit' | 'decor' | 'boost';
  price: number;
}

export const storeApi = {
  async getItems(type?: string): Promise<ShopItem[]> {
    const params = type ? { type } : {};
    const { data } = await apiClient.get('/store', { params });
    return data;
  },

  async purchaseItem(itemId: string): Promise<{ message: string; inventory: any }> {
    const { data } = await apiClient.post('/store/purchase', { itemId });
    return data;
  },

  async getPoints(): Promise<{ points: number }> {
    const { data } = await apiClient.get('/store/points');
    return data;
  },
};
```

### Steps API (`src/api/steps.ts`)

```typescript
import { apiClient } from './client';

export interface StepLog {
  id: string;
  userId: string;
  date: string;
  stepCount: number;
}

export interface WeeklyStepStats {
  totalSteps: number;
  avgStepsPerDay: number;
  daysWithSteps: number;
  dailySteps: Array<{ date: string; stepCount: number }>;
}

export const stepsApi = {
  async logSteps(stepCount: number, date?: Date): Promise<StepLog> {
    const { data } = await apiClient.post('/steps', {
      stepCount,
      date: date?.toISOString()
    });
    return data;
  },

  async getHistory(from?: Date, to?: Date): Promise<StepLog[]> {
    const params: any = {};
    if (from) params.from = from.toISOString();
    if (to) params.to = to.toISOString();
    const { data } = await apiClient.get('/steps', { params });
    return data;
  },

  async getTodaySteps(): Promise<{ stepCount: number }> {
    const { data } = await apiClient.get('/steps/today');
    return data;
  },

  async getWeeklyStats(): Promise<WeeklyStepStats> {
    const { data } = await apiClient.get('/steps/weekly');
    return data;
  },
};
```

### Cycle API (`src/api/cycle.ts`)

```typescript
import { apiClient } from './client';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | null;

export interface CycleLog {
  id: string;
  userId: string;
  date: string;
  phase: CyclePhase;
}

export interface CycleInsights {
  currentPhase: CyclePhase;
  avgIntensityByPhase: Record<string, number>;
  commonEmotionsByPhase: Record<string, string[]>;
  totalCycleDays: number;
}

export const cycleApi = {
  async logCycle(phase: CyclePhase, date?: Date): Promise<CycleLog> {
    const { data } = await apiClient.post('/cycle', {
      phase,
      date: date?.toISOString()
    });
    return data;
  },

  async getHistory(from?: Date, to?: Date): Promise<CycleLog[]> {
    const params: any = {};
    if (from) params.from = from.toISOString();
    if (to) params.to = to.toISOString();
    const { data } = await apiClient.get('/cycle', { params });
    return data;
  },

  async getCurrentPhase(): Promise<{ phase: CyclePhase }> {
    const { data } = await apiClient.get('/cycle/current');
    return data;
  },

  async getInsights(): Promise<CycleInsights> {
    const { data } = await apiClient.get('/cycle/insights');
    return data;
  },
};
```

## 🗄️ State Management (Zustand)

### Store State (`src/stores/storeStore.ts`)

```typescript
import { create } from 'zustand';
import { storeApi, ShopItem } from '../api/store';

interface StoreState {
  items: ShopItem[];
  points: number;
  isLoading: boolean;
  error: string | null;

  fetchItems: (type?: string) => Promise<void>;
  fetchPoints: () => Promise<void>;
  purchaseItem: (itemId: string) => Promise<boolean>;
  reset: () => void;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  items: [],
  points: 0,
  isLoading: false,
  error: null,

  fetchItems: async (type?: string) => {
    set({ isLoading: true, error: null });
    try {
      const items = await storeApi.getItems(type);
      set({ items, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPoints: async () => {
    try {
      const { points } = await storeApi.getPoints();
      set({ points });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  purchaseItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      await storeApi.purchaseItem(itemId);
      await get().fetchPoints(); // Refresh points
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  reset: () => set({ items: [], points: 0, isLoading: false, error: null }),
}));
```

## 📊 Charts & Visualization

### Step Chart Component

Use a charting library:
- **Option 1**: `react-native-chart-kit` (simple, lightweight)
- **Option 2**: `victory-native` (powerful, customizable)
- **Option 3**: `react-native-svg-charts` (SVG-based)

**Recommendation**: `react-native-chart-kit` for simplicity

```bash
cd app
pnpm add react-native-chart-kit react-native-svg
```

## 🔐 Health API Integration

### iOS Health Kit (`src/utils/healthKit.ts`)

```typescript
// Requires: expo-health-kit or react-native-health
import * as HealthKit from 'expo-health-kit';

export const healthKit = {
  async requestPermissions(): Promise<boolean> {
    try {
      const granted = await HealthKit.requestPermissionsAsync({
        read: [HealthKit.PermissionTypes.StepCount],
      });
      return granted;
    } catch (error) {
      console.error('Health Kit permission error:', error);
      return false;
    }
  },

  async getTodaySteps(): Promise<number> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const steps = await HealthKit.queryQuantitySamplesAsync(
        HealthKit.QuantityTypeIdentifier.StepCount,
        { start: startOfDay, end: new Date() }
      );

      return steps.reduce((sum, sample) => sum + sample.quantity, 0);
    } catch (error) {
      console.error('Failed to fetch steps:', error);
      return 0;
    }
  },
};
```

### Android Google Fit (`src/utils/googleFit.ts`)

```typescript
// Requires: react-native-google-fit
import GoogleFit from 'react-native-google-fit';

export const googleFit = {
  async requestPermissions(): Promise<boolean> {
    try {
      const permissions = [{ scopes: ['FITNESS_ACTIVITY_READ'] }];
      await GoogleFit.authorize(permissions);
      return true;
    } catch (error) {
      console.error('Google Fit permission error:', error);
      return false;
    }
  },

  async getTodaySteps(): Promise<number> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const result = await GoogleFit.getDailySteps(startOfDay);
      return result[0]?.steps || 0;
    } catch (error) {
      console.error('Failed to fetch steps:', error);
      return 0;
    }
  },
};
```

## 🧪 Testing Strategy

### Unit Tests
- API client functions
- Zustand store logic
- Utility functions

### Component Tests
- Shop item rendering
- Purchase flow
- Step input validation
- Cycle phase selection

### Integration Tests
- End-to-end purchase flow
- Step logging with API
- Cycle insights display

### Manual Testing Checklist
- [ ] Browse store items
- [ ] Purchase item with sufficient points
- [ ] Attempt purchase with insufficient points
- [ ] View inventory after purchase
- [ ] Log steps manually
- [ ] View weekly step chart
- [ ] Log cycle phase
- [ ] View cycle insights
- [ ] Verify mascot bonuses update

## 📦 Dependencies to Add

```bash
cd app

# Charts
pnpm add react-native-chart-kit react-native-svg

# Date handling (if not already installed)
pnpm add date-fns

# Optional: Health APIs
pnpm add react-native-health  # iOS Health Kit
pnpm add react-native-google-fit  # Android Google Fit
```

## 🚀 Implementation Order

### Week 1: Store & Inventory
1. ✅ Create API clients (`store.ts`, `inventory.ts`)
2. ✅ Create Zustand stores
3. ✅ Build Store screen UI
4. ✅ Build Inventory screen UI
5. ✅ Implement purchase flow
6. ✅ Test end-to-end

### Week 2: Step Tracking
1. ✅ Create Steps API client
2. ✅ Create Step Zustand store
3. ✅ Build Tracking screen (Steps section)
4. ✅ Add step chart component
5. ✅ Implement manual step logging
6. ✅ Test step tracking

### Week 3: Cycle Tracking
1. ✅ Create Cycle API client
2. ✅ Create Cycle Zustand store
3. ✅ Build Tracking screen (Cycle section)
4. ✅ Add cycle phase selector
5. ✅ Display emotion insights
6. ✅ Test cycle tracking

### Week 4: Health API Integration (Optional)
1. ✅ Set up Health Kit (iOS)
2. ✅ Set up Google Fit (Android)
3. ✅ Add permission requests
4. ✅ Auto-sync step counts
5. ✅ Test on physical devices

## 🎯 Success Criteria

- [ ] Users can browse and purchase items from the store
- [ ] Users can view their inventory and statistics
- [ ] Users can manually log daily step counts
- [ ] Users can view weekly step charts
- [ ] Users can log cycle phases
- [ ] Users can view emotion-cycle insights
- [ ] Mascot bonuses update correctly (+3 for steps, +1 for cycle)
- [ ] All screens follow design system
- [ ] Error handling for API failures
- [ ] Loading states for async operations

## 📝 Notes

### Privacy Considerations
- Health data permissions are opt-in
- Manual entry always available as fallback
- Cycle tracking is completely optional
- Data never leaves user's device without consent

### Accessibility
- All interactive elements have proper labels
- Color contrast meets WCAG AA standards
- Chart data available in text format
- Support for screen readers

### Performance
- Lazy load inventory items
- Cache store items locally
- Debounce step input
- Optimize chart rendering

---

**Status**: Ready to implement
**Priority**: Phase 2A (Store & Inventory) → Phase 2B (Tracking UI) → Phase 2C (Health APIs)
**Estimated Duration**: 3-4 weeks for full implementation
