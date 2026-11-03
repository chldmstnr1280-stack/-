import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { serviceById, SERVICES } from '../data/seed';
import { daySlots, formatDate, formatTimeKo, parseDate, scrubbersAt, SLOT_LABEL, toDateStr, todayStr, won } from '../lib/logic';
import { useStore } from '../store';
import type { ServiceId } from '../types';
import { Button, Card, DemoBadge, EmptyState, Hamster, PageHeader, useToast } from '../components/ui';

const STEPS = ['세신사', '서비스', '날짜·시간', '확인'];

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mb-4 flex items-center gap-1">
      {STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 flex-col items-center gap-1">
          <div className={`h-1.5 w-full rounded-full ${i <= step ? 'bg-coral' : 'bg-cream'}`} />
          <span className={`text-[11px] font-semibold ${i === step ? 'text-coral' : 'text-brown-faint'}`}>
            {i + 1}. {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Calendar({ value, onChange, isOff }: { value: string; onChange: (d: string) => void; isOff: (d: string) => boolean }) {
  const today = todayStr();
  const maxDate = toDateStr(new Date(Date.now() + 30 * 86400000));
  const [cursor, setCursor] = useState(() => {
    const d = parseDate(value || today);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => toDateStr(new Date(y, m, i + 1)))];
  const canPrev = toDateStr(new Date(y, m, 0)) >= today;
  const canNext = toDateStr(new Date(y, m + 1, 1)) <= maxDate;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button disabled={!canPrev} onClick={() => setCursor(new Date(y, m - 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream disabled:opacity-30" aria-label="이전 달">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <b>
          {y}년 {m + 1}월
        </b>
        <button disabled={!canNext} onClick={() => setCursor(new Date(y, m + 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream disabled:opacity-30" aria-label="다음 달">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-brown-soft">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const disabled = d < today || d > maxDate;
          const off = !disabled && isOff(d);
          const sel = d === value;
          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => onChange(d)}
              aria-pressed={sel}
              aria-label={`${formatDate(d)}${off ? ' 휴무' : ''}`}
              className={`relative aspect-square rounded-xl text-sm font-semibold transition ${sel ? 'bg-coral text-white' : disabled ? 'text-brown-faint/50' : off ? 'text-brown-faint line-through' : 'hover:bg-cream'} ${d === today && !sel ? 'ring-1 ring-coral' : ''}`}
            >
              {Number(d.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking() {
  const { bathId = '' } = useParams();
  const { state, actions } = useStore();
  const nav = useNavigate();
  const toast = useToast();
  const bath = state.bathhouses.find((b) => b.id === bathId);
  const staff = bath ? scrubbersAt(state, bath.id) : [];

  const [step, setStep] = useState(0);
  const [scrubberId, setScrubberId] = useState<string>('');
  const [serviceId, setServiceId] = useState<ServiceId | ''>('');
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState('');

  const scrubber = staff.find((s) => s.id === scrubberId);
  const settings = scrubberId ? state.scrubberSettings[scrubberId] : undefined;
  const slots = useMemo(() => (scrubberId && serviceId ? daySlots(state, scrubberId, date, serviceId) : []), [state, scrubberId, serviceId, date]);

  if (!bath || !bath.scrubReservation)
    return (
      <div>
        <PageHeader title="세신 예약" />
        <EmptyState title="이 시설은 온라인 세신 예약을 지원하지 않아요" action={<Button onClick={() => nav('/reserve')}>예약 가능한 시설 보기</Button>} />
      </div>
    );

  const svc = serviceId ? serviceById(serviceId) : undefined;
  const dur = svc && settings ? settings.durations[svc.id] : svc?.durationMinutes;

  const confirm = () => {
    if (!scrubberId || !serviceId || !time) return;
    const res = actions.book({ bathhouseId: bath.id, scrubberId, serviceId, date, time });
    if (res.ok) nav(`/book/done/${res.id}`, { replace: true });
    else {
      toast('예약할 수 없는 시간이에요', `${SLOT_LABEL[res.reason as keyof typeof SLOT_LABEL] ?? res.reason} · 다른 시간을 선택해 주세요.`);
      setTime('');
      setStep(2);
    }
  };

  return (
    <div>
      <PageHeader title={`세신 예약 · ${bath.name}`} />
      <Stepper step={step} />

      {step === 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">세신사를 선택하세요</h2>
            <DemoBadge label="가상 프로필" />
          </div>
          {staff.map((s) => {
            const st = state.scrubberSettings[s.id];
            const sel = s.id === scrubberId;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setScrubberId(s.id);
                  setServiceId('');
                  setTime('');
                  setStep(1);
                }}
                className={`w-full rounded-3xl border-2 bg-white p-4 text-left shadow-soft transition ${sel ? 'border-coral' : 'border-transparent hover:border-coral-light'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cream text-3xl">{s.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <b className="text-lg">{s.name}</b>
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold">{s.section}</span>
                    </div>
                    <div className="text-sm text-brown-soft">
                      경력 {s.career}년 · {s.specialties.join(' / ')}
                    </div>
                  </div>
                  {st?.paused ? <span className="rounded-full bg-danger-light px-2 py-1 text-[11px] font-bold text-danger-dark">예약 중단</span> : <span className="rounded-full bg-ok-light px-2 py-1 text-[11px] font-bold text-ok-dark">예약 가능</span>}
                </div>
                <p className="mt-2 text-sm">{s.reviewCount ? `★ ${s.reviewScore} (${s.reviewCount}) ${s.reviewSummary}` : s.reviewSummary}</p>
                <p className="mt-1 text-xs text-brown-soft">근무: {['일', '월', '화', '수', '목', '금', '토'].filter((_, i) => s.workDays.includes(i)).join('·')} · 휴식 {st?.breaks.map((b) => `${b.start}~${b.end}`).join(', ') || '없음'}</p>
              </button>
            );
          })}
          <p className="text-center text-[11px] text-brown-faint">모든 세신사 프로필과 후기는 시연용 가상 데이터입니다.</p>
        </div>
      )}

      {step === 1 && scrubber && (
        <div className="space-y-3">
          <h2 className="font-extrabold">{scrubber.name}의 서비스를 선택하세요</h2>
          {SERVICES.filter((s) => scrubber.services.includes(s.id)).map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setServiceId(s.id);
                setTime('');
                setStep(2);
              }}
              className={`flex w-full items-center justify-between rounded-3xl border-2 bg-white p-4 text-left shadow-soft ${serviceId === s.id ? 'border-coral' : 'border-transparent hover:border-coral-light'}`}
            >
              <div>
                <b className="text-[17px]">{s.name}</b>
                <div className="text-sm text-brown-soft">예상 소요 {settings?.durations[s.id] ?? s.durationMinutes}분</div>
              </div>
              <b className="text-lg">{won(s.price)}</b>
            </button>
          ))}
          <p className="text-center text-[11px] text-brown-faint">가격과 시간은 시연용 예시입니다.</p>
          <Button variant="ghost" block onClick={() => setStep(0)}>
            세신사 다시 선택
          </Button>
        </div>
      )}

      {step === 2 && scrubber && svc && (
        <div className="space-y-3">
          <Card>
            <Calendar
              value={date}
              onChange={(d) => {
                setDate(d);
                setTime('');
              }}
              isOff={(d) => !scrubber.workDays.includes(parseDate(d).getDay())}
            />
          </Card>
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <b>{formatDate(date)}</b>
              <span className="text-xs text-brown-soft">
                {svc.name} · {dur}분
              </span>
            </div>
            {slots.every((s) => s.reason === 'off') ? (
              <p className="py-4 text-center text-sm text-brown-soft">{scrubber.name}의 휴무일이에요.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((s) => {
                  const ok = s.reason === 'available';
                  const sel = time === s.time;
                  return (
                    <button
                      key={s.time}
                      disabled={!ok}
                      onClick={() => setTime(s.time)}
                      aria-pressed={sel}
                      data-slot={s.time}
                      className={`flex min-h-[56px] flex-col items-center justify-center rounded-2xl border-2 text-sm font-bold transition ${
                        sel ? 'border-coral bg-coral text-white' : ok ? 'border-ok-light bg-ok-light/40 hover:border-ok' : s.reason === 'mine' ? 'border-coral-light bg-coral-light/30 text-coral-dark' : 'border-transparent bg-cream text-brown-faint'
                      }`}
                    >
                      {s.time}
                      <span className="text-[10px] font-semibold">{sel ? '선택됨' : SLOT_LABEL[s.reason]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
          <div className="grid grid-cols-[1fr_2fr] gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              이전
            </Button>
            <Button disabled={!time} onClick={() => setStep(3)}>
              {time ? `${formatTimeKo(time)} 선택` : '시간을 선택하세요'}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && scrubber && svc && time && (
        <div className="space-y-3">
          <Card>
            <h2 className="mb-2 text-lg font-extrabold">예약 정보를 확인하세요</h2>
            <dl className="divide-y divide-cream text-sm">
              {[
                ['시설명', bath.name],
                ['세신사', `${scrubber.name} (${scrubber.section})`],
                ['서비스', `${svc.name} · ${dur}분`],
                ['날짜', formatDate(date)],
                ['시간', `${formatTimeKo(time)} (${time})`],
                ['가격', won(svc.price)],
                ['결제', '현장 결제 예정'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5">
                  <dt className="text-brown-soft">{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <p className="rounded-2xl bg-butter-light p-3 text-xs text-brown-soft">프로토타입에서는 실제 결제와 실제 예약 전송이 이루어지지 않으며, 이 브라우저에만 저장됩니다.</p>
          <div className="grid grid-cols-[1fr_2fr] gap-2">
            <Button variant="ghost" onClick={() => setStep(2)}>
              이전
            </Button>
            <Button onClick={confirm}>
              <Check className="h-4 w-4" /> 예약 확정
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function BookingDone() {
  const { resId } = useParams();
  const { state } = useStore();
  const nav = useNavigate();
  const r = state.reservations.find((x) => x.reservationId === resId);
  if (!r) return <div className="pt-10"><EmptyState title="예약 정보를 찾을 수 없어요" action={<Button onClick={() => nav('/my')}>예약 내역</Button>} /></div>;
  const bath = state.bathhouses.find((b) => b.id === r.bathhouseId);
  const sc = state.scrubbers.find((s) => s.id === r.scrubberId);
  return (
    <div className="pt-10 text-center">
      <Hamster size={96} className="mx-auto" mood="wow" />
      <h1 className="mt-3 text-2xl font-extrabold">예약이 완료되었어요!</h1>
      <p className="mt-1 text-sm text-brown-soft">예약 시간 10분 전에 웹앱 알림으로 알려드릴게요.</p>
      <Card className="mt-6 text-left">
        <dl className="divide-y divide-cream text-sm">
          {[
            ['시설명', bath?.name],
            ['세신사', sc?.name],
            ['서비스', `${r.service} · ${r.durationMinutes}분`],
            ['날짜', formatDate(r.date)],
            ['시간', formatTimeKo(r.time)],
            ['가격', won(r.price)],
            ['결제 상태', '현장 결제 예정'],
            ['예약번호', r.reservationId],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 py-2.5">
              <dt className="text-brown-soft">{k}</dt>
              <dd className="truncate font-bold">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <div className="mt-4 grid gap-2">
        <Button onClick={() => nav('/my')}>예약 내역 보기</Button>
        <Button variant="ghost" onClick={() => nav(`/book/${r.bathhouseId}`)}>
          다른 시간 예약하기
        </Button>
        <Link to="/" className="py-2 text-sm font-semibold text-brown-soft underline">
          홈으로
        </Link>
      </div>
    </div>
  );
}
