import { BASE_SLOTS } from '../data/seed';
import type { AppState, BathQueue, QueueEntry, ServiceId } from '../types';

/* ---------- 날짜/시간 ---------- */

const pad = (n: number) => String(n).padStart(2, '0');

export const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => toDateStr(new Date());

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const fromMin = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

export const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
export const formatDate = (s: string) => {
  const d = parseDate(s);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${DOW[d.getDay()]})`;
};
export const formatDateDots = (s: string) => (s ? s.replace(/-/g, '.') : '');
export const formatTimeKo = (hhmm: string) => {
  const m = toMin(hhmm);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${h12}시${mm ? ` ${mm}분` : ''}`;
};
export const formatClock = (ts: number | string) => {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
export const pad3 = (n: number) => String(n).padStart(3, '0');
export const DOW_LABELS = DOW;

/* ---------- 혼잡도 ---------- */

export type CrowdLevel = 'available' | 'moderate' | 'busy' | 'very_busy';

export const CROWD_META: Record<CrowdLevel, { label: string; dot: string; text: string; bg: string; bar: string; emoji: string }> = {
  available: { label: '여유', dot: 'bg-ok', text: 'text-ok-dark', bg: 'bg-ok-light', bar: 'bg-ok', emoji: '🟢' },
  moderate: { label: '보통', dot: 'bg-butter', text: 'text-warn-dark', bg: 'bg-butter-light', bar: 'bg-butter', emoji: '🟡' },
  busy: { label: '혼잡', dot: 'bg-warn', text: 'text-warn-dark', bg: 'bg-warn-light', bar: 'bg-warn', emoji: '🟠' },
  very_busy: { label: '매우 혼잡', dot: 'bg-danger', text: 'text-danger-dark', bg: 'bg-danger-light', bar: 'bg-danger', emoji: '🔴' },
};

/** 0~40% 여유 · 41~70% 보통 · 71~99% 혼잡 · 100%+ 매우 혼잡 */
export function crowd(current: number, recommended: number) {
  const pct = recommended > 0 ? Math.round((current / recommended) * 100) : 0;
  const level: CrowdLevel = pct <= 40 ? 'available' : pct <= 70 ? 'moderate' : pct < 100 ? 'busy' : 'very_busy';
  return { pct, level, ...CROWD_META[level] };
}

/** 06시~23시 그래프에서 현재 이후 가장 여유로운 시간대 */
export function quietHours(hourly: number[], capacity: number, fromHour: number) {
  return hourly
    .map((v, i) => ({ hour: 6 + i, v }))
    .filter((x) => x.hour > fromHour && x.v > 0)
    .filter((x) => crowd(x.v, capacity).level === 'available' || crowd(x.v, capacity).level === 'moderate')
    .sort((a, b) => a.v - b.v)
    .slice(0, 2)
    .sort((a, b) => a.hour - b.hour);
}

/* ---------- 세신 예약 슬롯 ---------- */

/** 다른 고객의 예약(시연용 시뮬레이션). 결정적으로 생성되며 앱 상태에는 저장하지 않는다. */
export function externalBookings(scrubberId: string, date: string): { time: string; dur: number }[] {
  let h = 0;
  for (const c of scrubberId + date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const extra = ['10:00', '17:00', '18:00'][h % 3];
  return [
    { time: '11:20', dur: 40 },
    { time: extra, dur: 30 },
  ];
}

export type SlotReason = 'available' | 'mine' | 'booked' | 'overlap' | 'break' | 'past' | 'paused' | 'off' | 'limit';

export const SLOT_LABEL: Record<SlotReason, string> = {
  available: '예약 가능',
  mine: '내 예약',
  booked: '예약 마감',
  overlap: '앞뒤 예약과 겹침',
  break: '휴식시간',
  past: '지난 시간',
  paused: '예약 중단',
  off: '휴무일',
  limit: '일일 한도 도달',
};

const overlaps = (aS: number, aE: number, bS: number, bE: number) => aS < bE && bS < aE;

export function activeReservations(state: AppState, scrubberId: string, date: string) {
  return state.reservations.filter(
    (r) => r.scrubberId === scrubberId && r.date === date && (r.status === 'confirmed' || r.status === 'in_service' || r.status === 'completed'),
  );
}

export function slotStatus(state: AppState, scrubberId: string, date: string, time: string, serviceId: ServiceId = 'basic', now = new Date()): SlotReason {
  const scrubber = state.scrubbers.find((s) => s.id === scrubberId);
  const settings = state.scrubberSettings[scrubberId];
  if (!scrubber || !settings) return 'off';
  if (!scrubber.workDays.includes(parseDate(date).getDay())) return 'off';

  const start = toMin(time);
  const dur = settings.durations[serviceId] ?? 30;
  const end = start + dur;

  const mine = activeReservations(state, scrubberId, date);
  if (mine.some((r) => r.time === time)) return 'mine';

  const ext = externalBookings(scrubberId, date);
  if (ext.some((b) => b.time === time)) return 'booked';

  if (date === toDateStr(now) && start <= now.getHours() * 60 + now.getMinutes()) return 'past';
  if (date < toDateStr(now)) return 'past';
  if (settings.paused) return 'paused';
  if (settings.breaks.some((b) => overlaps(start, end, toMin(b.start), toMin(b.end)))) return 'break';

  const all = [...mine.map((r) => ({ s: toMin(r.time), e: toMin(r.time) + r.durationMinutes })), ...ext.map((b) => ({ s: toMin(b.time), e: toMin(b.time) + b.dur }))];
  if (all.some((b) => overlaps(start, end, b.s, b.e))) return 'overlap';
  if (mine.length + ext.length >= settings.dailyLimit) return 'limit';
  return 'available';
}

export function daySlots(state: AppState, scrubberId: string, date: string, serviceId: ServiceId = 'basic', now = new Date()) {
  return BASE_SLOTS.map((time) => ({ time, reason: slotStatus(state, scrubberId, date, time, serviceId, now) }));
}

export function scrubbersAt(state: AppState, bathId: string) {
  return state.scrubbers.filter((s) => s.bathhouseIds.includes(bathId));
}

/* ---------- 현장 대기 ---------- */

export const activeEntry = (q: BathQueue) => q.entries.find((e) => e.status === 'called' || e.status === 'in_service');
export const waitingList = (q: BathQueue) => q.entries.filter((e) => e.status === 'waiting');
export const heldList = (q: BathQueue) => q.entries.filter((e) => e.status === 'held');
export const myEntries = (q: BathQueue) => q.entries.filter((e) => e.isMine);

export function currentNumber(q: BathQueue) {
  const a = activeEntry(q);
  if (a) return a.number;
  const done = q.entries.filter((e) => e.status === 'done');
  return done.length ? done[done.length - 1].number : 0;
}

export function aheadInfo(q: BathQueue, entry: QueueEntry) {
  if (entry.status !== 'waiting') return { ahead: 0, minutes: 0 };
  const w = waitingList(q);
  const idx = w.findIndex((e) => e.number === entry.number);
  const before = w.slice(0, Math.max(0, idx));
  return { ahead: before.length, minutes: before.reduce((s, e) => s + e.durationMinutes, 0) };
}

export type Phase = '대기 중' | '곧 차례' | '호출 중' | '서비스 진행' | '완료' | '순서 보류' | '취소됨';
export const PHASES: Phase[] = ['대기 중', '곧 차례', '호출 중', '서비스 진행', '완료'];

export function phaseOf(q: BathQueue, e: QueueEntry): Phase {
  switch (e.status) {
    case 'waiting':
      return aheadInfo(q, e).ahead <= 1 ? '곧 차례' : '대기 중';
    case 'called':
      return '호출 중';
    case 'in_service':
      return '서비스 진행';
    case 'done':
      return '완료';
    case 'held':
      return '순서 보류';
    default:
      return '취소됨';
  }
}

/** 호출 후 응답 없음 판정 기준 (시연용 30초) */
export const NO_RESPONSE_MS = 30_000;
