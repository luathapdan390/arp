// FIX: Import `React` to make its types available in this file.
import type React from 'react';

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  timeRemaining: number;
  isActive: boolean;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ChartData {
  name: string;
  minutes: number;
}

export interface TaskProjection {
  title: string;
  minutes: number;
  dailyPrincipal: number;
  futureValue: number;
}

export interface CalculationResult {
  totalMinutes: number;
  dailyPrincipal: number; // Net daily principal
  futureValue: number; // Net future value
  isLoss: boolean;
  chartData: ChartData[];
  projections: TaskProjection[];
}