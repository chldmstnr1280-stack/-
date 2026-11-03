import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, FACILITY_OPTIONS, REGIONS, SERVICE_OPTIONS } from '../data/seed';
import { crowd } from '../lib/logic';
import { useStore } from '../store';
import { BathCard, Button, Chip, EmptyState, FACILITY_EMOJI, PageHeader } from '../components/ui';

const SORTS = [
  { v: 'recommend', label: '추천순' },
  { v: 'price', label: '가격 낮은순' },
  { v: 'rating', label: '이용자 평점순' },
  { v: 'crowd', label: '현재 혼잡도 낮은순' },
];

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

export default function SearchPage() {
  const { state } = useStore();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);

  const q = params.get('q') ?? '';
  const region = params.get('region') ?? '';
  const cat = params.get('cat') ?? '';
  const fac = list(params.get('fac'));
  const svc = list(params.get('svc'));
  const sort = params.get('sort') ?? 'recommend';
  const scrub = params.get('scrub') === '1';
  const water = params.get('water') === '1';

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const toggleIn = (key: string, arr: string[], v: string) => set(key, (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]).join(','));
  const reset = () => setParams(new URLSearchParams(), { replace: true });

  const results = useMemo(() => {
    const term = q.trim();
    const r = state.bathhouses.filter(
      (b) =>
        (!term || [b.name, b.region, b.address, b.type, ...b.facilities, ...b.services].some((t) => t.includes(term))) &&
        (!region || b.region === region) &&
        (!cat || b.tags.includes(cat as never)) &&
        fac.every((f) => b.facilities.includes(f)) &&
        svc.every((s) => b.services.includes(s)) &&
        (!scrub || b.scrubReservation) &&
        (!water || (b.hygiene.waterTestResult !== '미확인' && !!b.hygiene.waterTestDate)),
    );
    const c = (b: (typeof r)[number]) => crowd(b.currentVisitors, b.comfortCapacity).pct;
    if (sort === 'price') r.sort((a, b) => a.price - b.price);
    if (sort === 'rating') r.sort((a, b) => b.rating - a.rating);
    if (sort === 'crowd') r.sort((a, b) => c(a) - c(b));
    return r;
  }, [state.bathhouses, q, region, cat, fac, svc, sort, scrub, water]);

  const activeCount = (region ? 1 : 0) + (cat ? 1 : 0) + fac.length + svc.length + (scrub ? 1 : 0) + (water ? 1 : 0) + (q ? 1 : 0);
  const catLabel = CATEGORIES.find((c) => c.tag === cat);

  return (
    <div>
      <PageHeader title="목욕탕 찾기" back={false} />
      <div className="flex items-center gap-2 rounded-2xl border-2 border-coral-light bg-white px-4 py-2.5 focus-within:border-coral">
        <Search className="h-5 w-5 text-coral" />
        <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="시설명, 지역, 시설 종류 검색" className="w-full bg-transparent focus:outline-none" aria-label="검색어" />
        {q && (
          <button onClick={() => set('q', null)} aria-label="검색어 지우기">
            <X className="h-4 w-4 text-brown-soft" />
          </button>
        )}
      </div>

      <div className="mt-3">
        <div className="mb-1.5 text-xs font-bold text-brown-soft">지역</div>
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
          <Chip active={!region} onClick={() => set('region', null)}>
            전체
          </Chip>
          {REGIONS.map((r) => (
            <Chip key={r} active={region === r} onClick={() => set('region', region === r ? null : r)}>
              {r}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => set('scrub', scrub ? null : '1')}
          aria-pressed={scrub}
          className={`rounded-full px-3.5 py-2 text-sm font-bold ${scrub ? 'bg-coral text-white' : 'bg-coral-light/50 text-coral-dark'}`}
        >
          🧽 세신 예약 가능
        </button>
        <button
          onClick={() => set('water', water ? null : '1')}
          aria-pressed={water}
          className={`rounded-full px-3.5 py-2 text-sm font-bold ${water ? 'bg-ok-dark text-white' : 'bg-ok-light text-ok-dark'}`}
        >
          💧 수질검사 정보 확인 가능
        </button>
        {catLabel && (
          <button onClick={() => set('cat', null)} className="flex items-center gap-1 rounded-full bg-butter px-3 py-2 text-sm font-bold">
            {catLabel.emoji} {catLabel.label} <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <button onClick={() => setShowFilters((v) => !v)} className="mt-3 flex items-center gap-1.5 text-sm font-bold text-brown-soft" aria-expanded={showFilters}>
        <SlidersHorizontal className="h-4 w-4" /> 상세 필터 {fac.length + svc.length > 0 && <span className="rounded-full bg-coral px-1.5 text-xs text-white">{fac.length + svc.length}</span>} {showFilters ? '접기' : '펼치기'}
      </button>
      {showFilters && (
        <div className="mt-2 space-y-3 rounded-3xl bg-white p-4 shadow-soft">
          <div>
            <div className="mb-1.5 text-xs font-bold text-brown-soft">시설 (모두 포함)</div>
            <div className="flex flex-wrap gap-1.5">
              {FACILITY_OPTIONS.map((f) => (
                <Chip key={f} active={fac.includes(f)} onClick={() => toggleIn('fac', fac, f)}>
                  {FACILITY_EMOJI[f]} {f}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-xs font-bold text-brown-soft">서비스</div>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_OPTIONS.map((s) => (
                <Chip key={s} active={svc.includes(s)} onClick={() => toggleIn('svc', svc, s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-xs font-bold text-brown-soft">추천 카테고리</div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <Chip key={c.tag} active={cat === c.tag} onClick={() => set('cat', cat === c.tag ? null : c.tag)}>
                  {c.emoji} {c.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          검색 결과 <b className="text-coral">{results.length}</b>곳
          {activeCount > 0 && (
            <button onClick={reset} className="ml-2 text-xs font-semibold text-brown-soft underline">
              조건 초기화
            </button>
          )}
        </div>
        <select value={sort} onChange={(e) => set('sort', e.target.value === 'recommend' ? null : e.target.value)} className="rounded-xl bg-cream px-2 py-1.5 text-sm font-semibold focus:outline-none" aria-label="정렬">
          {SORTS.map((s) => (
            <option key={s.v} value={s.v}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 space-y-3">
        {results.length ? (
          results.map((b) => <BathCard key={b.id} bath={b} onOpen={() => nav(`/bath/${b.id}`)} />)
        ) : (
          <EmptyState
            title="조건에 맞는 목욕탕이 없어요"
            body="필터를 줄이거나 다른 지역을 선택해 보세요."
            action={
              <Button onClick={reset} variant="outline">
                조건 초기화
              </Button>
            }
          />
        )}
      </div>
      {sort === 'rating' && <p className="mt-3 text-center text-xs text-brown-faint">평점은 시연용 가상 데이터입니다.</p>}
    </div>
  );
}
