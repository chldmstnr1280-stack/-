import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { activeEntry, crowd, formatClock, pad3, waitingList } from '../lib/logic';
import { useNow, useStore } from '../store';
import type { Room } from '../types';
import { Hamster } from '../components/ui';

/** 입구·공용 디스플레이: 높은 명도 대비, 큰 숫자 */
function DisplayShell({ children, title }: { children: ReactNode; title: string }) {
  const now = useNow(10_000);
  useEffect(() => {
    document.title = `${title} · 멜팅햄 디스플레이`;
    return () => {
      document.title = 'MELTING HAM · 멜팅햄';
    };
  }, [title]);
  return (
    <div className="flex min-h-screen flex-col bg-[#1F1814] text-white">
      <div className="flex items-center justify-between px-6 py-4 text-white/70">
        <div className="flex items-center gap-2">
          <Hamster size={32} />
          <span className="font-extrabold text-white">MELTING HAM</span>
        </div>
        <span className="text-xl font-bold tabular-nums">{formatClock(now)}</span>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
      <div className="px-6 py-3 text-center text-xs text-white/40">
        DEMO · 시뮬레이션 데이터 · 같은 브라우저의 관리자 화면 변경 사항이 실시간 반영됩니다 ·{' '}
        <Link to="/" className="underline">
          이용자 화면
        </Link>
      </div>
    </div>
  );
}

const LEVEL_COLOR = { available: '#5BD69B', moderate: '#FFD166', busy: '#FF9F43', very_busy: '#FF6B6B' } as const;

function RoomTile({ r, big }: { r: Room; big?: boolean }) {
  const c = crowd(r.currentOccupancy, r.recommendedOccupancy);
  const color = LEVEL_COLOR[c.level];
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border-4 bg-black/30 p-6 text-center" style={{ borderColor: color }} data-display-room={r.name}>
      <div className={`font-black ${big ? 'text-6xl sm:text-8xl' : 'text-4xl sm:text-5xl'}`}>
        {r.emoji} {r.name}
      </div>
      <div className={`mt-4 font-black tabular-nums ${big ? 'text-[7rem] leading-none sm:text-[11rem]' : 'text-7xl sm:text-8xl'}`}>
        <span data-testid="display-current">{r.currentOccupancy}</span>
        <span className={`${big ? 'text-5xl sm:text-7xl' : 'text-3xl sm:text-4xl'} text-white/70`}>명</span>
      </div>
      <div className={`mt-2 font-bold text-white/80 ${big ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>권장 {r.recommendedOccupancy}명</div>
      <div className={`mt-5 inline-flex items-center gap-3 rounded-full px-8 py-3 font-black text-[#1F1814] ${big ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-3xl'}`} style={{ background: color }}>
        {c.emoji} {c.label}
      </div>
    </div>
  );
}

export function RoomDisplay() {
  const { roomId } = useParams();
  const { state } = useStore();
  const r = state.rooms.find((x) => x.roomId === roomId);
  if (!r) return <DisplayShell title="디스플레이">찜질방을 찾을 수 없어요.</DisplayShell>;
  return (
    <DisplayShell title={r.name}>
      <div className="flex flex-1 p-4 sm:p-8">
        <div className="flex-1">
          <RoomTile r={r} big />
        </div>
      </div>
    </DisplayShell>
  );
}

export function RoomsDisplay() {
  const { bathId } = useParams();
  const { state } = useStore();
  const bath = state.bathhouses.find((b) => b.id === bathId);
  const rooms = state.rooms.filter((r) => r.bathhouseId === bathId);
  return (
    <DisplayShell title={`${bath?.name ?? ''} 찜질방`}>
      <h1 className="px-6 text-3xl font-black sm:text-4xl">{bath?.name} 찜질방 현황</h1>
      <div className={`grid flex-1 gap-4 p-4 sm:p-6 ${rooms.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {rooms.map((r) => (
          <RoomTile key={r.roomId} r={r} />
        ))}
        {!rooms.length && <p className="text-xl">등록된 찜질방이 없어요.</p>}
      </div>
    </DisplayShell>
  );
}

/** 공용 대기 디스플레이: 이름·전화번호 없이 대기번호만 표시 */
export function QueueDisplay() {
  const { bathId = '' } = useParams();
  const { state } = useStore();
  const bath = state.bathhouses.find((b) => b.id === bathId);
  const q = state.queues[bathId];
  const a = q && activeEntry(q);
  const next = q ? waitingList(q).slice(0, 6) : [];
  return (
    <DisplayShell title="세신 대기">
      <h1 className="px-6 text-3xl font-black sm:text-4xl">{bath?.name} 세신 대기 안내</h1>
      <div className="grid flex-1 gap-4 p-4 sm:grid-cols-[1.3fr_1fr] sm:p-6">
        <div className={`flex flex-col items-center justify-center rounded-[2rem] border-4 p-6 text-center ${a?.status === 'called' ? 'border-[#F28C78] bg-[#F28C78]/20' : 'border-white/20 bg-black/30'}`}>
          <div className="text-3xl font-black text-white/80 sm:text-4xl">{a?.status === 'called' ? '📢 호출 중' : a ? '🧽 서비스 중' : '대기 없음'}</div>
          <div className="mt-2 text-[8rem] font-black leading-none tabular-nums sm:text-[12rem]" data-testid="display-queue-current">
            {a ? pad3(a.number) : '---'}
          </div>
          {a?.status === 'called' && <div className="mt-4 text-2xl font-bold sm:text-3xl">세신대로 와주세요</div>}
        </div>
        <div className="rounded-[2rem] bg-black/30 p-6">
          <div className="text-2xl font-black text-white/80">다음 순서</div>
          <ol className="mt-4 grid grid-cols-2 gap-3">
            {next.map((e, i) => (
              <li key={e.number} className={`rounded-2xl py-4 text-center text-5xl font-black tabular-nums ${i === 0 ? 'bg-[#F7D78B] text-[#1F1814]' : 'bg-white/10'}`}>
                {pad3(e.number)}
              </li>
            ))}
            {!next.length && <li className="col-span-2 text-xl text-white/60">대기 중인 번호가 없어요</li>}
          </ol>
          <p className="mt-6 text-sm text-white/50">개인정보 보호를 위해 대기번호만 표시합니다.</p>
        </div>
      </div>
    </DisplayShell>
  );
}
