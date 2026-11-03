import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createSeedState, serviceById, STATE_VERSION } from './data/seed';
import { activeEntry, aheadInfo, formatDate, formatTimeKo, pad3, phaseOf, slotStatus, toMin, todayStr, waitingList } from './lib/logic';
import type { AppState, Bathhouse, BathQueue, Hygiene, Region, Reservation, Room, Scrubber, ScrubberSettings, ServiceId } from './types';

const STORAGE_KEY = 'meltingham:state';

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed.version === STATE_VERSION) return parsed;
    }
  } catch {
    /* 저장소 접근 불가 시 초기 데이터로 시작 */
  }
  return createSeedState();
}

const uid = (p: string) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function pushNotice(d: AppState, title: string, body: string, link?: string) {
  d.notifications.unshift({ id: uid('ntf'), at: Date.now(), title, body, read: false, link });
  d.notifications = d.notifications.slice(0, 40);
}

function log(q: BathQueue, text: string) {
  q.log.unshift({ at: Date.now(), text });
  q.log = q.log.slice(0, 30);
}

/** 내 대기표의 단계가 바뀌면 웹앱 내부 알림을 만든다 */
function syncMyPhases(d: AppState, bathId: string) {
  const q = d.queues[bathId];
  const bath = d.bathhouses.find((b) => b.id === bathId);
  if (!q || !bath) return;
  for (const e of q.entries) {
    if (!e.isMine) continue;
    const phase = phaseOf(q, e);
    if (phase === e.lastPhase) continue;
    e.lastPhase = phase;
    const no = `${pad3(e.number)}번`;
    const link = `/queue/${bathId}`;
    if (phase === '곧 차례') pushNotice(d, `곧 ${no} 차례예요`, `${bath.name} · 앞 대기 ${aheadInfo(q, e).ahead}명. 세신대 근처로 이동해 주세요.`, link);
    if (phase === '호출 중') pushNotice(d, `${no} 호출 중!`, `${bath.name} 세신대로 와주세요.`, link);
    if (phase === '서비스 진행') pushNotice(d, `${no} 서비스 시작`, `${e.service} 진행 중입니다.`, link);
    if (phase === '완료') pushNotice(d, `${no} 서비스 완료`, '오늘도 개운한 하루 되세요 🐹', link);
    if (phase === '순서 보류') pushNotice(d, `${no} 순서가 보류되었어요`, '호출에 응답이 없어 순서가 보류되었습니다. 세신대에 문의해 주세요.', link);
  }
}

function callNext(d: AppState, bathId: string) {
  const q = d.queues[bathId];
  const next = waitingList(q)[0];
  if (next) {
    next.status = 'called';
    next.calledAt = Date.now();
    next.callCount = 1;
    next.responded = false;
    log(q, `${pad3(next.number)}번 호출`);
  }
}

export type BookInput = { bathhouseId: string; scrubberId: string; serviceId: ServiceId; date: string; time: string };

function useStoreValue() {
  const [state, setState] = useState<AppState>(load);
  const stateRef = useRef(state);
  stateRef.current = state;
  const lastWritten = useRef<string>('');

  // LocalStorage 저장
  useEffect(() => {
    const s = JSON.stringify(state);
    if (s === lastWritten.current) return;
    lastWritten.current = s;
    try {
      localStorage.setItem(STORAGE_KEY, s);
    } catch {
      /* ignore */
    }
  }, [state]);

  // 같은 브라우저의 다른 탭(입구 디스플레이, 관리자 화면)과 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const next = JSON.parse(e.newValue) as AppState;
        lastWritten.current = e.newValue;
        setState(next);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const mutate = useCallback((fn: (d: AppState) => void) => {
    setState((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  }, []);

  const reload = useCallback(() => setState(load()), []);

  // 예약 10분 전 알림 (자동)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const today = todayStr();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const due = stateRef.current.reservations.filter(
        (r) => r.status === 'confirmed' && !r.reminded && r.date === today && toMin(r.time) - nowMin <= 10 && toMin(r.time) - nowMin > 0,
      );
      if (due.length) {
        mutate((d) => {
          for (const r of d.reservations) {
            if (due.some((x) => x.reservationId === r.reservationId) && !r.reminded) {
              r.reminded = true;
              pushNotice(d, '세신 예약 10분 전이에요', `${formatTimeKo(r.time)} ${r.service} · 세신대로 이동해 주세요.`, '/my');
            }
          }
        });
      }
    };
    tick();
    const t = setInterval(tick, 20_000);
    return () => clearInterval(t);
  }, [mutate]);

  const actions = useMemo(
    () => ({
      reload,
      resetDemo: () => setState(createSeedState()),
      setRegion: (region: Region) => mutate((d) => void (d.region = region)),
      toggleFavorite: (id: string) =>
        mutate((d) => {
          d.favorites = d.favorites.includes(id) ? d.favorites.filter((f) => f !== id) : [...d.favorites, id];
        }),

      /* ----- 예약 ----- */
      book: (input: BookInput): { ok: true; id: string } | { ok: false; reason: string } => {
        const s = stateRef.current;
        const reason = slotStatus(s, input.scrubberId, input.date, input.time, input.serviceId);
        if (reason !== 'available') return { ok: false, reason };
        const id = uid('res');
        const svc = serviceById(input.serviceId);
        const dur = s.scrubberSettings[input.scrubberId]?.durations[input.serviceId] ?? svc.durationMinutes;
        mutate((d) => {
          // 중복 예약 방지: 최신 상태 기준 재검증
          if (slotStatus(d, input.scrubberId, input.date, input.time, input.serviceId) !== 'available') return;
          const r: Reservation = {
            reservationId: id,
            bathhouseId: input.bathhouseId,
            scrubberId: input.scrubberId,
            serviceId: input.serviceId,
            service: svc.name,
            price: svc.price,
            durationMinutes: dur,
            date: input.date,
            time: input.time,
            status: 'confirmed',
            paymentStatus: 'pay_on_site',
            createdAt: new Date().toISOString(),
          };
          d.reservations.unshift(r);
          const bath = d.bathhouses.find((b) => b.id === input.bathhouseId);
          pushNotice(d, '세신 예약이 확정되었어요', `${bath?.name} · ${formatDate(input.date)} ${formatTimeKo(input.time)} · 현장 결제 예정`, '/my');
        });
        return { ok: true, id };
      },
      cancelReservation: (id: string) =>
        mutate((d) => {
          const r = d.reservations.find((x) => x.reservationId === id);
          if (!r || r.status !== 'confirmed') return;
          r.status = 'cancelled';
          pushNotice(d, '예약이 취소되었어요', `${formatDate(r.date)} ${formatTimeKo(r.time)} 시간대가 다시 열렸습니다.`, '/my');
        }),
      setReservationStatus: (id: string, status: Reservation['status']) =>
        mutate((d) => {
          const r = d.reservations.find((x) => x.reservationId === id);
          if (!r) return;
          r.status = status;
          if (status === 'in_service') pushNotice(d, '세신 서비스가 시작되었어요', `${r.service} · ${formatTimeKo(r.time)}`, '/my');
          if (status === 'completed') pushNotice(d, '세신 서비스 완료', '이용해 주셔서 감사합니다 🐹', '/my');
        }),
      remindNow: (id: string) =>
        mutate((d) => {
          const r = d.reservations.find((x) => x.reservationId === id);
          if (!r) return;
          r.reminded = true;
          pushNotice(d, '[시뮬레이션] 세신 예약 10분 전이에요', `${formatDate(r.date)} ${formatTimeKo(r.time)} ${r.service} · 세신대로 이동해 주세요.`, '/my');
        }),

      /* ----- 현장 대기 ----- */
      joinQueue: (bathId: string, serviceId: ServiceId, scrubberPref: string | null) => {
        const q0 = stateRef.current.queues[bathId];
        const number = (q0?.lastIssued ?? 0) + 1;
        mutate((d) => {
          if (!d.queues[bathId]) d.queues[bathId] = { lastIssued: 0, entries: [], log: [] };
          const q = d.queues[bathId];
          if (q.entries.some((e) => e.isMine && (e.status === 'waiting' || e.status === 'called' || e.status === 'held'))) return;
          const svc = serviceById(serviceId);
          const dur = scrubberPref ? (d.scrubberSettings[scrubberPref]?.durations[serviceId] ?? svc.durationMinutes) : svc.durationMinutes;
          q.lastIssued += 1;
          q.entries.push({ number: q.lastIssued, serviceId, service: svc.name, durationMinutes: dur, scrubberPref, status: 'waiting', isMine: true, createdAt: Date.now() });
          log(q, `${pad3(q.lastIssued)}번 현장 대기 등록 (앱)`);
          const e = q.entries[q.entries.length - 1];
          e.lastPhase = phaseOf(q, e);
          const bath = d.bathhouses.find((b) => b.id === bathId);
          pushNotice(d, `대기번호 ${pad3(e.number)}번 발급`, `${bath?.name} · 앞 대기 ${aheadInfo(q, e).ahead}명`, `/queue/${bathId}`);
          if (!activeEntry(q)) callNext(d, bathId);
          syncMyPhases(d, bathId);
        });
        return number;
      },
      addWalkIn: (bathId: string) =>
        mutate((d) => {
          if (!d.queues[bathId]) d.queues[bathId] = { lastIssued: 0, entries: [], log: [] };
          const q = d.queues[bathId];
          q.lastIssued += 1;
          q.entries.push({ number: q.lastIssued, serviceId: 'basic', service: '기본 세신', durationMinutes: 30, scrubberPref: null, status: 'waiting', isMine: false, createdAt: Date.now() });
          log(q, `${pad3(q.lastIssued)}번 현장 접수 (번호표)`);
          if (!activeEntry(q)) callNext(d, bathId);
          syncMyPhases(d, bathId);
        }),
      cancelQueue: (bathId: string, number: number) =>
        mutate((d) => {
          const q = d.queues[bathId];
          const e = q?.entries.find((x) => x.number === number);
          if (!q || !e || e.status === 'done') return;
          const wasActive = e.status === 'called';
          e.status = 'cancelled';
          e.lastPhase = '취소됨';
          log(q, `${pad3(number)}번 대기 취소`);
          if (wasActive) callNext(d, bathId);
          syncMyPhases(d, bathId);
        }),
      /** 현재 서비스 완료 → 다음 번호 호출 */
      completeService: (bathId: string) =>
        mutate((d) => {
          const q = d.queues[bathId];
          if (!q) return;
          const a = activeEntry(q);
          if (a) {
            a.status = 'done';
            log(q, `${pad3(a.number)}번 서비스 완료`);
          }
          callNext(d, bathId);
          syncMyPhases(d, bathId);
        }),
      startService: (bathId: string) =>
        mutate((d) => {
          const q = d.queues[bathId];
          const a = q && activeEntry(q);
          if (!a || a.status !== 'called') return;
          a.status = 'in_service';
          log(q, `${pad3(a.number)}번 서비스 시작`);
          syncMyPhases(d, bathId);
        }),
      recall: (bathId: string) =>
        mutate((d) => {
          const q = d.queues[bathId];
          const a = q && activeEntry(q);
          if (!a || a.status !== 'called') return;
          a.calledAt = Date.now();
          a.callCount = (a.callCount ?? 1) + 1;
          a.responded = false;
          log(q, `${pad3(a.number)}번 재호출 (${a.callCount}회차)`);
          if (a.isMine) {
            const bath = d.bathhouses.find((b) => b.id === bathId);
            pushNotice(d, `${pad3(a.number)}번 다시 호출 중!`, `${bath?.name} 세신대로 와주세요.`, `/queue/${bathId}`);
          }
        }),
      hold: (bathId: string) =>
        mutate((d) => {
          const q = d.queues[bathId];
          const a = q && activeEntry(q);
          if (!a || a.status !== 'called') return;
          a.status = 'held';
          log(q, `${pad3(a.number)}번 순서 보류 (미응답)`);
          callNext(d, bathId);
          syncMyPhases(d, bathId);
        }),
      restoreHeld: (bathId: string, number: number) =>
        mutate((d) => {
          const q = d.queues[bathId];
          const idx = q?.entries.findIndex((x) => x.number === number) ?? -1;
          if (!q || idx < 0) return;
          const [e] = q.entries.splice(idx, 1);
          e.status = 'waiting';
          const firstWaiting = q.entries.findIndex((x) => x.status === 'waiting');
          q.entries.splice(firstWaiting < 0 ? q.entries.length : firstWaiting, 0, e);
          log(q, `${pad3(number)}번 보류 해제 → 다음 순서로 복귀`);
          if (!activeEntry(q)) callNext(d, bathId);
          syncMyPhases(d, bathId);
        }),
      moveEntry: (bathId: string, number: number, dir: -1 | 1) =>
        mutate((d) => {
          const q = d.queues[bathId];
          if (!q) return;
          const idxs = q.entries.map((e, i) => (e.status === 'waiting' ? i : -1)).filter((i) => i >= 0);
          const pos = idxs.findIndex((i) => q.entries[i].number === number);
          const target = pos + dir;
          if (pos < 0 || target < 0 || target >= idxs.length) return;
          const a = idxs[pos];
          const b = idxs[target];
          const other = q.entries[b].number;
          [q.entries[a], q.entries[b]] = [q.entries[b], q.entries[a]];
          log(q, `순서 변경: ${pad3(number)}번 ↔ ${pad3(other)}번`);
          syncMyPhases(d, bathId);
        }),
      respond: (bathId: string, number: number) =>
        mutate((d) => {
          const q = d.queues[bathId];
          const e = q?.entries.find((x) => x.number === number);
          if (!q || !e || e.status !== 'called') return;
          e.responded = true;
          log(q, `${pad3(number)}번 호출 응답 ("지금 갈게요")`);
        }),

      /* ----- 찜질방 / 시설 ----- */
      adjustRoom: (roomId: string, delta: number) =>
        mutate((d) => {
          const r = d.rooms.find((x) => x.roomId === roomId);
          if (!r) return;
          r.currentOccupancy = Math.max(0, r.currentOccupancy + delta);
          r.updatedAt = new Date().toISOString();
        }),
      setRoom: (roomId: string, patch: Partial<Pick<Room, 'currentOccupancy' | 'recommendedOccupancy'>>) =>
        mutate((d) => {
          const r = d.rooms.find((x) => x.roomId === roomId);
          if (!r) return;
          if (patch.currentOccupancy !== undefined) r.currentOccupancy = Math.max(0, Math.floor(patch.currentOccupancy || 0));
          if (patch.recommendedOccupancy !== undefined) r.recommendedOccupancy = Math.max(1, Math.floor(patch.recommendedOccupancy || 1));
          r.updatedAt = new Date().toISOString();
        }),
      adjustVisitors: (bathId: string, delta: number) =>
        mutate((d) => {
          const b = d.bathhouses.find((x) => x.id === bathId);
          if (b) b.currentVisitors = Math.max(0, b.currentVisitors + delta);
        }),
      updateBath: (bathId: string, patch: Partial<Pick<Bathhouse, 'name' | 'price' | 'openingHours' | 'description' | 'address'>>) =>
        mutate((d) => {
          const b = d.bathhouses.find((x) => x.id === bathId);
          if (b) Object.assign(b, patch);
        }),
      updateHygiene: (bathId: string, patch: Partial<Hygiene>) =>
        mutate((d) => {
          const b = d.bathhouses.find((x) => x.id === bathId);
          if (b) b.hygiene = { ...b.hygiene, ...patch, updatedAt: new Date().toISOString() };
        }),

      /* ----- 세신사 ----- */
      updateSettings: (scrubberId: string, patch: Partial<ScrubberSettings>) =>
        mutate((d) => {
          d.scrubberSettings[scrubberId] = { ...d.scrubberSettings[scrubberId], ...patch };
        }),
      setDuration: (scrubberId: string, serviceId: ServiceId, minutes: number) =>
        mutate((d) => {
          const s = d.scrubberSettings[scrubberId];
          if (s) s.durations[serviceId] = Math.min(180, Math.max(10, Math.round(minutes || 10)));
        }),
      addBreak: (scrubberId: string, start: string, end: string) =>
        mutate((d) => {
          const s = d.scrubberSettings[scrubberId];
          if (!s || toMin(end) <= toMin(start)) return;
          s.breaks.push({ start, end });
          s.breaks.sort((a, b) => toMin(a.start) - toMin(b.start));
        }),
      removeBreak: (scrubberId: string, index: number) =>
        mutate((d) => {
          d.scrubberSettings[scrubberId]?.breaks.splice(index, 1);
        }),
      toggleWorkDay: (scrubberId: string, day: number) =>
        mutate((d) => {
          const s = d.scrubbers.find((x) => x.id === scrubberId);
          if (!s) return;
          s.workDays = s.workDays.includes(day) ? s.workDays.filter((x) => x !== day) : [...s.workDays, day].sort();
        }),
      toggleAssignment: (scrubberId: string, bathId: string) =>
        mutate((d) => {
          const s = d.scrubbers.find((x) => x.id === scrubberId);
          if (!s) return;
          s.bathhouseIds = s.bathhouseIds.includes(bathId) ? s.bathhouseIds.filter((x) => x !== bathId) : [...s.bathhouseIds, bathId];
        }),
      addScrubber: (input: { name: string; career: number; section: Scrubber['section']; services: ServiceId[]; bathId: string }) =>
        mutate((d) => {
          const id = uid('staff');
          d.scrubbers.push({
            id,
            name: input.name,
            career: input.career,
            section: input.section,
            specialties: input.services.map((s) => serviceById(s).name),
            services: input.services,
            bathhouseIds: [input.bathId],
            workDays: [0, 1, 2, 3, 4, 5, 6],
            reviewSummary: '신규 등록 세신사 (후기 없음)',
            reviewScore: 0,
            reviewCount: 0,
            emoji: '🧑',
            isDemo: true,
          });
          d.scrubberSettings[id] = { breaks: [], paused: false, dailyLimit: 8, durations: { basic: 30, cucumber: 40, massage: 60, premium: 70 } };
        }),

      /* ----- 알림 ----- */
      markAllRead: () => mutate((d) => d.notifications.forEach((n) => (n.read = true))),
      clearNotifications: () => mutate((d) => void (d.notifications = [])),
    }),
    [mutate, reload],
  );

  return { state, actions };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('StoreProvider missing');
  return v;
}

/** 1초마다 갱신되는 현재 시각 (호출 경과 시간 표시용) */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
