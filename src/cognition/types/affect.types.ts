export interface AffectiveAxis {
  value: number;   // 0..1
  trend: number;   // -1..1 (derivada temporal)
}

export interface AffectiveVector {
  calm: AffectiveAxis;
  curiosity: AffectiveAxis;
  threat: AffectiveAxis;
  cohesion: AffectiveAxis;
}
