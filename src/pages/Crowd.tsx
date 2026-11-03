import { DisplayLink } from '../components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { crowd, formatClock, quietHours } from '../lib/logic';
import { useStore } from '../store';
import type { Bathhouse } from '../types';
import { Card, Chip, CrowdBadge, CrowdBar, DemoBadge, PageHeader, SectionTitle } from '../components/ui';

export function HourlyChart({ bath }: { bath: Bathhouse }) {
  const hour = new Date().getHours();
  const max = Math.max(bath.comfortCapacity, ...bath.hourly);
  const quiet = quietHours(bath.hourly, bath.comfortCapacity, hour);
  return (
    <div>
      <div className="flex h-32 items-end gap-[3px]" role="img" aria-label="시간대별 예상 방문객 그래프 (시뮬레이션)">
        {bath.hourly.map((v, i) => {
          const h = 6 + i;
          const c = crowd(v, bath.comfortCapacity);
          const now = h === hour;
          return (
            <div key={h} className="group relative flex h-full flex-1 flex-col justify-end">
              <div className={`w-full rounded-t-md ${v === 0 ? 'bg-cream' : c.bar} ${now ? 'ring-2 ring-brown ring-offset-1' : 'opacity-80'}`} style={{ height: `${Math.max(3, (v / max) * 100)}%` }} title={`${h}시 · 약 ${v}명 · ${v === 0 ? '영업 외' : c.label}`} />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-[3px] text-[10px] text-brown-soft">
        {bath.hourly.map((_, i) => (
          <div key={i} className={`flex-1 text-center ${6 + i === hour ? 'font-bold text-brown' : ''}`}>
            {(6 + i) % 3 === 0 ? 6 + i : ''}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-2xl bg-ok-light/60 p-3 text-sm">
        <b>예상 여유 시간대</b>{' '}
        {quiet.length ? quiet.map((x) => `${x.hour}시`).join(', ') : '오늘 남은 시간 중 여유 시간대 없음'}
      </div>
    </div>
  );
}

export default function CrowdPage() {
  const { bathId } = useParams();
  const { state } = useStore();
  const nav = useNavigate();
  const withRooms = state.bathhouses.filter((b) => state.rooms.some((r) => r.bathhouseId === b.id));
  const fav = withRooms.find((b) => state.favorites.includes(b.id));
  const bath = state.bathhouses.find((b) => b.id === bathId) ?? fav ?? withRooms[0];
  const rooms = state.rooms.filter((r) => r.bathhouseId === bath.id);
  const fc = crowd(bath.currentVisitors, bath.comfortCapacity);
  const updated = rooms.reduce((m, r) => (r.updatedAt > m ? r.updatedAt : m), '');

  return (
    <div>
      <PageHeader title="찜질방 현황" back={false} right={<DemoBadge label="시뮬레이션" />} />
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {state.bathhouses.map((b) => (
          <Chip key={b.id} active={b.id === bath.id} onClick={() => nav(`/crowd/${b.id}`, { replace: true })}>
            {state.favorites.includes(b.id) ? '💛 ' : ''}
            {b.name}
          </Chip>
        ))}
      </div>

      <Card className="mt-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-brown-soft">시설 전체 혼잡도</div>
            <div className="mt-0.5 text-3xl font-black">
              {bath.currentVisitors}
              <span className="text-base font-bold text-brown-soft">명 방문 중</span>
            </div>
            <div className="text-xs text-brown-soft">쾌적 기준 {bath.comfortCapacity}명 대비 {fc.pct}%</div>
          </div>
          <CrowdBadge current={bath.currentVisitors} recommended={bath.comfortCapacity} size="md" />
        </div>
        <div className="mt-3">
          <CrowdBar current={bath.currentVisitors} recommended={bath.comfortCapacity} />
        </div>
        <div className="mt-5 text-sm font-bold">시간대별 혼잡도</div>
        <div className="mt-2">
          <HourlyChart bath={bath} />
        </div>
      </Card>

      <SectionTitle right={updated ? <span className="text-xs text-brown-soft">업데이트 {formatClock(updated)}</span> : undefined}>찜질방별 현재 인원</SectionTitle>
      {rooms.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.map((r) => {
            const c = crowd(r.currentOccupancy, r.recommendedOccupancy);
            return (
              <div key={r.roomId} className="rounded-3xl bg-white p-4 shadow-soft" data-room={r.name}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream text-2xl">{r.emoji}</span>
                    <div>
                      <b className="text-lg">{r.name}</b>
                      <div className="text-xs text-brown-soft">{r.temp}</div>
                    </div>
                  </div>
                  <CrowdBadge current={r.currentOccupancy} recommended={r.recommendedOccupancy} size="md" />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <span className="text-xs text-brown-soft">현재 </span>
                    <span className="text-3xl font-black" data-testid="room-current">
                      {r.currentOccupancy}
                    </span>
                    <span className="text-sm font-bold">명</span>
                    <span className="text-sm text-brown-soft"> / 권장 {r.recommendedOccupancy}명</span>
                  </div>
                  <div className={`text-xl font-black ${c.text}`} data-testid="room-pct">
                    {c.pct}%
                  </div>
                </div>
                <div className="mt-2">
                  <CrowdBar current={r.currentOccupancy} recommended={r.recommendedOccupancy} />
                </div>
                <DisplayLink to={`/display/room/${r.roomId}`} className="mt-3 flex items-center gap-1 text-xs font-semibold text-brown-soft underline">
                  <Monitor className="h-3.5 w-3.5" /> 입구 디스플레이
                </DisplayLink>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="text-sm text-brown-soft">이 시설에는 혼잡도를 제공하는 찜질방이 없어요.</Card>
      )}

      <div className="mt-4 rounded-2xl bg-cream p-3 text-xs leading-relaxed text-brown-soft">
        혼잡도 기준: 0~40% 여유 · 41~70% 보통 · 71~99% 혼잡 · 100% 이상 매우 혼잡.
        <br />
        권장 인원은 프로토타입용 설정값이며 법정 수용 인원을 의미하지 않습니다. 인원 정보는 관리자 화면에서 조작하는 시뮬레이션 데이터입니다.
      </div>
    </div>
  );
}
