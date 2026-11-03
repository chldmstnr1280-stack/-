import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { BASE_SLOTS, SERVICES } from '../data/seed';
import { activeReservations, daySlots, DOW_LABELS, externalBookings, formatDate, fromMin, SLOT_LABEL, toMin, todayStr } from '../lib/logic';
import { useStore } from '../store';
import { OpsShell, Panel, QueueControl, Stat } from '../components/Ops';
import { useToast } from '../components/ui';

const TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => fromMin(9 * 60 + i * 30)); // 09:00 ~ 21:00

export default function StaffPage() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [staffId, setStaffId] = useState(state.scrubbers[0]?.id ?? '');
  const [previewDate, setPreviewDate] = useState(todayStr());
  const [bStart, setBStart] = useState('15:00');
  const [bEnd, setBEnd] = useState('16:00');
  const s = state.scrubbers.find((x) => x.id === staffId) ?? state.scrubbers[0];
  const [qBath, setQBath] = useState(s?.bathhouseIds[0] ?? '');
  if (!s) return null;
  const settings = state.scrubberSettings[s.id];
  const today = todayStr();
  const mine = activeReservations(state, s.id, today).sort((a, b) => a.time.localeCompare(b.time));
  const ext = externalBookings(s.id, today);
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const todaySlots = daySlots(state, s.id, today);
  const remaining = todaySlots.filter((x) => x.reason === 'available').length;
  const inService = mine.filter((r) => r.status === 'in_service').length;
  const nextRes = [...mine.filter((r) => r.status === 'confirmed').map((r) => r.time), ...ext.map((e) => e.time)].filter((t) => toMin(t) > nowMin).sort()[0];
  const queueBaths = s.bathhouseIds.filter((b) => state.queues[b]);
  const bathForQueue = queueBaths.includes(qBath) ? qBath : queueBaths[0];
  const walkIns = queueBaths.reduce((n, b) => n + state.queues[b].entries.filter((e) => e.status === 'waiting' && (!e.scrubberPref || e.scrubberPref === s.id)).length, 0);
  const preview = daySlots(state, s.id, previewDate);
  const offDay = !s.workDays.includes(new Date().getDay());

  const schedule = BASE_SLOTS.map((t) => {
    const app = mine.find((r) => r.time === t);
    const e = ext.find((x) => x.time === t);
    const reason = todaySlots.find((x) => x.time === t)!.reason;
    return { t, app, e, reason };
  });

  return (
    <OpsShell
      title="세신사 관리"
      subtitle="내 일정과 예약을 직접 관리해요"
      right={
        <select value={s.id} onChange={(e) => setStaffId(e.target.value)} className="rounded-xl bg-white/10 px-2 py-1.5 text-sm font-bold text-white focus:outline-none" aria-label="세신사 선택 (데모 로그인)">
          {state.scrubbers.map((x) => (
            <option key={x.id} value={x.id} className="text-brown">
              {x.name}
            </option>
          ))}
        </select>
      }
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-soft">{s.emoji}</span>
        <div>
          <div className="text-xl font-extrabold">{s.name} 님, 안녕하세요</div>
          <div className="text-sm text-brown-soft">
            {formatDate(today)} · {s.section} · 근무지 {s.bathhouseIds.map((b) => state.bathhouses.find((x) => x.id === b)?.name).join(', ')}
            {offDay && <b className="ml-1 text-danger-dark">· 오늘 휴무</b>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Stat label="오늘 예약" value={`${mine.length + ext.length}건`} />
        <Stat label="현재 진행" value={`${inService}건`} />
        <Stat label="현장 대기" value={`${walkIns}명`} accent />
        <Stat label="다음 예약" value={nextRes ?? '없음'} />
        <Stat label="남은 예약 가능 시간" value={`${remaining}개`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="오늘의 일정표" right={<span className="text-xs text-brown-soft">예약 + 휴식 통합</span>}>
          <ul className="space-y-1.5">
            {schedule.map(({ t, app, e, reason }) => (
              <li key={t} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${app ? 'bg-coral-light/40' : e ? 'bg-cream' : reason === 'break' ? 'bg-butter-light' : reason === 'available' ? 'bg-ok-light/50' : 'bg-cream/60 text-brown-faint'}`}>
                <b className="w-12">{t}</b>
                <span className="flex-1 truncate">
                  {app ? `앱 예약 · ${app.service} (${app.durationMinutes}분)` : e ? '타 고객 예약 (데모)' : SLOT_LABEL[reason]}
                </span>
                {app?.status === 'confirmed' && (
                  <button className="rounded-lg bg-butter px-2.5 py-1 text-xs font-bold" onClick={() => actions.setReservationStatus(app.reservationId, 'in_service')}>
                    시작
                  </button>
                )}
                {app?.status === 'in_service' && (
                  <button className="rounded-lg bg-coral px-2.5 py-1 text-xs font-bold text-white" onClick={() => actions.setReservationStatus(app.reservationId, 'completed')}>
                    완료
                  </button>
                )}
                {app?.status === 'completed' && <span className="text-xs font-bold text-ok-dark">완료</span>}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="현장 대기 고객"
          right={
            queueBaths.length > 1 && (
              <select value={bathForQueue} onChange={(e) => setQBath(e.target.value)} className="rounded-xl bg-cream px-2 py-1 text-sm font-semibold">
                {queueBaths.map((b) => (
                  <option key={b} value={b}>
                    {state.bathhouses.find((x) => x.id === b)?.name}
                  </option>
                ))}
              </select>
            )
          }
        >
          {bathForQueue ? <QueueControl bathId={bathForQueue} /> : <p className="text-sm text-brown-soft">현장 대기를 운영하는 근무지가 없어요.</p>}
        </Panel>

        <Panel title="예약 운영 설정">
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
              <div>
                <b>예약 일시 중단</b>
                <div className="text-xs text-brown-soft">켜면 새 예약을 받지 않아요 (기존 예약 유지)</div>
              </div>
              <input
                type="checkbox"
                className="h-6 w-11 cursor-pointer appearance-none rounded-full bg-brown-faint transition before:block before:h-5 before:w-5 before:translate-x-0.5 before:translate-y-0.5 before:rounded-full before:bg-white before:transition checked:bg-coral checked:before:translate-x-[22px]"
                checked={settings.paused}
                onChange={(e) => {
                  actions.updateSettings(s.id, { paused: e.target.checked });
                  toast(e.target.checked ? '새 예약 받기를 중단했어요' : '예약 받기를 다시 시작했어요');
                }}
              />
            </label>
            <div className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
              <div>
                <b>하루 예약 가능 인원</b>
                <div className="text-xs text-brown-soft">한도에 도달하면 남은 시간은 마감돼요</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="grid h-9 w-9 place-items-center rounded-xl bg-white" onClick={() => actions.updateSettings(s.id, { dailyLimit: Math.max(1, settings.dailyLimit - 1) })} aria-label="한도 줄이기">
                  <Minus className="h-4 w-4" />
                </button>
                <b className="w-10 text-center text-lg">{settings.dailyLimit}명</b>
                <button className="grid h-9 w-9 place-items-center rounded-xl bg-white" onClick={() => actions.updateSettings(s.id, { dailyLimit: Math.min(BASE_SLOTS.length, settings.dailyLimit + 1) })} aria-label="한도 늘리기">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <b className="text-sm">근무 요일</b>
              <div className="mt-1.5 flex gap-1.5">
                {DOW_LABELS.map((d, i) => (
                  <button key={d} onClick={() => actions.toggleWorkDay(s.id, i)} aria-pressed={s.workDays.includes(i)} className={`h-10 flex-1 rounded-xl text-sm font-bold ${s.workDays.includes(i) ? 'bg-coral text-white' : 'bg-cream text-brown-faint'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <b className="text-sm">서비스별 소요시간</b>
              <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
                {SERVICES.filter((x) => s.services.includes(x.id)).map((x) => (
                  <label key={x.id} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2 text-sm">
                    {x.name}
                    <span className="flex items-center gap-1">
                      <input type="number" min={10} max={180} step={5} value={settings.durations[x.id]} onChange={(e) => actions.setDuration(s.id, x.id, Number(e.target.value))} className="w-16 rounded-lg bg-white px-2 py-1 text-right font-bold" />분
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="휴식시간 설정" right={<span className="text-xs text-brown-soft">매일 반복 적용</span>}>
          <ul className="space-y-1.5">
            {settings.breaks.map((b, i) => (
              <li key={`${b.start}-${b.end}-${i}`} className="flex items-center justify-between rounded-xl bg-butter-light px-3 py-2 text-sm" data-break={`${b.start}-${b.end}`}>
                <b>
                  ☕ {b.start} ~ {b.end}
                </b>
                <button
                  className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-danger-dark"
                  onClick={() => {
                    actions.removeBreak(s.id, i);
                    toast('휴식시간을 해제했어요', `${b.start}~${b.end} 예약을 다시 받을 수 있어요.`);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> 해제
                </button>
              </li>
            ))}
            {!settings.breaks.length && <li className="text-sm text-brown-soft">등록된 휴식시간이 없어요.</li>}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-cream p-3 text-sm">
            <select value={bStart} onChange={(e) => setBStart(e.target.value)} className="rounded-lg bg-white px-2 py-1.5 font-bold" aria-label="휴식 시작">
              {TIME_OPTIONS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            ~
            <select value={bEnd} onChange={(e) => setBEnd(e.target.value)} className="rounded-lg bg-white px-2 py-1.5 font-bold" aria-label="휴식 종료">
              {TIME_OPTIONS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button
              className="ml-auto rounded-xl bg-coral px-3 py-2 font-bold text-white disabled:opacity-40"
              disabled={toMin(bEnd) <= toMin(bStart)}
              onClick={() => {
                actions.addBreak(s.id, bStart, bEnd);
                toast('휴식시간을 등록했어요', `${bStart}~${bEnd}에는 새 예약을 받지 않아요.`);
              }}
            >
              휴식 등록
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <b className="text-sm">예약 가능 시간 미리보기 (기본 세신 기준)</b>
              <input type="date" value={previewDate} min={today} onChange={(e) => e.target.value && setPreviewDate(e.target.value)} className="rounded-lg bg-cream px-2 py-1 text-sm" />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {preview.map((p) => (
                <div key={p.time} data-preview={p.time} className={`rounded-xl px-2 py-1.5 text-center text-xs font-bold ${p.reason === 'available' ? 'bg-ok-light text-ok-dark' : p.reason === 'break' ? 'bg-butter-light text-warn-dark' : 'bg-cream text-brown-faint'}`}>
                  {p.time}
                  <div className="text-[10px] font-semibold">{SLOT_LABEL[p.reason]}</div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
      <p className="mt-4 text-center text-xs text-brown-soft">멜팅햄은 세신사의 업무량을 늘리기보다, 휴식시간과 하루 서비스 인원을 스스로 정할 수 있도록 돕습니다.</p>
    </OpsShell>
  );
}
