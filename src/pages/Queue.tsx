import { DisplayLink } from '../components/ui';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bell, Info, Monitor, RefreshCw, X } from 'lucide-react';
import { SERVICES } from '../data/seed';
import { activeEntry, aheadInfo, currentNumber, formatClock, pad3, phaseOf, PHASES, scrubbersAt, waitingList } from '../lib/logic';
import { useStore } from '../store';
import type { ServiceId } from '../types';
import { Button, Card, Chip, ConfirmSheet, DemoBadge, EmptyState, Hamster, PageHeader, SectionTitle, useToast } from '../components/ui';

export default function QueuePage() {
  const { bathId = '' } = useParams();
  const { state, actions } = useStore();
  const nav = useNavigate();
  const toast = useToast();
  const [serviceId, setServiceId] = useState<ServiceId>('basic');
  const [pref, setPref] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const bath = state.bathhouses.find((b) => b.id === bathId);
  if (!bath || !bath.scrubReservation)
    return (
      <div>
        <PageHeader title="현장 대기" />
        <EmptyState title="이 시설은 앱 대기 등록을 지원하지 않아요" action={<Button onClick={() => nav('/reserve')}>다른 시설 보기</Button>} />
      </div>
    );

  const q = state.queues[bath.id] ?? { lastIssued: 0, entries: [], log: [] };
  const mine = q.entries.filter((e) => e.isMine);
  const my = mine.find((e) => ['waiting', 'called', 'in_service', 'held'].includes(e.status));
  const lastDone = !my ? [...mine].reverse().find((e) => e.status === 'done') : undefined;
  const cur = currentNumber(q);
  const waiting = waitingList(q);
  const staff = scrubbersAt(state, bath.id).filter((s) => s.workDays.includes(new Date().getDay()));
  const offered = SERVICES.filter((s) => staff.some((x) => x.services.includes(s.id)));
  const estIfJoin = waiting.reduce((s, e) => s + e.durationMinutes, 0);

  const refresh = () => {
    actions.reload();
    toast('대기 현황을 새로고침했어요');
  };

  return (
    <div>
      <PageHeader
        title={`현장 대기 · ${bath.name}`}
        right={
          <button onClick={refresh} className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream" aria-label="대기 현황 새로고침">
            <RefreshCw className="h-5 w-5" />
          </button>
        }
      />

      {my ? (
        <MyTicket bathId={bath.id} />
      ) : (
        <>
          {lastDone && (
            <div className="mb-3 flex items-center gap-3 rounded-3xl bg-ok-light p-4">
              <Hamster size={44} />
              <div className="text-sm">
                <b>{pad3(lastDone.number)}번 서비스가 완료되었어요.</b>
                <div className="text-brown-soft">개운한 하루 보내세요! 다시 대기할 수도 있어요.</div>
              </div>
            </div>
          )}
          <Card>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-cream p-3">
                <div className="text-[11px] text-brown-soft">현재 진행</div>
                <div className="text-2xl font-black">{pad3(cur)}</div>
              </div>
              <div className="rounded-2xl bg-cream p-3">
                <div className="text-[11px] text-brown-soft">현재 대기</div>
                <div className="text-2xl font-black text-coral">{waiting.length}명</div>
              </div>
              <div className="rounded-2xl bg-cream p-3">
                <div className="text-[11px] text-brown-soft">지금 등록 시</div>
                <div className="text-2xl font-black">~{estIfJoin}분</div>
              </div>
            </div>
          </Card>

          <SectionTitle>서비스 선택</SectionTitle>
          <div className="space-y-2">
            {offered.map((s) => (
              <button key={s.id} onClick={() => setServiceId(s.id)} aria-pressed={serviceId === s.id} className={`flex w-full items-center justify-between rounded-2xl border-2 bg-white px-4 py-3 text-left ${serviceId === s.id ? 'border-coral' : 'border-transparent'}`}>
                <span className="font-bold">{s.name}</span>
                <span className="text-sm text-brown-soft">
                  {s.price.toLocaleString()}원 · {s.durationMinutes}분
                </span>
              </button>
            ))}
          </div>

          <SectionTitle>희망 세신사</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            <Chip active={pref === null} onClick={() => setPref(null)}>
              상관없음 (가장 빠른 순서)
            </Chip>
            {staff
              .filter((s) => s.services.includes(serviceId))
              .map((s) => (
                <Chip key={s.id} active={pref === s.id} onClick={() => setPref(s.id)}>
                  {s.emoji} {s.name}
                </Chip>
              ))}
          </div>

          <Button
            block
            className="mt-5 h-14 text-lg"
            onClick={() => {
              actions.joinQueue(bath.id, serviceId, pref);
            }}
          >
            대기번호 받기
          </Button>
          <p className="mt-3 flex gap-1.5 text-xs text-brown-soft">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> 예상 대기시간은 앞 순서 고객의 서비스별 소요시간을 합산한 값으로, 실제 시간과 다를 수 있어요.
          </p>
        </>
      )}

      <SectionTitle right={<DemoBadge label="시뮬레이션" />}>목욕탕 안에서는 이렇게 안내돼요</SectionTitle>
      <Card className="text-sm">
        <ul className="space-y-1.5 text-brown-soft">
          <li>🔖 방수 번호표에 같은 대기번호가 적혀 있어요.</li>
          <li>📺 탈의실 공용 디스플레이에 호출 번호만 표시돼요 (이름·전화번호 비공개).</li>
          <li>📢 차례가 되면 세신대에서 번호를 호출해요.</li>
        </ul>
        <DisplayLink to={`/display/queue/${bath.id}`} className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl bg-cream py-2.5 font-semibold">
          <Monitor className="h-4 w-4" /> 공용 대기 디스플레이 열기
        </DisplayLink>
      </Card>

      {q.log.length > 0 && (
        <>
          <SectionTitle>순서 변경 내역</SectionTitle>
          <Card>
            <ul className="space-y-1.5 text-sm">
              {q.log.slice(0, 6).map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-11 shrink-0 text-brown-faint">{formatClock(l.at)}</span>
                  <span>{l.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      {my && (
        <Button variant="danger" block className="mt-5" onClick={() => setCancelOpen(true)} disabled={my.status === 'in_service'}>
          <X className="h-4 w-4" /> 대기 취소
        </Button>
      )}
      <ConfirmSheet
        open={cancelOpen}
        title={`${my ? pad3(my.number) : ''}번 대기를 취소할까요?`}
        body="취소하면 순서가 사라지고 다시 등록하면 새 번호를 받게 됩니다."
        confirmLabel="대기 취소"
        danger
        onConfirm={() => {
          if (my) actions.cancelQueue(bath.id, my.number);
          toast('대기를 취소했어요');
        }}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  );
}

function MyTicket({ bathId }: { bathId: string }) {
  const { state, actions } = useStore();
  const q = state.queues[bathId];
  const my = q.entries.find((e) => e.isMine && ['waiting', 'called', 'in_service', 'held'].includes(e.status))!;
  const phase = phaseOf(q, my);
  const { ahead, minutes } = aheadInfo(q, my);
  const cur = currentNumber(q);
  const active = activeEntry(q);
  const waiting = waitingList(q);
  const before = waiting.slice(0, ahead);
  const pref = my.scrubberPref ? state.scrubbers.find((s) => s.id === my.scrubberPref) : null;
  const phaseIdx = PHASES.indexOf(phase);
  const called = phase === '호출 중';

  return (
    <div className="space-y-3">
      <div className={`rounded-3xl p-5 text-center shadow-soft ${called ? 'pulse-ring bg-coral text-white' : 'bg-white'}`}>
        <div className={`text-sm font-semibold ${called ? 'text-white/90' : 'text-brown-soft'}`}>내 대기번호</div>
        <div className="text-6xl font-black tracking-tight" data-testid="my-number">
          {pad3(my.number)}
        </div>
        <div className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold ${called ? 'bg-white text-coral' : phase === '곧 차례' ? 'bg-butter' : phase === '순서 보류' ? 'bg-danger-light text-danger-dark' : 'bg-cream'}`} data-testid="my-phase">
          {phase}
        </div>
        <div className={`mt-1 text-xs ${called ? 'text-white/80' : 'text-brown-soft'}`}>
          {my.service} · {pref ? pref.name : '세신사 무관'}
        </div>
        {called && (
          <div className="mt-4">
            <div className="flex items-center justify-center gap-1.5 text-lg font-extrabold">
              <Bell className="h-5 w-5" /> 세신대로 와주세요!
            </div>
            {my.responded ? (
              <div className="mt-2 text-sm">응답 완료 · 세신사가 기다리고 있어요</div>
            ) : (
              <Button variant="secondary" className="mt-3" onClick={() => actions.respond(bathId, my.number)}>
                지금 갈게요
              </Button>
            )}
          </div>
        )}
        {phase === '순서 보류' && <p className="mt-3 text-sm text-danger-dark">호출에 응답이 없어 순서가 보류되었어요. 세신대에 말씀하시면 다음 순서로 복귀됩니다.</p>}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-white p-3 shadow-soft">
          <div className="text-[11px] text-brown-soft">현재 진행</div>
          <div className="text-2xl font-black" data-testid="current-number">
            {pad3(cur)}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-soft">
          <div className="text-[11px] text-brown-soft">내 앞 대기</div>
          <div className="text-2xl font-black text-coral" data-testid="ahead">
            {ahead}명
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-soft">
          <div className="text-[11px] text-brown-soft">예상 대기</div>
          <div className="text-2xl font-black" data-testid="eta">
            {my.status === 'waiting' ? `약 ${minutes}분` : '-'}
          </div>
        </div>
      </div>

      <Card>
        <div className="mb-3 text-sm font-bold">대기 진행 상태</div>
        <ol className="flex items-center">
          {PHASES.map((p, i) => (
            <li key={p} className="flex flex-1 flex-col items-center gap-1 text-center">
              <div className="flex w-full items-center">
                <div className={`h-1 flex-1 ${i === 0 ? 'opacity-0' : i <= phaseIdx ? 'bg-coral' : 'bg-cream'}`} />
                <div className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${i < phaseIdx ? 'bg-coral text-white' : i === phaseIdx ? 'bg-coral text-white ring-4 ring-coral-light' : 'bg-cream text-brown-faint'}`}>{i + 1}</div>
                <div className={`h-1 flex-1 ${i === PHASES.length - 1 ? 'opacity-0' : i < phaseIdx ? 'bg-coral' : 'bg-cream'}`} />
              </div>
              <span className={`text-[10px] font-semibold ${i === phaseIdx ? 'text-coral' : 'text-brown-faint'}`}>{p}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 text-sm font-bold">순서 진행 바</div>
        <div className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
          {active && (
            <div className="flex shrink-0 flex-col items-center">
              <div className={`grid h-10 w-12 place-items-center rounded-xl text-xs font-black ${active.isMine ? 'bg-coral text-white' : 'bg-brown text-white'}`}>{pad3(active.number)}</div>
              <span className="mt-0.5 text-[10px] text-brown-soft">{active.status === 'called' ? '호출' : '진행'}</span>
            </div>
          )}
          {before.map((e) => (
            <div key={e.number} className="flex shrink-0 flex-col items-center">
              <div className="grid h-10 w-12 place-items-center rounded-xl bg-cream text-xs font-bold">{pad3(e.number)}</div>
              <span className="mt-0.5 text-[10px] text-brown-soft">{e.durationMinutes}분</span>
            </div>
          ))}
          {my.status === 'waiting' && (
            <div className="flex shrink-0 flex-col items-center">
              <div className="grid h-10 w-12 place-items-center rounded-xl bg-coral text-xs font-black text-white">{pad3(my.number)}</div>
              <span className="mt-0.5 text-[10px] font-bold text-coral">나</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-brown-soft">남은 대기 인원 {ahead}명 · 예상 대기시간은 서비스별 소요시간 기준이며 실제와 다를 수 있어요.</p>
      </Card>
    </div>
  );
}
