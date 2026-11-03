import { DisplayLink } from './ui';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Home, Monitor, Play, Plus, RotateCcw, CheckCircle2, PauseCircle, Undo2 } from 'lucide-react';
import { activeEntry, formatClock, heldList, NO_RESPONSE_MS, pad3, waitingList } from '../lib/logic';
import { useNow, useStore } from '../store';
import { Hamster } from './ui';

export function OpsShell({ title, subtitle, children, right }: { title: string; subtitle: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6EDE3]">
      <header className="sticky top-0 z-20 border-b border-[#EADCCD] bg-brown text-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-1.5" aria-label="소비자 화면으로">
            <Hamster size={30} />
            <span className="hidden font-extrabold sm:inline">
              MELTING <span className="text-coral">HAM</span>
            </span>
          </Link>
          <div className="min-w-0 flex-1 border-l border-white/20 pl-3">
            <div className="truncate text-sm font-bold">{title}</div>
            <div className="truncate text-[11px] text-white/60">{subtitle}</div>
          </div>
          {right}
          <Link to="/" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20">
            <Home className="h-3.5 w-3.5" /> 이용자 화면
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <p className="mb-3 rounded-2xl border border-dashed border-brown-faint bg-white/60 px-3 py-2 text-xs text-brown-soft">
          DEMO · 운영자 화면은 시연용입니다. 변경 사항은 이 브라우저의 LocalStorage에 저장되며, 같은 브라우저에서 열린 이용자 화면·디스플레이 탭에 즉시 반영됩니다.
        </p>
        {children}
      </div>
    </div>
  );
}

export function Panel({ title, children, right, className = '' }: { title: ReactNode; children: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-white p-4 shadow-soft ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-extrabold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-soft">
      <div className="text-xs text-brown-soft">{label}</div>
      <div className={`mt-0.5 text-2xl font-black ${accent ? 'text-coral' : ''}`}>{value}</div>
    </div>
  );
}

const btn = 'inline-flex min-h-[40px] items-center justify-center gap-1 rounded-xl px-3 text-sm font-bold transition active:scale-[0.97] disabled:opacity-40';

/** 현장 대기 운영 (관리자·세신사 공용) */
export function QueueControl({ bathId }: { bathId: string }) {
  const { state, actions } = useStore();
  const now = useNow(1000);
  const q = state.queues[bathId] ?? { lastIssued: 0, entries: [], log: [] };
  const a = activeEntry(q);
  const waiting = waitingList(q);
  const held = heldList(q);
  const scName = (id: string | null) => (id ? state.scrubbers.find((s) => s.id === id)?.name ?? '' : '무관');
  const elapsed = a?.status === 'called' && a.calledAt ? Math.max(0, now - a.calledAt) : 0;
  const noResponse = a?.status === 'called' && !a.responded && elapsed > NO_RESPONSE_MS;

  return (
    <div className="space-y-3">
      <div className={`rounded-2xl p-4 ${a ? (noResponse ? 'bg-danger-light' : a.status === 'called' ? 'bg-coral-light/50' : 'bg-butter-light') : 'bg-cream'}`}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="text-xs font-semibold text-brown-soft">현재 진행</div>
            <div className="text-4xl font-black" data-testid="admin-current">
              {a ? pad3(a.number) : '없음'}
            </div>
          </div>
          {a && (
            <div className="min-w-0 flex-1 text-sm">
              <div className="font-bold">
                {a.status === 'called' ? '📢 호출 중' : '🧽 서비스 진행 중'} {a.isMine && <span className="ml-1 rounded-full bg-coral px-2 py-0.5 text-[10px] text-white">앱 이용자</span>}
              </div>
              <div className="text-brown-soft">
                {a.service} · {a.durationMinutes}분 · 세신사 {scName(a.scrubberPref)}
              </div>
              {a.status === 'called' && (
                <div className={`mt-0.5 text-xs font-bold ${noResponse ? 'text-danger-dark' : 'text-brown-soft'}`}>
                  {a.responded ? '✅ 이용자 응답 완료' : noResponse ? `⚠️ 미응답 (${Math.floor(elapsed / 1000)}초 경과 · ${a.callCount ?? 1}회 호출)` : `호출 후 ${Math.floor(elapsed / 1000)}초 · 30초 후 미응답 표시`}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {a?.status === 'called' && (
            <button className={`${btn} bg-butter text-brown`} onClick={() => actions.startService(bathId)}>
              <Play className="h-4 w-4" /> 서비스 시작
            </button>
          )}
          <button className={`${btn} bg-coral text-white`} onClick={() => actions.completeService(bathId)} disabled={!a && !waiting.length} data-testid="complete-service">
            <CheckCircle2 className="h-4 w-4" /> {a ? '서비스 완료 → 다음 호출' : '다음 번호 호출'}
          </button>
          {a?.status === 'called' && (
            <>
              <button className={`${btn} bg-white text-brown ring-1 ring-[#EADCCD]`} onClick={() => actions.recall(bathId)}>
                <RotateCcw className="h-4 w-4" /> 재호출
              </button>
              <button className={`${btn} bg-white text-danger-dark ring-1 ring-danger`} onClick={() => actions.hold(bathId)}>
                <PauseCircle className="h-4 w-4" /> 순서 보류
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <b className="text-sm">대기 순서 ({waiting.length}명)</b>
          <div className="flex gap-1.5">
            <button className={`${btn} min-h-[34px] bg-cream text-xs`} onClick={() => actions.addWalkIn(bathId)}>
              <Plus className="h-3.5 w-3.5" /> 현장 번호표 발급
            </button>
            <DisplayLink to={`/display/queue/${bathId}`} className={`${btn} min-h-[34px] bg-cream text-xs`}>
              <Monitor className="h-3.5 w-3.5" /> 공용 화면
            </DisplayLink>
          </div>
        </div>
        {waiting.length ? (
          <ol className="space-y-1.5">
            {waiting.map((e, i) => (
              <li key={e.number} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${e.isMine ? 'bg-coral-light/40' : 'bg-cream'}`}>
                <span className="w-5 text-xs text-brown-faint">{i + 1}</span>
                <b className="w-10">{pad3(e.number)}</b>
                <span className="min-w-0 flex-1 truncate text-xs text-brown-soft">
                  {e.service} · {e.durationMinutes}분 · {scName(e.scrubberPref)} {e.isMine && <b className="text-coral-dark">· 앱</b>}
                </span>
                <button className="grid h-8 w-8 place-items-center rounded-lg bg-white disabled:opacity-30" disabled={i === 0} onClick={() => actions.moveEntry(bathId, e.number, -1)} aria-label={`${pad3(e.number)}번 앞으로`}>
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button className="grid h-8 w-8 place-items-center rounded-lg bg-white disabled:opacity-30" disabled={i === waiting.length - 1} onClick={() => actions.moveEntry(bathId, e.number, 1)} aria-label={`${pad3(e.number)}번 뒤로`}>
                  <ArrowDown className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-xl bg-cream px-3 py-3 text-sm text-brown-soft">대기 중인 고객이 없어요.</p>
        )}
      </div>

      {held.length > 0 && (
        <div>
          <b className="text-sm">보류된 순서</b>
          <ul className="mt-1.5 space-y-1.5">
            {held.map((e) => (
              <li key={e.number} className="flex items-center gap-2 rounded-xl bg-danger-light/60 px-3 py-2 text-sm">
                <b>{pad3(e.number)}</b>
                <span className="flex-1 text-xs text-brown-soft">미응답 보류 · {e.service}</span>
                <button className={`${btn} min-h-[32px] bg-white text-xs`} onClick={() => actions.restoreHeld(bathId, e.number)}>
                  <Undo2 className="h-3.5 w-3.5" /> 다음 순서로 복귀
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <b className="text-sm">순서 변경 · 처리 내역</b>
        <ul className="mt-1.5 max-h-40 space-y-1 overflow-y-auto text-xs">
          {q.log.length ? (
            q.log.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="w-10 shrink-0 text-brown-faint">{formatClock(l.at)}</span>
                {l.text}
              </li>
            ))
          ) : (
            <li className="text-brown-soft">아직 내역이 없어요.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
