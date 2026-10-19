export interface EstimatorState {
  type?: string; vertical?: string; volume?: string; structured?: string;
  exclusive?: string; licensedBefore?: string; updated?: string; domain?: string;
  taskCount?: string; graders?: string; headless?: string; hours?: string; angles?: string; releases?: string;
  hasVideo?: string; format?: string; owned?: string; capture?: string; futureCapture?: string;
  name: string; company: string; email: string; phone: string; systems: string[];
  companySize?: string; years?: string; coreSystem?: string; coreYears?: string;
  exportReadiness?: string; provenance?: string; systemHistory?: Record<string, number>;
  otherSystems?: string;
  referredBy?: string;
}
export interface Attribution {
  code: string; email: string; firstSeenAt: string; expiresAt: string;
  mechanism: string; verified: boolean;
}
export type Factor = [name: string, value: number, kind?: "money"];
export interface WebhookPayload {
  form: string; name: string; company: string; email: string; phone: string;
  vertical: string; volume: string; labeled: string; exclusive: string; licensedBefore: string;
  valuationLow: number; valuationHigh: number; ref: string; message: string;
  referredBy?: string;
}
