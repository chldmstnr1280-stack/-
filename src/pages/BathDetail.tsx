import { DisplayLink } from '../components/ui';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Clock, Droplets, Info, MapPin, Monitor, Navigation, Phone, Ticket, Wallet } from 'lucide-react';
import { SERVICES } from '../data/seed';
import { crowd, currentNumber, daySlots, formatClock, formatDateDots, pad3, scrubbersAt, todayStr, waitingList } from '../lib/logic';
import { useStore } from '../store';
import type { Bathhouse } from '../types';
import { BathArt, Button, ConfirmSheet, CrowdBadge, CrowdBar, DemoBadge, EmptyState, FACILITY_EMOJI, FavButton, SectionTitle } from '../components/ui';

const FACILITY_DESC: Record<string, string> = {
  온탕: '40℃ 내외 대형 온탕',
  냉탕: '18℃ 내외 냉탕',
  '건식 사우나': '건조한 고온 사우나',
  '습식 사우나': '촉촉한 스팀 사우나',
  황토방: '은은한 원적외선 찜질',
  소금방: '소금벽 찜질방',
  편백방: '편백 향 가득한 찜질방',
  얼음방: '찜질 후 열 식히기',
  수면실: '조용한 휴식 공간',
  식당: '식혜·계란·라면',
};

export function formatUpdated(iso: string) {
  if (!iso) return '정보 없음';
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay ? `오늘 ${formatClock(iso)}` : `${formatDateDots(iso.slice(0, 10))} ${formatClock(iso)}`;
}

export function HygienePanel({ bath }: { bath: Bathhouse }) {
  const h = bath.hygiene;
  const verified = h.waterTestAgency === '지자체' && h.waterTestEvidence && h.waterTestResult !== '미확인';
  const resultColor = h.waterTestResult === '적합' ? 'bg-ok-light text-ok-dark' : h.waterTestResult === '부적합' ? 'bg-danger-light text-danger-dark' : 'bg-cream text-brown-soft';
  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="text-brown-soft">{k}</span>
      <span className="text-right font-semibold">{v}</span>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold">
            <Droplets className="h-4 w-4 text-[#5BA4C9]" /> 수질검사
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${verified ? 'bg-ok-light text-ok-dark' : 'bg-cream text-brown-soft'}`}>
            {h.waterTestResult === '미확인' ? '확인 불가' : verified ? '지자체 검사 · 증빙 확인' : '사업장 제공 정보'}
          </span>
        </div>
        <div className="divide-y divide-cream">
          <Row k="최근 수질검사" v={<span className={`rounded-full px-2.5 py-0.5 ${resultColor}`}>{h.waterTestResult}</span>} />
          <Row k="검사일" v={h.waterTestDate ? formatDateDots(h.waterTestDate) : '미확인'} />
          <Row k="검사 주체" v={h.waterTestAgency || '미확인'} />
          <Row k="증빙 서류" v={h.waterTestEvidence ? '제출됨' : '미제출'} />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="h-4 w-4 text-coral" /> 물 교체 · 청소 기록
          </div>
          <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-brown-soft">사업장 제공 정보</span>
        </div>
        <div className="divide-y divide-cream">
          <Row k="최근 물 교체" v={h.lastWaterChange || '정보 없음'} />
          <Row k="다음 청소 예정" v={h.nextCleaning || '정보 없음'} />
          <Row k="정보 업데이트" v={formatUpdated(h.updatedAt)} />
        </div>
      </div>
      <p className="flex gap-1.5 rounded-2xl bg-butter-light p-3 text-xs leading-relaxed text-brown-soft">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          물 교체 시간만으로 수질의 안전성을 보증하지 않습니다. 사업장이 등록한 정보는 멜팅햄의 공식 인증이 아니며, 표시된 모든 값은 프로토타입용 가상 데이터입니다.
        </span>
      </p>
    </div>
  );
}

export default function BathDetail() {
  const { id } = useParams();
  const { state } = useStore();
  const nav = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  const bath = state.bathhouses.find((b) => b.id === id);
  if (!bath) return <div className="pt-10"><EmptyState title="시설을 찾을 수 없어요" action={<Button onClick={() => nav('/search')}>목욕탕 찾기</Button>} /></div>;

  const rooms = state.rooms.filter((r) => r.bathhouseId === bath.id);
  const q = state.queues[bath.id];
  const waiting = q ? waitingList(q).length : 0;
  const today = todayStr();
  const dow = new Date().getDay();
  const staff = scrubbersAt(state, bath.id);
  const working = staff.filter((s) => s.workDays.includes(dow));
  const openTimes = Array.from(new Set(working.flatMap((s) => daySlots(state, s.id, today).filter((x) => x.reason === 'available').map((x) => x.time)))).sort();
  const offered = SERVICES.filter((sv) => staff.some((s) => s.services.includes(sv.id)));
  const fc = crowd(bath.currentVisitors, bath.comfortCapacity);

  return (
    <div>
      <div className="relative -mx-4">
        <BathArt bath={bath} className="h-56 w-full" />
        <button onClick={() => nav(-1)} className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-soft" aria-label="뒤로">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <FavButton id={bath.id} className="absolute right-3 top-3" />
        <DemoBadge className="absolute bottom-3 left-4" label="가상 시설 · 실제 사진 아님" />
      </div>

      <div className="relative -mt-5 rounded-3xl bg-white p-5 shadow-soft">
        <div className="text-xs font-semibold text-coral">{bath.type}</div>
        <h1 className="mt-0.5 text-2xl font-extrabold">{bath.name}</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-brown-soft">
          ★ {bath.rating.toFixed(1)} <span className="text-[11px]">(데모 평점)</span>
          <CrowdBadge current={bath.currentVisitors} recommended={bath.comfortCapacity} />
        </div>
        <p className="mt-3 text-sm leading-relaxed">{bath.description}</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-coral" />
            {bath.address}
          </div>
          <div className="flex gap-2">
            <Clock className="h-4 w-4 shrink-0 text-coral" />
            영업시간 {bath.openingHours}
          </div>
          <div className="flex gap-2">
            <Wallet className="h-4 w-4 shrink-0 text-coral" />
            입장료 <b>{bath.price.toLocaleString()}원</b>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setMapOpen(true)}>
            <Navigation className="h-4 w-4" /> 길찾기
          </Button>
          <Button variant="ghost" onClick={() => setMapOpen(true)}>
            <Phone className="h-4 w-4" /> 전화
          </Button>
        </div>
      </div>

      <SectionTitle>시설 소개</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {bath.facilities.map((f) => (
          <div key={f} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-2xl">{FACILITY_EMOJI[f]}</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{f}</div>
              <div className="truncate text-[11px] text-brown-soft">{FACILITY_DESC[f]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {bath.services.map((s) => (
          <span key={s} className="rounded-full bg-butter-light px-2.5 py-1 text-xs font-semibold">
            {s}
          </span>
        ))}
      </div>

      <SectionTitle>위생 및 수질 정보</SectionTitle>
      <HygienePanel bath={bath} />

      <SectionTitle>세신 서비스</SectionTitle>
      {bath.scrubReservation ? (
        <div className="rounded-3xl bg-white p-4 shadow-soft">
          <div className="divide-y divide-cream">
            {offered.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-semibold">{s.name}</span>
                <span>
                  {s.price.toLocaleString()}원 <span className="text-brown-soft">· 약 {s.durationMinutes}분</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-cream p-2.5">
              <div className="text-[11px] text-brown-soft">오늘 근무</div>
              <div className="text-lg font-extrabold">{working.length}명</div>
            </div>
            <div className="rounded-2xl bg-cream p-2.5">
              <div className="text-[11px] text-brown-soft">현재 진행</div>
              <div className="text-lg font-extrabold">{q ? pad3(currentNumber(q)) : '-'}</div>
            </div>
            <div className="rounded-2xl bg-cream p-2.5">
              <div className="text-[11px] text-brown-soft">현장 대기</div>
              <div className="text-lg font-extrabold text-coral">{waiting}명</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-brown-soft">근무 세신사: {working.length ? working.map((s) => `${s.name}(${s.section})`).join(', ') : '오늘 근무자 없음'}</div>
          <div className="mt-2">
            <div className="text-xs font-bold text-brown-soft">오늘 예약 가능한 시간</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {openTimes.length ? openTimes.map((t) => <span key={t} className="rounded-lg bg-ok-light px-2 py-1 text-xs font-bold text-ok-dark">{t}</span>) : <span className="text-xs text-brown-soft">오늘은 예약 가능한 시간이 없어요. 다른 날짜를 확인해 보세요.</span>}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={() => nav(`/book/${bath.id}`)}>세신 예약하기</Button>
            <Button variant="outline" onClick={() => nav(`/queue/${bath.id}`)}>
              <Ticket className="h-4 w-4" /> 현장 대기 등록
            </Button>
          </div>
        </div>
      ) : bath.services.includes('세신') ? (
        <div className="rounded-3xl bg-white p-4 text-sm shadow-soft">
          이 시설은 세신을 <b>현장 접수</b>로만 운영해요. 온라인 예약과 앱 대기 등록은 지원하지 않습니다.
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-4 text-sm text-brown-soft shadow-soft">이 시설은 세신 서비스를 제공하지 않아요.</div>
      )}

      <SectionTitle right={rooms.length ? <Link to={`/crowd/${bath.id}`} className="text-sm font-semibold text-coral">전체 현황</Link> : undefined}>실시간 찜질방 혼잡도</SectionTitle>
      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-cream px-3 py-2.5 text-sm">
          <span>
            시설 전체 방문객 <b>{bath.currentVisitors}명</b>
          </span>
          <span className={`font-bold ${fc.text}`}>
            {fc.label} {fc.pct}%
          </span>
        </div>
        {rooms.length ? (
          <div className="space-y-3">
            {rooms.map((r) => {
              const c = crowd(r.currentOccupancy, r.recommendedOccupancy);
              return (
                <div key={r.roomId}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-bold">
                      {r.emoji} {r.name} <span className="font-normal text-brown-soft">{r.temp}</span>
                    </span>
                    <span>
                      <b>{r.currentOccupancy}</b> / {r.recommendedOccupancy}명 — <b className={c.text}>{c.label}</b>
                    </span>
                  </div>
                  <CrowdBar current={r.currentOccupancy} recommended={r.recommendedOccupancy} />
                </div>
              );
            })}
            <DisplayLink to={`/display/rooms/${bath.id}`} className="flex items-center justify-center gap-1.5 pt-1 text-xs font-semibold text-brown-soft underline">
              <Monitor className="h-3.5 w-3.5" /> 입구 디스플레이 화면 보기
            </DisplayLink>
          </div>
        ) : (
          <p className="text-sm text-brown-soft">이 시설에는 혼잡도를 제공하는 찜질방이 없어요.</p>
        )}
        <p className="mt-3 text-[11px] text-brown-faint">시뮬레이션 데이터 · 권장 인원은 프로토타입 설정값이며 법정 수용 인원이 아닙니다.</p>
      </div>

      <ConfirmSheet
        open={mapOpen}
        title="시연용 가상 시설이에요"
        body={
          <>
            <b>{bath.address}</b>
            <br />
            프로토타입에서는 지도 API와 전화 연결을 지원하지 않아요. 실제 서비스에서는 지도 앱 길찾기와 전화 연결로 이어집니다.
          </>
        }
        confirmLabel="확인"
        onConfirm={() => {}}
        onClose={() => setMapOpen(false)}
      />
    </div>
  );
}
