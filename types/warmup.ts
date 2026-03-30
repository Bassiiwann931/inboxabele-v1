export interface WeeklyPlan {
  week: number;
  dailyVolume: number;
  totalVolume: number;
  minOpenRate: number;
  segments: string;
  focus: string;
  warning?: string;
}

export interface IspTips {
  gmail: string;
  outlook: string;
  yahoo: string;
}

export interface WarmupStrategy {
  summary: string;
  duration: string;
  keyRules: string[];
  weeklyPlan: WeeklyPlan[];
  ispTips: IspTips;
  redFlags: string[];
  successMetrics: string[];
}

export interface WarmupFormData {
  domainHistory: string;
  listSize: string;
  listAge: string;
  engagementLevel: string;
  esp: string;
  dailyVolumeTarget: string;
  useCase: string;
  industry: string;
  ispMix: string;
  previousIssues: string;
}
