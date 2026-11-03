import type { AppState, Bathhouse, BathQueue, Room, Scrubber, ScrubberSettings, ServiceDef, ServiceId } from '../types';

export const STATE_VERSION = 1;

export const REGIONS = ['서울', '경기', '인천', '부산', '대구', '기타'] as const;

export const FACILITY_OPTIONS = ['온탕', '냉탕', '건식 사우나', '습식 사우나', '황토방', '소금방', '편백방', '얼음방', '수면실', '식당'];
export const SERVICE_OPTIONS = ['세신', '마사지', '피부관리', '여성전용', '남성전용', '주차 가능', '24시간 운영'];

export const CATEGORIES = [
  { tag: 'scrub_best', label: '세신 잘하는 곳', emoji: '🧽' },
  { tag: 'clean', label: '시설이 깨끗한 곳', emoji: '✨' },
  { tag: 'jjim_variety', label: '찜질방이 다양한 곳', emoji: '🔥' },
  { tag: 'quiet', label: '조용하게 쉴 수 있는 곳', emoji: '🌙' },
  { tag: 'women', label: '여성전용 목욕탕', emoji: '🌸' },
  { tag: 'late', label: '늦게까지 운영하는 곳', emoji: '🕚' },
] as const;

export const SERVICES: ServiceDef[] = [
  { id: 'basic', name: '기본 세신', price: 35000, durationMinutes: 30 },
  { id: 'cucumber', name: '세신 + 오이팩', price: 40000, durationMinutes: 40 },
  { id: 'massage', name: '세신 + 마사지', price: 55000, durationMinutes: 60 },
  { id: 'premium', name: '프리미엄 세신', price: 65000, durationMinutes: 70 },
];

export const serviceById = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;

/** 세신사 기본 예약 슬롯 */
export const BASE_SLOTS = ['10:00', '10:40', '11:20', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const HOURS_TEMPLATE = (peak: number, shape: number[]) => shape.map((r) => Math.round(r * peak));
// 06시 ~ 23시 (18칸)
const WEEKDAY_SHAPE = [0.3, 0.45, 0.5, 0.45, 0.4, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.85, 1, 0.95, 0.8, 0.55, 0.3];

const bathhouses: Bathhouse[] = [
  {
    id: 'bath_001',
    name: '멜팅 스파랜드',
    region: '경기',
    address: '경기도 가상시 멜팅로 12 (시연용 가상 주소)',
    price: 12000,
    openingHours: '06:00-23:00',
    type: '대형 사우나 · 찜질방',
    description: '넓은 대형 온탕과 4가지 테마 찜질방을 갖춘 가족형 스파. 세신 예약과 현장 대기를 모두 지원합니다.',
    facilities: ['온탕', '냉탕', '건식 사우나', '습식 사우나', '황토방', '소금방', '편백방', '얼음방', '수면실', '식당'],
    services: ['세신', '마사지', '주차 가능'],
    tags: ['scrub_best', 'clean', 'jjim_variety'],
    scrubReservation: true,
    rating: 4.7,
    comfortCapacity: 150,
    currentVisitors: 86,
    hourly: HOURS_TEMPLATE(140, WEEKDAY_SHAPE),
    hygiene: {
      waterTestResult: '적합',
      waterTestDate: '2026-10-20',
      waterTestAgency: '지자체',
      waterTestEvidence: true,
      lastWaterChange: '오늘 오전 5시',
      nextCleaning: '오후 11시',
      updatedAt: '',
    },
    palette: ['#F28C78', '#F7D78B'],
    isDemo: true,
  },
  {
    id: 'bath_002',
    name: '햄햄 온천사우나',
    region: '서울',
    address: '서울특별시 가상구 포근길 8 (시연용 가상 주소)',
    price: 10000,
    openingHours: '05:30-22:00',
    type: '동네 목욕탕 · 사우나',
    description: '조용한 분위기의 동네 사우나. 매일 아침 물을 교체하고 교체 시간을 공개합니다.',
    facilities: ['온탕', '냉탕', '건식 사우나', '습식 사우나', '식당'],
    services: ['세신', '피부관리', '남성전용', '주차 가능'],
    tags: ['clean', 'quiet'],
    scrubReservation: true,
    rating: 4.5,
    comfortCapacity: 60,
    currentVisitors: 21,
    hourly: HOURS_TEMPLATE(55, [0.6, 0.8, 0.7, 0.5, 0.4, 0.35, 0.3, 0.3, 0.35, 0.4, 0.5, 0.65, 0.8, 0.9, 0.7, 0.4, 0, 0]),
    hygiene: {
      waterTestResult: '적합',
      waterTestDate: '2026-09-28',
      waterTestAgency: '사업장 자체',
      waterTestEvidence: false,
      lastWaterChange: '오늘 오전 4시 30분',
      nextCleaning: '오후 10시',
      updatedAt: '',
    },
    palette: ['#78B99A', '#FFF5E9'],
    isDemo: true,
  },
  {
    id: 'bath_003',
    name: '달빛 24 찜질스파',
    region: '인천',
    address: '인천광역시 가상구 달빛대로 240 (시연용 가상 주소)',
    price: 15000,
    openingHours: '24시간',
    type: '24시간 찜질방',
    description: '밤에도 쉬어갈 수 있는 24시간 찜질스파. 수면실과 다양한 찜질방을 운영합니다.',
    facilities: ['온탕', '냉탕', '건식 사우나', '황토방', '소금방', '얼음방', '수면실', '식당'],
    services: ['마사지', '주차 가능', '24시간 운영'],
    tags: ['jjim_variety', 'late'],
    scrubReservation: false,
    rating: 4.2,
    comfortCapacity: 200,
    currentVisitors: 132,
    hourly: HOURS_TEMPLATE(190, [0.3, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.85, 0.95, 1, 1, 0.95, 0.85, 0.75]),
    hygiene: {
      waterTestResult: '적합',
      waterTestDate: '2026-08-14',
      waterTestAgency: '지자체',
      waterTestEvidence: true,
      lastWaterChange: '',
      nextCleaning: '오전 4시',
      updatedAt: '',
    },
    palette: ['#6C6AA8', '#F7D78B'],
    isDemo: true,
  },
  {
    id: 'bath_004',
    name: '포근 여성사우나',
    region: '서울',
    address: '서울특별시 가상구 편백로 31 (시연용 가상 주소)',
    price: 11000,
    openingHours: '07:00-21:00',
    type: '여성전용 사우나',
    description: '여성 고객만을 위한 아늑한 사우나. 편백방과 피부관리실을 운영합니다.',
    facilities: ['온탕', '냉탕', '습식 사우나', '편백방', '수면실'],
    services: ['세신', '피부관리', '여성전용'],
    tags: ['women', 'quiet', 'scrub_best'],
    scrubReservation: true,
    rating: 4.8,
    comfortCapacity: 45,
    currentVisitors: 17,
    hourly: HOURS_TEMPLATE(42, [0, 0.4, 0.55, 0.7, 0.75, 0.6, 0.55, 0.6, 0.7, 0.8, 0.85, 0.75, 0.6, 0.45, 0.3, 0, 0, 0]),
    hygiene: {
      waterTestResult: '적합',
      waterTestDate: '2026-10-05',
      waterTestAgency: '지자체',
      waterTestEvidence: true,
      lastWaterChange: '오늘 오전 6시',
      nextCleaning: '오후 9시 30분',
      updatedAt: '',
    },
    palette: ['#E9A2B4', '#FFF5E9'],
    isDemo: true,
  },
  {
    id: 'bath_005',
    name: '바다향 해수탕',
    region: '부산',
    address: '부산광역시 가상구 해변로 5 (시연용 가상 주소)',
    price: 9000,
    openingHours: '05:00-24:00',
    type: '해수탕',
    description: '바닷물을 데운 해수탕. 세신은 현장 접수로만 운영하며 온라인 예약은 지원하지 않습니다.',
    facilities: ['온탕', '냉탕', '건식 사우나', '소금방', '식당'],
    services: ['세신', '주차 가능'],
    tags: ['late'],
    scrubReservation: false,
    rating: 4.3,
    comfortCapacity: 90,
    currentVisitors: 74,
    hourly: HOURS_TEMPLATE(85, [0.7, 0.85, 0.8, 0.6, 0.5, 0.45, 0.4, 0.45, 0.5, 0.55, 0.65, 0.8, 0.9, 0.85, 0.7, 0.5, 0.35, 0.25]),
    hygiene: {
      waterTestResult: '미확인',
      waterTestDate: '',
      waterTestAgency: '',
      waterTestEvidence: false,
      lastWaterChange: '',
      nextCleaning: '',
      updatedAt: '',
    },
    palette: ['#5BA4C9', '#FFF5E9'],
    isDemo: true,
  },
];

const scrubbers: Scrubber[] = [
  {
    id: 'staff_001',
    name: '김 세신사',
    career: 12,
    section: '남탕',
    specialties: ['일반 세신', '오이팩 세신'],
    services: ['basic', 'cucumber'],
    bathhouseIds: ['bath_001', 'bath_002'],
    workDays: [0, 1, 2, 3, 4, 5, 6],
    reviewSummary: '“꼼꼼하고 힘 조절을 잘 물어봐 주세요.”',
    reviewScore: 4.8,
    reviewCount: 128,
    emoji: '🧔',
    isDemo: true,
  },
  {
    id: 'staff_002',
    name: '박 세신사',
    career: 8,
    section: '여탕',
    specialties: ['일반 세신', '마사지 세신'],
    services: ['basic', 'massage'],
    bathhouseIds: ['bath_001'],
    workDays: [0, 2, 3, 4, 5, 6],
    reviewSummary: '“마사지가 시원하고 대화가 편안해요.”',
    reviewScore: 4.7,
    reviewCount: 86,
    emoji: '👩',
    isDemo: true,
  },
  {
    id: 'staff_003',
    name: '이 세신사',
    career: 15,
    section: '여탕',
    specialties: ['일반 세신', '프리미엄 세신'],
    services: ['basic', 'cucumber', 'premium'],
    bathhouseIds: ['bath_001', 'bath_004'],
    workDays: [0, 1, 2, 3, 5, 6],
    reviewSummary: '“프리미엄 코스는 꼭 받아보세요. 피부가 달라요.”',
    reviewScore: 4.9,
    reviewCount: 203,
    emoji: '👵',
    isDemo: true,
  },
];

const defaultDurations = (): Record<ServiceId, number> => ({ basic: 30, cucumber: 40, massage: 60, premium: 70 });

const scrubberSettings: Record<string, ScrubberSettings> = Object.fromEntries(
  scrubbers.map((s) => [s.id, { breaks: [{ start: '12:00', end: '13:00' }], paused: false, dailyLimit: 9, durations: defaultDurations() }]),
);

const now = () => new Date().toISOString();

const room = (roomId: string, bathhouseId: string, name: string, emoji: string, temp: string, cur: number, rec: number): Room => ({
  roomId, bathhouseId, name, emoji, temp, currentOccupancy: cur, recommendedOccupancy: rec, updatedAt: now(),
});

const rooms: Room[] = [
  room('room_001', 'bath_001', '황토방', '🟤', '65℃', 4, 12),
  room('room_002', 'bath_001', '소금방', '🧂', '58℃', 9, 12),
  room('room_003', 'bath_001', '편백방', '🌲', '55℃', 6, 10),
  room('room_004', 'bath_001', '얼음방', '🧊', '4℃', 2, 8),
  room('room_101', 'bath_003', '황토방', '🟤', '68℃', 7, 15),
  room('room_102', 'bath_003', '소금방', '🧂', '60℃', 3, 10),
  room('room_103', 'bath_003', '얼음방', '🧊', '3℃', 5, 6),
  room('room_201', 'bath_004', '편백방', '🌲', '52℃', 3, 8),
  room('room_301', 'bath_005', '소금방', '🧂', '57℃', 2, 8),
];

const mkQueue = (current: number, waiting: number): BathQueue => {
  const entries: BathQueue['entries'] = [];
  const t = Date.now() - 30 * 60 * 1000;
  entries.push({ number: current, serviceId: 'basic', service: '기본 세신', durationMinutes: 30, scrubberPref: null, status: 'in_service', isMine: false, createdAt: t });
  for (let i = 1; i <= waiting; i++) {
    entries.push({ number: current + i, serviceId: 'basic', service: '기본 세신', durationMinutes: 30, scrubberPref: null, status: 'waiting', isMine: false, createdAt: t + i * 60000 });
  }
  return { lastIssued: current + waiting, entries, log: [] };
};

export function createSeedState(): AppState {
  const ts = now();
  return {
    version: STATE_VERSION,
    region: '경기',
    favorites: [],
    bathhouses: bathhouses.map((b) => ({ ...b, hygiene: { ...b.hygiene, updatedAt: b.hygiene.waterTestResult === '미확인' ? '' : ts } })),
    scrubbers: structuredClone(scrubbers),
    scrubberSettings: structuredClone(scrubberSettings),
    reservations: [],
    queues: {
      bath_001: mkQueue(12, 3),
      bath_002: mkQueue(5, 1),
      bath_004: mkQueue(7, 2),
    },
    rooms: structuredClone(rooms),
    notifications: [],
  };
}
