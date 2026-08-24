/**
 * RelativeTime Plugin Types
 */

export interface RelativeTimeConfig {
  thresholds?: RelativeTimeThreshold[];
  rounding?: (value: number) => number;
}

export interface RelativeTimeThreshold {
  l: string; // label
  r?: number; // range
  d?: string; // duration unit
}

export interface RelativeTimeFormats {
  future: string;
  past: string;
  s: string;
  m: string;
  mm: string;
  h: string;
  hh: string;
  d: string;
  dd: string;
  M: string;
  MM: string;
  y: string;
  yy: string;
}
