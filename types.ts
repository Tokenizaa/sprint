export type SlideLayout = 'cover' | 'standard' | 'columns' | 'conclusion';

export interface SlidePoint {
  title: string;
  description?: string;
  highlight?: boolean;
}

export interface SlideData {
  id: number;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  points: SlidePoint[];
  theme?: 'dark' | 'light';
}

export type Role = 'admin' | 'distributor';

export interface User {
  id: string;
  name: string;
  whatsapp: string;
  role: Role;
  createdAt: string;
}

export type LogType = 'presential' | 'online' | 'mixed';

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  pairsSold: number; // Self-reported
  prospectsContacted: number;
  activations: number;
  type: LogType;
}

export interface OfficialSale {
  id: string;
  distributorId: string;
  quantity: number;
  date: string;
  timestamp: number;
}

export interface TeamMember {
  id: string;
  name: string;
  totalOfficialSales: number; // Confirmed by Admin
  selfReportedSales: number;  // From Daily Logs
  score: number;
  isCurrentUser: boolean;
}

export interface CalculatorState {
  pairsPerDay: number;
  profitPerPair: number;
  daysRemaining: number;
  totalPotential: number;
}

// Service response types
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface DataResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GreetingResult {
  greeting: string;
  language: string;
  style: string;
  explanation: string;
}