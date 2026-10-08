// src/MockData.ts

export type VerificationStatus = 'placeholder' | 'reviewed' | 'verified';
export type OxygenStatus = 'Safe' | 'Reduced' | 'Stop';
export type MealStatus = 'Pending' | 'Given' | 'Reduced' | 'Skipped';
export type FarmerAction = 'Pending' | 'Accepted' | 'Edited' | 'Dismissed';
export type WeatherType = 'Sunny' | 'Cloudy' | 'Rainy' | 'Cold' | 'Hot and calm';

export type AlertCategory = 'water_change' | 'low_oxygen' | 'extreme_condition';

export interface AutomatedAlert {
  id: string;
  category: AlertCategory;
  title: string;
  message: string;
  actionRequired: string;
  severity: 'high' | 'critical' | 'medium';
  timestampText: string;
}

export interface SpeciesOption {
  id: string;
  name: string;
  category: 'Fish' | 'Shrimp' | 'Other';
  oxygenStopLevel: number; // e.g. 3.0 mg/L
  oxygenFullFeedingLevel: number; // e.g. 5.0 mg/L
  tempOptimumRange: [number, number]; // e.g. [26, 31]
  expectedFCR: number;
  status: VerificationStatus;
}

export interface FarmSetup {
  farmName: string;
  pondName: string;
  speciesId: string;
  customSpeciesName?: string;
  stockingDate: string; // YYYY-MM-DD
  stockCount: number;
  startingWeightG: number;
  currentEstimatedWeightG: number;
  currentStageName: string;
}

export interface MealItem {
  id: string;
  sessionName: string;
  time: string;
  feedType: string; // Feed Type X, Feed Type Y, Feed Type Z
  pelletSizeMm: number;
  plannedKg: number;
  actualKg?: number;
  leftover?: 'none' | 'a little' | 'a lot';
  status: MealStatus;
  doAtMeal: number;
  reason?: string;
}

export interface AdviceItem {
  id: string;
  rule: string;
  suggestion: string;
  reason: string;
  farmerAction: FarmerAction;
}

export interface SampleWeighRecord {
  id: string;
  date: string;
  predictedWeightG: number;
  realWeightG: number;
}

// Common Farmed Species Checklist
export const SPECIES_LIST: SpeciesOption[] = [
  { id: 'rohu', name: 'Rohu (Labeo rohita)', category: 'Fish', oxygenStopLevel: 3.0, oxygenFullFeedingLevel: 5.0, tempOptimumRange: [26, 31], expectedFCR: 1.5, status: 'placeholder' },
  { id: 'catla', name: 'Catla (Gibelion catla)', category: 'Fish', oxygenStopLevel: 3.0, oxygenFullFeedingLevel: 5.0, tempOptimumRange: [27, 32], expectedFCR: 1.5, status: 'placeholder' },
  { id: 'mrigal', name: 'Mrigal (Cirrhinus mrigala)', category: 'Fish', oxygenStopLevel: 3.0, oxygenFullFeedingLevel: 5.0, tempOptimumRange: [25, 30], expectedFCR: 1.6, status: 'placeholder' },
  { id: 'common_carp', name: 'Common Carp (Cyprinus carpio)', category: 'Fish', oxygenStopLevel: 2.5, oxygenFullFeedingLevel: 4.5, tempOptimumRange: [22, 28], expectedFCR: 1.4, status: 'placeholder' },
  { id: 'grass_carp', name: 'Grass Carp (Ctenopharyngodon idella)', category: 'Fish', oxygenStopLevel: 3.0, oxygenFullFeedingLevel: 5.0, tempOptimumRange: [24, 30], expectedFCR: 1.6, status: 'placeholder' },
  { id: 'silver_carp', name: 'Silver Carp (Hypophthalmichthys molitrix)', category: 'Fish', oxygenStopLevel: 3.0, oxygenFullFeedingLevel: 5.0, tempOptimumRange: [23, 29], expectedFCR: 1.4, status: 'placeholder' },
  { id: 'nile_tilapia', name: 'Nile Tilapia (Oreochromis niloticus)', category: 'Fish', oxygenStopLevel: 3.0, oxygenFullFeedingLevel: 5.0, tempOptimumRange: [27, 32], expectedFCR: 1.35, status: 'placeholder' },
  { id: 'pangasius', name: 'Pangasius (Pangasianodon hypophthalmus)', category: 'Fish', oxygenStopLevel: 2.5, oxygenFullFeedingLevel: 4.5, tempOptimumRange: [28, 33], expectedFCR: 1.55, status: 'placeholder' },
  { id: 'magur', name: 'Magur (Clarias magur)', category: 'Fish', oxygenStopLevel: 2.0, oxygenFullFeedingLevel: 4.0, tempOptimumRange: [26, 32], expectedFCR: 1.3, status: 'placeholder' },
  { id: 'rainbow_trout', name: 'Rainbow Trout (Oncorhynchus mykiss)', category: 'Fish', oxygenStopLevel: 5.0, oxygenFullFeedingLevel: 7.0, tempOptimumRange: [12, 18], expectedFCR: 1.1, status: 'placeholder' },
  { id: 'barramundi', name: 'Barramundi / Asian Seabass (Lates calcarifer)', category: 'Fish', oxygenStopLevel: 3.5, oxygenFullFeedingLevel: 5.5, tempOptimumRange: [26, 32], expectedFCR: 1.3, status: 'placeholder' },
  { id: 'vannamei_shrimp', name: 'Vannamei Shrimp (Penaeus vannamei)', category: 'Shrimp', oxygenStopLevel: 3.5, oxygenFullFeedingLevel: 5.5, tempOptimumRange: [28, 32], expectedFCR: 1.25, status: 'placeholder' },
  { id: 'black_tiger_shrimp', name: 'Black Tiger Shrimp (Penaeus monodon)', category: 'Shrimp', oxygenStopLevel: 3.5, oxygenFullFeedingLevel: 5.5, tempOptimumRange: [27, 31], expectedFCR: 1.4, status: 'placeholder' },
  { id: 'other', name: 'Other Species (Custom Name)', category: 'Other', oxygenStopLevel: 3.0, oxygenFullFeedingLevel: 5.0, tempOptimumRange: [26, 32], expectedFCR: 1.4, status: 'placeholder' },
];

export const INITIAL_SETUP: FarmSetup = {
  farmName: 'Sangli Aqua Farm',
  pondName: 'Pond A1',
  speciesId: 'nile_tilapia',
  stockingDate: '2026-09-01',
  stockCount: 15000,
  startingWeightG: 5.0,
  currentEstimatedWeightG: 40.0,
  currentStageName: 'Fingerling',
};

// Configurable Feed Timetable Schedule (Feed Type X, Y, Z placeholders as requested)
export const INITIAL_MEALS: MealItem[] = [
  {
    id: 'm1',
    sessionName: 'Morning Session',
    time: '08:00 AM',
    feedType: 'Feed Type X (Starter 2.0mm)',
    pelletSizeMm: 2.0,
    plannedKg: 3.2,
    status: 'Pending',
    doAtMeal: 5.2,
  },
  {
    id: 'm2',
    sessionName: 'Midday Session',
    time: '01:00 PM',
    feedType: 'Feed Type Y (Grower 3.0mm)',
    pelletSizeMm: 3.0,
    plannedKg: 3.2,
    status: 'Pending',
    doAtMeal: 4.2,
  },
  {
    id: 'm3',
    sessionName: 'Evening Session',
    time: '05:30 PM',
    feedType: 'Feed Type Z (Finisher 4.0mm)',
    pelletSizeMm: 4.0,
    plannedKg: 3.2,
    status: 'Pending',
    doAtMeal: 5.4,
  },
];

export const INITIAL_ADVICE: AdviceItem[] = [
  {
    id: 'adv-1',
    rule: 'Cloudy Weather Sensor Adjustment',
    suggestion: 'Cloudy condition auto-detected: feed 15% less in Morning Session & move feed 30 mins earlier.',
    reason: 'Algae photosynthesis reduced under cloudy skies, lowering morning oxygen generation.',
    farmerAction: 'Pending',
  },
  {
    id: 'adv-2',
    rule: 'Optimal Temp Feed Efficiency',
    suggestion: 'Water temp auto-detected at optimal 29.5°C: full ration for Feed Type Y approved.',
    reason: 'Peak enzymatic digestion efficiency.',
    farmerAction: 'Accepted',
  },
];

export const DEMO_ALERTS: AutomatedAlert[] = [
  {
    id: 'alt-water-change',
    category: 'water_change',
    title: 'Water Change Alert Required',
    message: 'Organic load and ammonia concentration elevated beyond 0.8 ppm threshold.',
    actionRequired: 'Initiate 20% water exchange immediately and increase aeration.',
    severity: 'high',
    timestampText: 'Auto-detected 2 min ago',
  },
  {
    id: 'alt-low-oxygen',
    category: 'low_oxygen',
    title: 'Critical Low Oxygen Alert',
    message: 'Dissolved Oxygen dropped to 2.7 mg/L (Below 3.0 mg/L safety stop limit).',
    actionRequired: 'Turn on emergency aerators. Feeding is automatically blocked.',
    severity: 'critical',
    timestampText: 'Auto-detected 1 min ago',
  },
  {
    id: 'alt-extreme-cond',
    category: 'extreme_condition',
    title: 'Extreme Weather & Temperature Warning',
    message: 'Water temp peaked at 34.8°C with hot calm weather (thermal stress zone).',
    actionRequired: 'Reduce feeding by 50% & deploy shade netting/paddle wheels.',
    severity: 'high',
    timestampText: 'Auto-detected just now',
  },
];

export const INITIAL_WEIGH_RECORDS: SampleWeighRecord[] = [
  { id: 'w1', date: '2026-09-15', predictedWeightG: 18.0, realWeightG: 19.5 },
  { id: 'w2', date: '2026-09-29', predictedWeightG: 32.0, realWeightG: 31.0 },
];

export const DISCLAIMER_NOTE = 'Decision support only. Not a guarantee.';
