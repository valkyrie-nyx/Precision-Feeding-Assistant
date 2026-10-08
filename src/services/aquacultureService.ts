// src/services/aquacultureService.ts
import {
  SPECIES_LIST,
  INITIAL_SETUP,
  INITIAL_MEALS,
  INITIAL_ADVICE,
  INITIAL_WEIGH_RECORDS,
  DEMO_ALERTS,
  type FarmSetup,
  type MealItem,
  type AdviceItem,
  type WeatherType,
  type OxygenStatus,
  type SpeciesOption,
  type SampleWeighRecord,
  type AutomatedAlert,
  type AlertCategory,
} from '../MockData';

class AquacultureService {
  private isOnboarded: boolean = false;
  private farmSetup: FarmSetup = { ...INITIAL_SETUP };
  private meals: MealItem[] = [...INITIAL_MEALS];
  private adviceList: AdviceItem[] = [...INITIAL_ADVICE];
  private sampleWeighRecords: SampleWeighRecord[] = [...INITIAL_WEIGH_RECORDS];

  // Automated Telemetry State (Auto-fetched, no manual input needed)
  private telemetryData = {
    selectedWeather: 'Sunny' as WeatherType,
    latestDO: 5.2, // mg/L
    latestTemp: 29.5, // °C
    latestPH: 7.6,
    turbidityNtu: 24,
    lastSensorSyncText: 'Auto-updated 3 min ago via IoT Probe',
    isSensorConnected: true,
  };

  private isPlanGenerated: boolean = false;
  private stageChangedBannerShown: boolean = false;
  private stockSwapConfirmed: boolean = false;

  // Active Automated Alerts (Water change, Low oxygen, Extreme condition)
  private activeAlerts: AutomatedAlert[] = [];

  // Presentation Demo Controls State
  private activeDemoAlertBanner: string | null = null;

  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- STAGE CALCULATION ---
  public calculateStageFromWeight(weightG: number): string {
    if (weightG < 15) return 'Fry / Nursery';
    if (weightG <= 50) return 'Fingerling';
    if (weightG <= 200) return 'Juvenile';
    return 'Growout / Market';
  }

  // --- GETTERS ---
  public getIsOnboarded(): boolean {
    return this.isOnboarded;
  }

  public getFarmSetup(): FarmSetup {
    return { ...this.farmSetup };
  }

  public getSelectedSpecies(): SpeciesOption {
    return (
      SPECIES_LIST.find((s) => s.id === this.farmSetup.speciesId) ||
      SPECIES_LIST[6] // Nile tilapia default
    );
  }

  public getMeals(): MealItem[] {
    return [...this.meals];
  }

  public getAdvice(): AdviceItem[] {
    return [...this.adviceList];
  }

  public getSampleWeighRecords(): SampleWeighRecord[] {
    return [...this.sampleWeighRecords];
  }

  public getTelemetryData() {
    return { ...this.telemetryData };
  }

  public getActiveAlerts(): AutomatedAlert[] {
    return [...this.activeAlerts];
  }

  public getCheckinData() {
    return {
      selectedWeather: this.telemetryData.selectedWeather,
      latestDO: this.telemetryData.latestDO,
      latestTemp: this.telemetryData.latestTemp,
      latestPH: this.telemetryData.latestPH,
      turbidityNtu: this.telemetryData.turbidityNtu,
      lastUpdatedText: this.telemetryData.lastSensorSyncText,
      isPlanGenerated: this.isPlanGenerated,
      stageChangedBannerShown: this.stageChangedBannerShown,
      stockSwapConfirmed: this.stockSwapConfirmed,
    };
  }

  public getDemoState() {
    return {
      activeDemoAlertBanner: this.activeDemoAlertBanner,
      activeAlertsCount: this.activeAlerts.length,
    };
  }

  // --- OXYGEN GATE EVALUATION ---
  public evaluateOxygen(doVal: number): {
    status: OxygenStatus;
    canFeed: boolean;
    scaleFactor: number;
    title: string;
    description: string;
  } {
    const species = this.getSelectedSpecies();
    const stopLevel = species.oxygenStopLevel; // e.g. 3.0
    const fullLevel = species.oxygenFullFeedingLevel; // e.g. 5.0

    if (doVal < stopLevel) {
      return {
        status: 'Stop',
        canFeed: false,
        scaleFactor: 0,
        title: 'Safety Stop: Skip Meal Required',
        description: `Oxygen level auto-detected at ${doVal.toFixed(1)} mg/L (below ${stopLevel.toFixed(1)} mg/L threshold). Feeding blocked to prevent mortality. Alert sent to manager.`,
      };
    } else if (doVal < fullLevel) {
      return {
        status: 'Reduced',
        canFeed: true,
        scaleFactor: 0.7,
        title: 'Reduced Meal',
        description: `Oxygen level auto-detected at ${doVal.toFixed(1)} mg/L (between ${stopLevel.toFixed(1)} and ${fullLevel.toFixed(1)} mg/L). Portion scaled by -30%.`,
      };
    } else {
      return {
        status: 'Safe',
        canFeed: true,
        scaleFactor: 1.0,
        title: 'Oxygen OK',
        description: `Oxygen level auto-detected at ${doVal.toFixed(1)} mg/L (≥ ${fullLevel.toFixed(1)} mg/L target). Full ration unlocked.`,
      };
    }
  }

  // --- ACTIONS ---
  public completeOnboarding(setupData: FarmSetup) {
    const stage = this.calculateStageFromWeight(setupData.startingWeightG);
    this.farmSetup = {
      ...setupData,
      currentEstimatedWeightG: setupData.startingWeightG,
      currentStageName: stage,
    };
    this.isOnboarded = true;
    this.isPlanGenerated = true; // Automatically generate timetable plan upon setup completion!
    this.notify();
  }

  public generateTodayPlan() {
    this.isPlanGenerated = true;
    if (this.farmSetup.currentEstimatedWeightG >= 40 && !this.stageChangedBannerShown) {
      this.stageChangedBannerShown = true;
    }
    this.notify();
  }

  public updateAdviceAction(adviceId: string, action: 'Accepted' | 'Edited' | 'Dismissed') {
    this.adviceList = this.adviceList.map((a) =>
      a.id === adviceId ? { ...a, farmerAction: action } : a
    );
    this.notify();
  }

  public recordMealFed(
    mealId: string,
    actualKg: number,
    leftover: 'none' | 'a little' | 'a lot',
    options: { doAtMeal?: number; leftoverKg?: number; reason?: string; feedBatchId?: string; status?: 'Given' | 'Reduced' } = {},
  ) {
    this.meals = this.meals.map((m) => {
      if (m.id === mealId) {
        return {
          ...m,
          status: 'Given',
          actualKg,
          leftover,
          leftoverKg: options.leftoverKg ?? (leftover === 'none' ? 0 : m.leftoverKg),
          doAtMeal: options.doAtMeal ?? m.doAtMeal,
          reason: options.reason,
          feedBatchId: options.feedBatchId,
          ...(options.status ? { status: options.status } : {}),
        };
      }
      return m;
    });
    this.notify();
  }

  public recordMealSkipped(mealId: string, reason: string) {
    this.meals = this.meals.map((m) => {
      if (m.id === mealId) {
        return {
          ...m,
          status: 'Skipped',
          reason,
        };
      }
      return m;
    });
    this.notify();
  }

  public confirmStockSwap() {
    this.stockSwapConfirmed = true;
    this.meals = this.meals.map((m) => ({
      ...m,
      feedType: 'Feed Type Y (Grower 3.0mm - Stock Swap Confirmed)',
    }));
    this.notify();
  }

  public addSampleWeigh(realWeightG: number) {
    const todayStr = new Date().toISOString().split('T')[0];
    const predicted = Math.round((this.farmSetup.currentEstimatedWeightG + 4.5) * 10) / 10;
    const newRecord: SampleWeighRecord = {
      id: `w-${Date.now()}`,
      date: todayStr,
      predictedWeightG: predicted,
      realWeightG,
    };
    this.sampleWeighRecords.unshift(newRecord);
    this.farmSetup.currentEstimatedWeightG = realWeightG;
    this.farmSetup.currentStageName = this.calculateStageFromWeight(realWeightG);
    this.notify();
  }

  public dismissAlert(alertId: string) {
    this.activeAlerts = this.activeAlerts.filter((a) => a.id !== alertId);
    this.notify();
  }

  public dismissDemoBanner() {
    this.activeDemoAlertBanner = null;
    this.notify();
  }

  // --- DEMO TRIGGER ACTIONS FOR SPECIFIC ALERTS ---
  public triggerAlertCategory(category: AlertCategory) {
    const targetAlert = DEMO_ALERTS.find((a) => a.category === category);
    if (!targetAlert) return;

    // Remove existing alert of same category if present, then add to front
    this.activeAlerts = [targetAlert, ...this.activeAlerts.filter((a) => a.category !== category)];

    if (category === 'low_oxygen') {
      this.telemetryData.latestDO = 2.7; // Drop DO automatically to 2.7 mg/L
      this.telemetryData.lastSensorSyncText = 'Auto-alert triggered: DO Critical (2.7 mg/L)';
      this.activeDemoAlertBanner = `CRITICAL LOW OXYGEN: 08:00 AM session blocked. DO is 2.7 mg/L. Aerators required.`;
    } else if (category === 'water_change') {
      this.telemetryData.turbidityNtu = 85;
      this.telemetryData.lastSensorSyncText = 'Auto-alert triggered: High Turbidity & Ammonia';
      this.activeDemoAlertBanner = `WATER CHANGE ALERT: High organic load detected. 20% water exchange needed.`;
    } else if (category === 'extreme_condition') {
      this.telemetryData.latestTemp = 34.8;
      this.telemetryData.selectedWeather = 'Hot and calm';
      this.telemetryData.lastSensorSyncText = 'Auto-alert triggered: Extreme Temp (34.8°C)';
      this.activeDemoAlertBanner = `EXTREME WEATHER ALERT: Water temp 34.8°C (Hot & Calm). Reduce feed by 50%.`;
    }

    this.notify();
  }

  public restoreNormalTelemetry() {
    this.telemetryData = {
      selectedWeather: 'Sunny',
      latestDO: 5.2,
      latestTemp: 29.5,
      latestPH: 7.6,
      turbidityNtu: 24,
      lastSensorSyncText: 'Auto-updated 3 min ago via IoT Probe',
      isSensorConnected: true,
    };
    this.activeAlerts = [];
    this.activeDemoAlertBanner = null;
    this.notify();
  }

  public resetSetup() {
    this.isOnboarded = false;
    this.isPlanGenerated = false;
    this.meals = INITIAL_MEALS.map((m) => ({ ...m, status: 'Pending' }));
    this.stockSwapConfirmed = false;
    this.activeAlerts = [];
    this.activeDemoAlertBanner = null;
    this.restoreNormalTelemetry();
    this.notify();
  }
}

export const aquacultureService = new AquacultureService();
