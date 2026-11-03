export type Region = '서울' | '경기' | '인천' | '부산' | '대구' | '기타';

export type CategoryTag = 'scrub_best' | 'clean' | 'jjim_variety' | 'quiet' | 'women' | 'late';

export type WaterTestResult = '적합' | '부적합' | '미확인';

export interface Hygiene {
  /** 수질검사 결과 */
  waterTestResult: WaterTestResult;
  /** YYYY-MM-DD or '' */
  waterTestDate: string;
  /** 검사 주체 (예: 지자체, 사업장 자체) */
  waterTestAgency: string;
  /** 증빙 서류 확인 여부 */
  waterTestEvidence: boolean;
  /** 최근 물 교체 (자유 텍스트, '' = 정보 없음) */
  lastWaterChange: string;
  /** 다음 청소 예정 ('' = 정보 없음) */
  nextCleaning: string;
  /** ISO timestamp of last update */
  updatedAt: string;
}

export interface Bathhouse {
  id: string;
  name: string;
  region: Region;
  address: string;
  price: number;
  openingHours: string;
  type: string;
  description: string;
  facilities: string[];
  services: string[];
  tags: CategoryTag[];
  scrubReservation: boolean;
  rating: number;
  /** 쾌적 기준 방문객 수 (시설 전체 혼잡도 계산용, 프로토타입 설정값) */
  comfortCapacity: number;
  currentVisitors: number;
  /** 06시~23시 시간대별 예상 방문객 (시뮬레이션) */
  hourly: number[];
  hygiene: Hygiene;
  palette: [string, string];
  isDemo: true;
}

export type ServiceId = 'basic' | 'cucumber' | 'massage' | 'premium';

export interface ServiceDef {
  id: ServiceId;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Scrubber {
  id: string;
  name: string;
  career: number;
  section: '남탕' | '여탕';
  specialties: string[];
  services: ServiceId[];
  bathhouseIds: string[];
  workDays: number[]; // 0=Sun
  reviewSummary: string;
  reviewScore: number;
  reviewCount: number;
  emoji: string;
  isDemo: true;
}

export interface ScrubberSettings {
  breaks: { start: string; end: string }[];
  paused: boolean;
  dailyLimit: number;
  durations: Record<ServiceId, number>;
}

export type ReservationStatus = 'confirmed' | 'in_service' | 'completed' | 'cancelled';

export interface Reservation {
  reservationId: string;
  bathhouseId: string;
  scrubberId: string;
  serviceId: ServiceId;
  service: string;
  price: number;
  durationMinutes: number;
  date: string;
  time: string;
  status: ReservationStatus;
  paymentStatus: 'pay_on_site';
  createdAt: string;
  reminded?: boolean;
}

export type QueueStatus = 'waiting' | 'called' | 'in_service' | 'done' | 'held' | 'cancelled';

export interface QueueEntry {
  number: number;
  serviceId: ServiceId;
  service: string;
  durationMinutes: number;
  scrubberPref: string | null;
  status: QueueStatus;
  isMine: boolean;
  calledAt?: number;
  callCount?: number;
  responded?: boolean;
  createdAt: number;
  lastPhase?: string;
}

export interface QueueLog {
  at: number;
  text: string;
}

export interface BathQueue {
  lastIssued: number;
  entries: QueueEntry[];
  log: QueueLog[];
}

export interface Room {
  roomId: string;
  bathhouseId: string;
  name: string;
  emoji: string;
  temp: string;
  currentOccupancy: number;
  recommendedOccupancy: number;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  at: number;
  title: string;
  body: string;
  read: boolean;
  link?: string;
}

export interface AppState {
  version: number;
  region: Region;
  favorites: string[];
  bathhouses: Bathhouse[];
  scrubbers: Scrubber[];
  scrubberSettings: Record<string, ScrubberSettings>;
  reservations: Reservation[];
  queues: Record<string, BathQueue>;
  rooms: Room[];
  notifications: AppNotification[];
}
