import { DisplayLink } from '../components/ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Monitor, Plus } from 'lucide-react';
import { BASE_SLOTS, SERVICES } from '../data/seed';
import { activeReservations, crowd, DOW_LABELS, externalBookings, formatClock, pad3, scrubbersAt, todayStr, waitingList } from '../lib/logic';
import { useStore } from '../store';
import type { Bathhouse, Hygiene, ServiceId, WaterTestResult } from '../types';
import { OpsShell, Panel, QueueControl, Stat } from '../components/Ops';
import { CrowdBadge, CrowdBar, useToast } from '../components/ui';
import { HourlyChart } from './Crowd';
import { formatUpdated } from './BathDetail';

const TABS = ['대시보드', '대기·일정', '찜질방', '위생·수질', '시설 정보', '세신사'] as const;
type Tab = (typeof TABS)[number];

const input = 'w-full rounded-xl bg-cream px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-coral';

export default function AdminPage() {
  const { state } = useStore();
  const [bathId, setBathId] = useState('bath_001');
  const [tab, setTab] = useState<Tab>(() => (new URLSearchParams(window.location.hash.split('?')[1]).get('tab') as Tab) || '대시보드');
  const bath = state.bathhouses.find((b) => b.id === bathId) ?? state.bathhouses[0];

  return (
    <OpsShell
      title="목욕탕 관리자"
      subtitle={bath.name}
      right={
        <select value={bath.id} onChange={(e) => setBathId(e.target.value)} className="max-w-[40vw] rounded-xl bg-white/10 px-2 py-1.5 text-sm font-bold text-white focus:outline-none" aria-label="관리할 목욕탕">
          {state.bathhouses.map((b) => (
            <option key={b.id} value={b.id} className="text-brown">
              {b.name}
            </option>
          ))}
        </select>
      }
    >
      <nav className="no-scrollbar -mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4" aria-label="관리 메뉴">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${tab === t ? 'bg-brown text-white' : 'bg-white text-brown shadow-soft'}`}>
            {t}
          </button>
        ))}
      </nav>
      {tab === '대시보드' && <Dashboard bath={bath} go={setTab} />}
      {tab === '대기·일정' && <QueueTab bath={bath} />}
      {tab === '찜질방' && <RoomsTab bath={bath} />}
      {tab === '위생·수질' && <HygieneTab key={bath.id} bath={bath} />}
      {tab === '시설 정보' && <InfoTab key={bath.id} bath={bath} />}
      {tab === '세신사' && <StaffTab bath={bath} />}
    </OpsShell>
  );
}

function VisitorControl({ bath }: { bath: Bathhouse }) {
  const { actions } = useStore();
  return (
    <div className="flex items-center gap-2">
      <button className="grid h-9 w-9 place-items-center rounded-xl bg-cream" onClick={() => actions.adjustVisitors(bath.id, -1)} aria-label="방문객 -1">
        <Minus className="h-4 w-4" />
      </button>
      <b className="w-14 text-center text-lg">{bath.currentVisitors}명</b>
      <button className="grid h-9 w-9 place-items-center rounded-xl bg-cream" onClick={() => actions.adjustVisitors(bath.id, 1)} aria-label="방문객 +1">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function todayBookings(state: ReturnType<typeof useStore>['state'], bathId: string) {
  const today = todayStr();
  const dow = new Date().getDay();
  return scrubbersAt(state, bathId)
    .filter((s) => s.workDays.includes(dow))
    .flatMap((s) => [
      ...activeReservations(state, s.id, today)
        .filter((r) => r.bathhouseId === bathId)
        .map((r) => ({ time: r.time, who: s.name, label: `앱 예약 · ${r.service}`, status: r.status, app: true })),
      ...externalBookings(s.id, today).map((e) => ({ time: e.time, who: s.name, label: '타 고객 예약 (데모)', status: 'confirmed' as const, app: false })),
    ])
    .sort((a, b) => a.time.localeCompare(b.time));
}

function Dashboard({ bath, go }: { bath: Bathhouse; go: (t: Tab) => void }) {
  const { state } = useStore();
  const rooms = state.rooms.filter((r) => r.bathhouseId === bath.id);
  const q = state.queues[bath.id];
  const bookings = todayBookings(state, bath.id);
  const roomPeople = rooms.reduce((n, r) => n + r.currentOccupancy, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="오늘 예약 건수" value={`${bookings.length}건`} />
        <Stat label="현재 대기 인원" value={`${q ? waitingList(q).length : 0}명`} accent />
        <Stat label="현재 시설 이용 인원" value={`${bath.currentVisitors}명`} />
        <Stat label="찜질방 이용 인원" value={`${roomPeople}명`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="시설 전체 혼잡도" right={<VisitorControl bath={bath} />}>
          <div className="mb-2 flex items-center gap-2">
            <CrowdBadge current={bath.currentVisitors} recommended={bath.comfortCapacity} showPct size="md" />
            <span className="text-xs text-brown-soft">쾌적 기준 {bath.comfortCapacity}명</span>
          </div>
          <HourlyChart bath={bath} />
        </Panel>
        <Panel title="찜질방별 혼잡도" right={<button onClick={() => go('찜질방')} className="text-sm font-bold text-coral">인원 관리 →</button>}>
          {rooms.length ? (
            <div className="space-y-3">
              {rooms.map((r) => (
                <div key={r.roomId}>
                  <div className="mb-1 flex justify-between text-sm">
                    <b>
                      {r.emoji} {r.name}
                    </b>
                    <span>
                      {r.currentOccupancy}/{r.recommendedOccupancy}명 · <b className={crowd(r.currentOccupancy, r.recommendedOccupancy).text}>{crowd(r.currentOccupancy, r.recommendedOccupancy).label}</b>
                    </span>
                  </div>
                  <CrowdBar current={r.currentOccupancy} recommended={r.recommendedOccupancy} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brown-soft">등록된 찜질방이 없어요.</p>
          )}
        </Panel>
        <Panel title="오늘 청소 및 물 교체 일정" right={<button onClick={() => go('위생·수질')} className="text-sm font-bold text-coral">기록하기 →</button>}>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between rounded-xl bg-cream px-3 py-2">
              <span>💧 최근 물 교체</span>
              <b>{bath.hygiene.lastWaterChange || '정보 없음'}</b>
            </li>
            <li className="flex justify-between rounded-xl bg-cream px-3 py-2">
              <span>🧹 다음 청소 예정</span>
              <b>{bath.hygiene.nextCleaning || '정보 없음'}</b>
            </li>
            <li className="flex justify-between rounded-xl bg-cream px-3 py-2">
              <span>🧪 수질검사</span>
              <b>
                {bath.hygiene.waterTestResult} {bath.hygiene.waterTestDate && `(${bath.hygiene.waterTestDate})`}
              </b>
            </li>
          </ul>
        </Panel>
        <Panel title="오늘 세신 예약" right={<button onClick={() => go('대기·일정')} className="text-sm font-bold text-coral">대기 관리 →</button>}>
          {bookings.length ? (
            <ul className="max-h-56 space-y-1 overflow-y-auto text-sm">
              {bookings.map((b, i) => (
                <li key={i} className={`flex gap-2 rounded-lg px-2 py-1 ${b.app ? 'bg-coral-light/40' : ''}`}>
                  <b className="w-12">{b.time}</b>
                  <span className="w-16 shrink-0 text-brown-soft">{b.who.replace(' 세신사', '')}</span>
                  <span className="truncate">{b.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brown-soft">오늘 예약이 없어요.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function QueueTab({ bath }: { bath: Bathhouse }) {
  const { state } = useStore();
  const bookings = todayBookings(state, bath.id);
  const q = state.queues[bath.id];
  if (!bath.scrubReservation || !q) return <Panel title="현장 대기">이 시설은 앱 기반 세신 대기를 운영하지 않아요.</Panel>;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <Panel title="현장 세신 대기 운영">
        <QueueControl bathId={bath.id} />
      </Panel>
      <Panel title="통합 일정표 (예약 + 현장)">
        <p className="mb-2 text-xs text-brown-soft">예약 고객과 현장 대기 고객을 한 화면에서 확인해요.</p>
        <ul className="space-y-1 text-sm">
          {BASE_SLOTS.map((t) => {
            const at = bookings.filter((b) => b.time === t);
            return (
              <li key={t} className="flex gap-2 border-b border-cream py-1.5">
                <b className="w-12 shrink-0">{t}</b>
                <div className="flex-1 space-y-0.5">
                  {at.length ? (
                    at.map((b, i) => (
                      <div key={i} className={`rounded-lg px-2 py-0.5 ${b.app ? 'bg-coral-light/50' : 'bg-cream'}`}>
                        <span className="mr-1 rounded bg-white px-1 text-[10px] font-bold">예약</span>
                        {b.who} · {b.label}
                      </div>
                    ))
                  ) : (
                    <span className="text-brown-faint">-</span>
                  )}
                </div>
              </li>
            );
          })}
          <li className="pt-2">
            <b>현장 대기</b>
            <div className="mt-1 flex flex-wrap gap-1">
              {q.entries
                .filter((e) => ['waiting', 'called', 'in_service', 'held'].includes(e.status))
                .map((e) => (
                  <span key={e.number} className={`rounded-lg px-2 py-0.5 text-xs font-bold ${e.isMine ? 'bg-coral text-white' : 'bg-cream'}`}>
                    <span className="mr-1 rounded bg-white/60 px-1 text-[10px]">현장</span>
                    {pad3(e.number)} {e.status === 'called' ? '호출' : e.status === 'in_service' ? '진행' : e.status === 'held' ? '보류' : ''}
                  </span>
                ))}
            </div>
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function RoomsTab({ bath }: { bath: Bathhouse }) {
  const { state, actions } = useStore();
  const rooms = state.rooms.filter((r) => r.bathhouseId === bath.id);
  if (!rooms.length) return <Panel title="찜질방 인원 관리">이 시설에는 등록된 찜질방이 없어요.</Panel>;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-brown-soft">입장·퇴장 버튼을 누르면 이용자 화면과 입구 디스플레이에 즉시 반영됩니다. 인원은 0명 미만이 될 수 없어요.</p>
        <DisplayLink to={`/display/rooms/${bath.id}`} className="flex items-center gap-1 rounded-xl bg-brown px-3 py-2 text-sm font-bold text-white">
          <Monitor className="h-4 w-4" /> 전체 입구 디스플레이
        </DisplayLink>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rooms.map((r) => {
          const c = crowd(r.currentOccupancy, r.recommendedOccupancy);
          return (
            <Panel
              key={r.roomId}
              title={
                <span>
                  {r.emoji} {r.name} <span className="text-sm font-normal text-brown-soft">{r.temp}</span>
                </span>
              }
              right={<CrowdBadge current={r.currentOccupancy} recommended={r.recommendedOccupancy} showPct size="md" />}
            >
              <div data-admin-room={r.name}>
                <div className="flex items-center justify-between gap-3">
                  <button className="h-14 flex-1 rounded-2xl bg-white text-lg font-black text-brown ring-2 ring-[#EADCCD] active:scale-95 disabled:opacity-40" disabled={r.currentOccupancy <= 0} onClick={() => actions.adjustRoom(r.roomId, -1)} data-testid="exit">
                    퇴장 -1
                  </button>
                  <div className="w-24 text-center">
                    <div className="text-4xl font-black">{r.currentOccupancy}</div>
                    <div className="text-xs text-brown-soft">/ 권장 {r.recommendedOccupancy}명</div>
                  </div>
                  <button className="h-14 flex-1 rounded-2xl bg-coral text-lg font-black text-white active:scale-95" onClick={() => actions.adjustRoom(r.roomId, 1)} data-testid="enter">
                    입장 +1
                  </button>
                </div>
                <div className="mt-3">
                  <CrowdBar current={r.currentOccupancy} recommended={r.recommendedOccupancy} />
                  <div className={`mt-1 text-right text-xs font-bold ${c.text}`}>
                    혼잡도 {c.pct}% · {c.label}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <label>
                    <span className="text-xs text-brown-soft">현재 인원 직접 설정</span>
                    <input type="number" min={0} value={r.currentOccupancy} onChange={(e) => actions.setRoom(r.roomId, { currentOccupancy: Number(e.target.value) })} className={input} data-testid="set-current" />
                  </label>
                  <label>
                    <span className="text-xs text-brown-soft">권장 인원 (설정값)</span>
                    <input type="number" min={1} value={r.recommendedOccupancy} onChange={(e) => actions.setRoom(r.roomId, { recommendedOccupancy: Number(e.target.value) })} className={input} />
                  </label>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-brown-soft">
                  <span>업데이트 {formatClock(r.updatedAt)}</span>
                  <DisplayLink to={`/display/room/${r.roomId}`} className="underline">
                    이 방 입구 디스플레이
                  </DisplayLink>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function HygieneTab({ bath }: { bath: Bathhouse }) {
  const { actions } = useStore();
  const toast = useToast();
  const [f, setF] = useState<Hygiene>(bath.hygiene);
  useEffect(() => {
    setF(bath.hygiene);
  }, [bath.hygiene]);
  const set = <K extends keyof Hygiene>(k: K, v: Hygiene[K]) => setF((x) => ({ ...x, [k]: v }));
  const now = new Date();
  const stamp = `오늘 ${now.getHours() < 12 ? '오전' : '오후'} ${now.getHours() % 12 || 12}시 ${now.getMinutes()}분`;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="수질검사 정보 등록">
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="text-xs text-brown-soft">검사 결과</span>
            <select value={f.waterTestResult} onChange={(e) => set('waterTestResult', e.target.value as WaterTestResult)} className={input}>
              {['적합', '부적합', '미확인'].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-brown-soft">검사일</span>
            <input type="date" value={f.waterTestDate} onChange={(e) => set('waterTestDate', e.target.value)} className={input} />
          </label>
          <label className="block">
            <span className="text-xs text-brown-soft">검사 주체</span>
            <select value={f.waterTestAgency} onChange={(e) => set('waterTestAgency', e.target.value)} className={input}>
              <option value="">미확인</option>
              <option>지자체</option>
              <option>공인 검사기관</option>
              <option>사업장 자체</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5">
            <input type="checkbox" checked={f.waterTestEvidence} onChange={(e) => set('waterTestEvidence', e.target.checked)} className="h-5 w-5 accent-coral" />
            증빙 서류 제출됨
          </label>
          <p className="text-xs text-brown-soft">증빙이 없거나 사업장 자체 검사인 경우 이용자 화면에 ‘사업장 제공 정보’로 표시되며, 공식 인증처럼 표현되지 않습니다.</p>
        </div>
      </Panel>
      <Panel title="물 교체 · 청소 기록" right={<span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-brown-soft">사업장 제공 정보</span>}>
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="text-xs text-brown-soft">최근 물 교체 (비우면 ‘정보 없음’)</span>
            <div className="flex gap-2">
              <input value={f.lastWaterChange} onChange={(e) => set('lastWaterChange', e.target.value)} placeholder="예: 오늘 오전 5시" className={input} />
              <button className="shrink-0 rounded-xl bg-butter px-3 font-bold" onClick={() => set('lastWaterChange', stamp)}>
                지금 교체
              </button>
            </div>
          </label>
          <label className="block">
            <span className="text-xs text-brown-soft">다음 청소 예정</span>
            <input value={f.nextCleaning} onChange={(e) => set('nextCleaning', e.target.value)} placeholder="예: 오후 11시" className={input} />
          </label>
          <div className="text-xs text-brown-soft">마지막 업데이트: {formatUpdated(bath.hygiene.updatedAt)}</div>
          <button
            className="h-12 w-full rounded-2xl bg-coral font-bold text-white"
            onClick={() => {
              actions.updateHygiene(bath.id, f);
              toast('위생·수질 정보를 저장했어요', '이용자 상세 화면에 바로 반영돼요.');
            }}
          >
            저장하기
          </button>
          <p className="text-xs text-brown-soft">물 교체 시간만으로 수질의 안전성을 보증하지 않는다는 안내가 이용자 화면에 함께 표시됩니다.</p>
        </div>
      </Panel>
    </div>
  );
}

function InfoTab({ bath }: { bath: Bathhouse }) {
  const { actions } = useStore();
  const toast = useToast();
  const [f, setF] = useState({ name: bath.name, price: bath.price, openingHours: bath.openingHours, address: bath.address, description: bath.description });
  return (
    <Panel title="시설 기본 정보">
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <label>
          <span className="text-xs text-brown-soft">시설명</span>
          <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} />
        </label>
        <label>
          <span className="text-xs text-brown-soft">입장료 (원)</span>
          <input type="number" min={0} step={500} value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} className={input} />
        </label>
        <label>
          <span className="text-xs text-brown-soft">영업시간</span>
          <input value={f.openingHours} onChange={(e) => setF({ ...f, openingHours: e.target.value })} placeholder="06:00-23:00" className={input} />
        </label>
        <label>
          <span className="text-xs text-brown-soft">주소 (시연용)</span>
          <input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className={input} />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-brown-soft">소개</span>
          <textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={input} />
        </label>
      </div>
      <button
        className="mt-3 h-12 w-full rounded-2xl bg-coral font-bold text-white disabled:opacity-40"
        disabled={!f.name.trim() || f.price < 0}
        onClick={() => {
          actions.updateBath(bath.id, { ...f, name: f.name.trim() });
          toast('시설 정보를 저장했어요');
        }}
      >
        저장하기
      </button>
    </Panel>
  );
}

function StaffTab({ bath }: { bath: Bathhouse }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const [name, setName] = useState('');
  const [career, setCareer] = useState(3);
  const [section, setSection] = useState<'남탕' | '여탕'>('여탕');
  const [svc, setSvc] = useState<ServiceId[]>(['basic']);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Panel title="세신사 근무 관리" right={<Link to="/staff" className="text-sm font-bold text-coral">세신사 화면 →</Link>}>
        <ul className="space-y-2">
          {state.scrubbers.map((s) => {
            const here = s.bathhouseIds.includes(bath.id);
            return (
              <li key={s.id} className={`rounded-2xl p-3 ${here ? 'bg-cream' : 'bg-cream/40'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <b>{s.name}</b> <span className="text-xs text-brown-soft">{s.section} · 경력 {s.career}년</span>
                    <div className="truncate text-xs text-brown-soft">{s.specialties.join(', ')}</div>
                  </div>
                  <button
                    onClick={() => actions.toggleAssignment(s.id, bath.id)}
                    aria-pressed={here}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold ${here ? 'bg-coral text-white' : 'bg-white text-brown ring-1 ring-[#EADCCD]'}`}
                  >
                    {here ? '근무 중' : '근무 배정'}
                  </button>
                </div>
                {here && (
                  <div className="mt-2 flex gap-1">
                    {DOW_LABELS.map((d, i) => (
                      <button key={d} onClick={() => actions.toggleWorkDay(s.id, i)} className={`h-8 flex-1 rounded-lg text-xs font-bold ${s.workDays.includes(i) ? 'bg-brown text-white' : 'bg-white text-brown-faint'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {!bath.scrubReservation && <p className="mt-2 text-xs text-brown-soft">이 시설은 온라인 세신 예약이 비활성화되어 있어 이용자 화면에는 노출되지 않아요.</p>}
      </Panel>
      <Panel title="세신사 등록">
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="text-xs text-brown-soft">표시 이름 또는 별칭</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 최 세신사" className={input} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="text-xs text-brown-soft">경력 (년)</span>
              <input type="number" min={0} value={career} onChange={(e) => setCareer(Number(e.target.value))} className={input} />
            </label>
            <label>
              <span className="text-xs text-brown-soft">근무 구역</span>
              <select value={section} onChange={(e) => setSection(e.target.value as '남탕' | '여탕')} className={input}>
                <option>여탕</option>
                <option>남탕</option>
              </select>
            </label>
          </div>
          <div>
            <span className="text-xs text-brown-soft">제공 서비스</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {SERVICES.map((x) => (
                <button key={x.id} onClick={() => setSvc((v) => (v.includes(x.id) ? v.filter((y) => y !== x.id) : [...v, x.id]))} aria-pressed={svc.includes(x.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${svc.includes(x.id) ? 'bg-coral text-white' : 'bg-cream'}`}>
                  {x.name}
                </button>
              ))}
            </div>
          </div>
          <button
            className="h-12 w-full rounded-2xl bg-coral font-bold text-white disabled:opacity-40"
            disabled={!name.trim() || !svc.length}
            onClick={() => {
              actions.addScrubber({ name: name.trim(), career, section, services: svc, bathId: bath.id });
              toast(`${name.trim()}을(를) 등록했어요`, `${bath.name} 근무로 배정되었습니다.`);
              setName('');
            }}
          >
            등록하기
          </button>
          <p className="text-xs text-brown-soft">등록된 세신사는 시연용 가상 데이터로 표시됩니다.</p>
        </div>
      </Panel>
    </div>
  );
}
