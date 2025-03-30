export type Language = 'en' | 'ru';

export type Answer = {
  [key in Language]: string;
}

export type AnswerGroups = Answer[];

export interface ShakeConfig {
  threshold: number;     // Acceleration threshold
  timeout: number;       // Minimum time between shakes
}

export interface ShakeData {
  x: number;
  y: number;
  z: number;
  lastTime: number;
}