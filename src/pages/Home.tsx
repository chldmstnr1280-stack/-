import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Search } from 'lucide-react';
import { CATEGORIES, REGIONS } from '../data/seed';
import { aheadInfo, crowd, formatDate, formatTimeKo, pad3, phaseOf, todayStr } from '../lib/logic';
import { useStore } from '../store';
import type { Region } from '../types';
import { BathCard, BellButton, DemoBadge, Hamster, Logo, SectionTitle } from '../components/ui';

export function MyStatusCards() {
  const { state } = useStore();
  const nav = useNavigate();
  const tickets = Object.entries(state.queues).flatMap(([bathId, q]) =>
    q.entries.filter((e) => e.isMine && ['waiting', 'called', 'in_service', 'held'].includes(e.status)).map((e) => ({ bathId, q, e })),
  );
  const today = todayStr();
  const upcoming = state.reservations
    .filter((r) => (r.status === 'confirmed' || r.status === 'in_service') && r.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  if (!tickets.length && !upcoming.length) return null;
  return (
    <div className="mt-4 space-y-2">
      {tickets.map(({ bathId, q, e }) => {
        const bath = state.bathhouses.find((b) => b.id === bathId);
        const phase = phaseOf(q, e);
        const { ahead, minutes } = aheadInfo(q, e);
        const hot = phase === '호출 중' || phase === '곧 차례';
        return (
          <button key={bathId + e.number} onClick={() => nav(`/queue/${bathId}`)} className={`flex w-full items-center gap-3 rounded-3xl p-4 text-left shadow-soft ${hot ? 'bg-coral text-white' : 'bg-white'}`}>
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-black ${hot ? 'bg-white text-coral' : 'bg-cream'}`}>{pad3(e.number)}</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold opacity-80">현장 대기 · {bath?.name}</div>
              <div className="font-extrabold">{phase}</div>
              <div className="text-xs opacity-80">{e.status === 'waiting' ? `앞 대기 ${ahead}명 · 약 ${minutes}분` : e.service}</div>
            </div>
            <ChevronRight className="h-5 w-5 opacity-60" />
          </button>
        );
      })}
      {upcoming.slice(0, 1).map((r) => {
        const bath = state.bathhouses.find((b) => b.id === r.bathhouseId);
        const sc = state.scrubbers.find((s) => s.id === r.scrubberId);
        return (
          <button key={r.reservationId} onClick={() => nav('/my')} className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-soft">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-butter-light text-2xl">🧽</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-brown-soft">다가오는 세신 예약</div>
              <div className="truncate font-extrabold">
                {formatDate(r.date)} {formatTimeKo(r.time)}
              </div>
              <div className="truncate text-xs text-brown-soft">
                {bath?.name} · {sc?.name} · {r.service}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-brown-faint" />
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { state, actions } = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const inRegion = state.bathhouses.filter((b) => b.region === state.region);
  const others = state.bathhouses.filter((b) => b.region !== state.region).sort((a, b) => b.rating - a.rating);
  const crowdBath = state.bathhouses.find((b) => state.favorites.includes(b.id) && state.rooms.some((r) => r.bathhouseId === b.id)) ?? state.bathhouses.find((b) => state.rooms.some((r) => r.bathhouseId === b.id) && b.region === state.region) ?? state.bathhouses[0];
  const crowdRooms = state.rooms.filter((r) => r.bathhouseId === crowdBath.id);

  return (
    <div>
      <header className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1">
          <label className="flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-sm font-bold">
            <MapPin className="h-4 w-4 text-coral" />
            <span className="sr-only">지역 선택</span>
            <select value={state.region} onChange={(e) => actions.setRegion(e.target.value as Region)} className="bg-transparent font-bold focus:outline-none">
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <BellButton />
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav(`/search?q=${encodeURIComponent(q)}`);
        }}
        className="mt-1 flex items-center gap-2 rounded-2xl border-2 border-coral-light bg-white px-4 py-3 shadow-soft focus-within:border-coral"
      >
        <Search className="h-5 w-5 text-coral" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="어디에서 목욕하고 싶으세요?" className="w-full bg-transparent text-[15px] placeholder:text-brown-faint focus:outline-none" aria-label="목욕탕 검색" />
      </form>

      <MyStatusCards />

      <div className="mt-5 grid grid-cols-3 gap-2">
        {CATEGORIES.map((c) => (
          <Link key={c.tag} to={`/search?cat=${c.tag}`} className="flex flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 text-center shadow-soft transition hover:bg-cream">
            <span className="text-2xl">{c.emoji}</span>
            <span className="text-[12px] font-semibold leading-tight">{c.label}</span>
          </Link>
        ))}
      </div>

      <SectionTitle right={<Link to={`/search?region=${state.region}`} className="text-sm font-semibold text-coral">전체보기</Link>}>
        {state.region} 추천 목욕탕
      </SectionTitle>
      {inRegion.length ? (
        <div className="space-y-3">
          {inRegion.map((b) => (
            <BathCard key={b.id} bath={b} onOpen={() => nav(`/bath/${b.id}`)} />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
          <Hamster size={44} mood="sleepy" />
          <p className="text-sm text-brown-soft">
            아직 <b className="text-brown">{state.region}</b> 지역에 등록된 시연용 목욕탕이 없어요. 다른 지역의 인기 시설을 보여드릴게요.
          </p>
        </div>
      )}

      <SectionTitle right={<Link to={`/crowd/${crowdBath.id}`} className="text-sm font-semibold text-coral">자세히</Link>}>
        지금 찜질방 혼잡도
      </SectionTitle>
      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="mb-2 flex items-center justify-between text-sm">
          <b>{crowdBath.name}</b>
          <DemoBadge label="시뮬레이션" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {crowdRooms.map((r) => (
            <Link key={r.roomId} to={`/crowd/${crowdBath.id}`} className="rounded-2xl bg-cream px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold">
                  {r.emoji} {r.name}
                </span>
                <span className={`text-xs font-bold ${crowd(r.currentOccupancy, r.recommendedOccupancy).text}`}>{crowd(r.currentOccupancy, r.recommendedOccupancy).label}</span>
              </div>
              <div className="text-xs text-brown-soft">
                {r.currentOccupancy} / {r.recommendedOccupancy}명
              </div>
            </Link>
          ))}
        </div>
      </div>

      {inRegion.length < state.bathhouses.length && (
        <>
          <SectionTitle>다른 지역 인기 시설</SectionTitle>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {others.map((b) => (
              <div key={b.id} className="w-[78%] shrink-0 snap-start">
                <BathCard bath={b} compact onOpen={() => nav(`/bath/${b.id}`)} />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-cream p-3 text-xs text-brown-soft">
        <DemoBadge />
        <span>모든 시설·세신사·혼잡도 정보는 프로토타입 시연용 가상 데이터입니다.</span>
      </div>
    </div>
  );
}
