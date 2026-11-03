import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellRing, ChevronRight } from 'lucide-react';
import { formatDate, formatTimeKo, pad3, phaseOf, todayStr, won } from '../lib/logic';
import { useStore } from '../store';
import type { Reservation } from '../types';
import { BathArt, BellButton, Card, ConfirmSheet, DemoBadge, Hamster, PageHeader, SectionTitle } from '../components/ui';
import { OpsLinks, ResetDemoButton, SCENARIOS } from '../components/DemoGuide';

const STATUS_LABEL: Record<Reservation['status'], { t: string; c: string }> = {
  confirmed: { t: '예약 확정', c: 'bg-ok-light text-ok-dark' },
  in_service: { t: '서비스 진행', c: 'bg-butter text-brown' },
  completed: { t: '이용 완료', c: 'bg-cream text-brown-soft' },
  cancelled: { t: '취소됨', c: 'bg-danger-light text-danger-dark' },
};

export default function MyPage() {
  const { state, actions } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const today = todayStr();

  const sorted = [...state.reservations].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = sorted.filter((r) => (r.status === 'confirmed' || r.status === 'in_service') && r.date >= today);
  const past = sorted.filter((r) => !upcoming.includes(r)).reverse();
  const shown = tab === 'upcoming' ? upcoming : past;

  const tickets = Object.entries(state.queues).flatMap(([bathId, q]) => q.entries.filter((e) => e.isMine).map((e) => ({ bathId, q, e })));
  const activeTickets = tickets.filter((t) => ['waiting', 'called', 'in_service', 'held'].includes(t.e.status));
  const history = [
    ...state.reservations.filter((r) => r.status === 'completed').map((r) => ({ key: r.reservationId, sort: r.date + r.time, title: `${r.service} (예약)`, sub: `${state.bathhouses.find((b) => b.id === r.bathhouseId)?.name} · ${formatDate(r.date)}` })),
    ...tickets.filter((t) => t.e.status === 'done').map((t) => ({ key: t.bathId + t.e.number, sort: new Date(t.e.createdAt).toISOString(), title: `${t.e.service} (현장 ${pad3(t.e.number)}번)`, sub: `${state.bathhouses.find((b) => b.id === t.bathId)?.name}` })),
  ].sort((a, b) => b.sort.localeCompare(a.sort));
  const favs = state.bathhouses.filter((b) => state.favorites.includes(b.id));
  const target = state.reservations.find((r) => r.reservationId === cancelId);

  return (
    <div>
      <PageHeader title="마이" back={false} right={<BellButton />} />
      <div className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-coral to-[#F6A98F] p-4 text-white shadow-soft">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white">
          <Hamster size={52} />
        </div>
        <div>
          <div className="text-lg font-extrabold">게스트 햄님</div>
          <div className="text-sm text-white/90">
            예약 {upcoming.length}건 · 즐겨찾기 {favs.length}곳 · 이용 {history.length}회
          </div>
        </div>
      </div>

      {activeTickets.length > 0 && (
        <>
          <SectionTitle>내 대기표</SectionTitle>
          <div className="space-y-2">
            {activeTickets.map(({ bathId, q, e }) => (
              <button key={bathId + e.number} onClick={() => nav(`/queue/${bathId}`)} className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-soft">
                <div className="grid h-12 w-14 place-items-center rounded-2xl bg-coral text-lg font-black text-white">{pad3(e.number)}</div>
                <div className="flex-1">
                  <b>{state.bathhouses.find((b) => b.id === bathId)?.name}</b>
                  <div className="text-sm text-brown-soft">
                    {phaseOf(q, e)} · {e.service}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-brown-faint" />
              </button>
            ))}
          </div>
        </>
      )}

      <SectionTitle>예약 내역</SectionTitle>
      <div className="mb-3 grid grid-cols-2 rounded-2xl bg-cream p-1 text-sm font-bold">
        {(['upcoming', 'past'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`rounded-xl py-2 ${tab === t ? 'bg-white shadow-soft' : 'text-brown-soft'}`}>
            {t === 'upcoming' ? `예정 ${upcoming.length}` : `지난·취소 ${past.length}`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {shown.length === 0 && (
          <Card className="text-center text-sm text-brown-soft">
            {tab === 'upcoming' ? (
              <>
                예정된 예약이 없어요.{' '}
                <Link to="/reserve" className="font-bold text-coral">
                  세신 예약하러 가기
                </Link>
              </>
            ) : (
              '지난 예약이 없어요.'
            )}
          </Card>
        )}
        {shown.map((r) => {
          const bath = state.bathhouses.find((b) => b.id === r.bathhouseId);
          const sc = state.scrubbers.find((s) => s.id === r.scrubberId);
          const st = STATUS_LABEL[r.status];
          return (
            <Card key={r.reservationId} className="!p-0 overflow-hidden">
              <div className="flex gap-3 p-4" data-reservation={r.time}>
                {bath && <BathArt bath={bath} className="h-16 w-16 shrink-0 rounded-2xl" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <b className="truncate">{bath?.name}</b>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${st.c}`}>{st.t}</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatDate(r.date)} {formatTimeKo(r.time)}
                  </div>
                  <div className="text-xs text-brown-soft">
                    {sc?.name} · {r.service} · {r.durationMinutes}분 · {won(r.price)} · 현장 결제 예정
                  </div>
                </div>
              </div>
              {r.status === 'confirmed' && (
                <div className="grid grid-cols-2 border-t border-cream text-sm font-bold">
                  <button
                    onClick={() => {
                      actions.remindNow(r.reservationId);
                    }}
                    className="flex items-center justify-center gap-1 py-3 text-brown-soft hover:bg-cream"
                  >
                    <BellRing className="h-4 w-4" /> 10분 전 알림 시뮬레이션
                  </button>
                  <button onClick={() => setCancelId(r.reservationId)} className="border-l border-cream py-3 text-danger-dark hover:bg-danger-light/40">
                    예약 취소
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <SectionTitle>즐겨찾기</SectionTitle>
      {favs.length ? (
        <div className="space-y-2">
          {favs.map((b) => (
            <button key={b.id} onClick={() => nav(`/bath/${b.id}`)} className="flex w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-soft">
              <BathArt bath={b} className="h-12 w-14 rounded-xl" />
              <div className="flex-1">
                <b>{b.name}</b>
                <div className="text-xs text-brown-soft">
                  {b.region} · {b.price.toLocaleString()}원
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-brown-faint" />
            </button>
          ))}
        </div>
      ) : (
        <Card className="text-sm text-brown-soft">목욕탕 카드의 💛 버튼으로 즐겨찾기를 추가해 보세요.</Card>
      )}

      <SectionTitle>이용 기록</SectionTitle>
      {history.length ? (
        <Card>
          <ul className="divide-y divide-cream">
            {history.map((h) => (
              <li key={h.key} className="py-2 text-sm">
                <b>{h.title}</b>
                <div className="text-xs text-brown-soft">{h.sub}</div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card className="text-sm text-brown-soft">아직 이용 기록이 없어요. 세신 서비스가 완료되면 여기에 쌓여요.</Card>
      )}

      <SectionTitle right={<DemoBadge label="운영자용" />}>운영 · 시연 메뉴</SectionTitle>
      <Card>
        <OpsLinks />
        <details className="mt-3 rounded-2xl bg-cream p-3 lg:hidden">
          <summary className="cursor-pointer text-sm font-bold">테스트 시나리오 보기</summary>
          <div className="mt-2 space-y-2">
            {SCENARIOS.map((s) => (
              <div key={s.id} className="text-xs">
                <b>
                  {s.id}. {s.title}
                </b>
                <ol className="list-decimal pl-5 text-brown-soft">
                  {s.steps.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </details>
        <ResetDemoButton className="mt-3 w-full" />
        <p className="mt-3 text-xs leading-relaxed text-brown-soft">
          데이터는 이 브라우저의 LocalStorage에만 저장돼요. 같은 브라우저의 다른 탭과는 연동되지만, 다른 기기·브라우저 간 실시간 동기화는 아직 지원하지 않아요 (향후 서버 도입 예정).
        </p>
      </Card>

      <ConfirmSheet
        open={!!target}
        title="예약을 취소할까요?"
        body={target && `${formatDate(target.date)} ${formatTimeKo(target.time)} · ${target.service}\n취소하면 해당 시간대가 다시 예약 가능해집니다.`}
        confirmLabel="예약 취소"
        danger
        onConfirm={() => {
          if (cancelId) actions.cancelReservation(cancelId);
        }}
        onClose={() => setCancelId(null)}
      />
    </div>
  );
}
