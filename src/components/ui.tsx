import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CalendarCheck, ChevronLeft, Flame, Heart, Home, Search, User, X } from 'lucide-react';
import { crowd, won } from '../lib/logic';
import { useStore } from '../store';
import type { Bathhouse } from '../types';

/* ---------------- 햄스터 마스코트 ---------------- */

export function Hamster({ size = 40, mood = 'happy', className = '' }: { size?: number; mood?: 'happy' | 'sleepy' | 'wow'; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="17" cy="22" r="7" fill="#E9A88E" />
      <circle cx="47" cy="22" r="7" fill="#E9A88E" />
      <circle cx="17" cy="22" r="3.6" fill="#F7CFC2" />
      <circle cx="47" cy="22" r="3.6" fill="#F7CFC2" />
      <ellipse cx="32" cy="39" rx="23" ry="20" fill="#F6C9A8" />
      <ellipse cx="32" cy="45" rx="15" ry="12" fill="#FFF5E9" />
      {/* 양머리 수건 */}
      <ellipse cx="32" cy="18" rx="13" ry="6.5" fill="#FFFFFF" stroke="#F0E2D3" strokeWidth="1.2" />
      <circle cx="20.5" cy="18" r="5.2" fill="#FFFFFF" stroke="#F0E2D3" strokeWidth="1.2" />
      <circle cx="43.5" cy="18" r="5.2" fill="#FFFFFF" stroke="#F0E2D3" strokeWidth="1.2" />
      <circle cx="20.5" cy="18" r="2" fill="none" stroke="#F0E2D3" strokeWidth="1" />
      <circle cx="43.5" cy="18" r="2" fill="none" stroke="#F0E2D3" strokeWidth="1" />
      {mood === 'sleepy' ? (
        <>
          <path d="M22 35 q3 2.2 6 0" stroke="#45372F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M36 35 q3 2.2 6 0" stroke="#45372F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="25" cy="35" r={mood === 'wow' ? 3 : 2.6} fill="#45372F" />
          <circle cx="39" cy="35" r={mood === 'wow' ? 3 : 2.6} fill="#45372F" />
          <circle cx="25.9" cy="34.1" r="0.9" fill="#fff" />
          <circle cx="39.9" cy="34.1" r="0.9" fill="#fff" />
        </>
      )}
      <ellipse cx="19" cy="42" rx="4.2" ry="2.6" fill="#F28C78" opacity="0.55" />
      <ellipse cx="45" cy="42" rx="4.2" ry="2.6" fill="#F28C78" opacity="0.55" />
      <ellipse cx="32" cy="40" rx="1.7" ry="1.2" fill="#45372F" />
      {mood === 'wow' ? (
        <ellipse cx="32" cy="45" rx="2" ry="2.4" fill="#45372F" />
      ) : (
        <path d="M29 43 q1.5 1.6 3 0 q1.5 1.6 3 0" stroke="#45372F" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <Hamster size={small ? 28 : 34} />
      <div className="leading-none">
        <div className={`font-extrabold tracking-tight text-brown ${small ? 'text-base' : 'text-lg'}`}>
          MELTING <span className="text-coral">HAM</span>
        </div>
        {!small && <div className="text-[10px] font-medium text-brown-soft mt-0.5">웰니스를 즐겁게</div>}
      </div>
    </div>
  );
}

/* ---------------- 일러스트 (실제 사진 대신 사용) ---------------- */

export function BathArt({ bath, className = '' }: { bath: Pick<Bathhouse, 'id' | 'palette' | 'name'>; className?: string }) {
  const [a, b] = bath.palette;
  const gid = `g-${bath.id}`;
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={`${bath.name} 일러스트 (실제 사진 아님)`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${gid})`} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={i * 36} y="0" width="34" height="88" fill="#fff" opacity={i % 2 ? 0.08 : 0.14} />
      ))}
      <rect x="0" y="96" width="320" height="64" fill="#fff" opacity="0.25" />
      <path d="M30 118 q130 -26 260 0 v30 h-260z" fill="#9ED6E6" opacity="0.85" />
      <path d="M30 118 q130 -26 260 0" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
      {[90, 160, 230].map((x, i) => (
        <path key={x} d={`M${x} 92 q-10 -14 0 -28 q10 -14 0 -28`} stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity={0.55 - i * 0.1} />
      ))}
      <g transform="translate(250 62) scale(0.9)">
        <ellipse cx="32" cy="58" rx="26" ry="6" fill="#000" opacity="0.08" />
      </g>
    </svg>
  );
}

export const FACILITY_EMOJI: Record<string, string> = {
  온탕: '♨️',
  냉탕: '❄️',
  '건식 사우나': '🔥',
  '습식 사우나': '💨',
  황토방: '🟤',
  소금방: '🧂',
  편백방: '🌲',
  얼음방: '🧊',
  수면실: '😴',
  식당: '🍜',
  휴게실: '🛋️',
};

/* ---------------- 기본 요소 ---------------- */

export function DemoBadge({ label = '데모 데이터', className = '' }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-dashed border-brown-faint bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-brown-soft ${className}`}>
      DEMO · {label}
    </span>
  );
}

export function CrowdBadge({ current, recommended, showPct = false, size = 'sm' }: { current: number; recommended: number; showPct?: boolean; size?: 'sm' | 'md' }) {
  const c = crowd(current, recommended);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${c.bg} ${c.text} ${size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`}>
      <span className={`h-2 w-2 rounded-full ${c.dot}`} />
      {c.label}
      {showPct && <span className="font-medium opacity-80">{c.pct}%</span>}
    </span>
  );
}

export function CrowdBar({ current, recommended }: { current: number; recommended: number }) {
  const c = crowd(current, recommended);
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuenow={c.pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-all duration-300 ${c.bar}`} style={{ width: `${Math.min(100, c.pct)}%` }} />
    </div>
  );
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-coral text-white hover:bg-coral-dark shadow-soft',
  secondary: 'bg-butter text-brown hover:brightness-95',
  ghost: 'bg-cream text-brown hover:bg-butter-light',
  outline: 'border-2 border-coral text-coral-dark bg-white hover:bg-coral-light/40',
  danger: 'bg-white border-2 border-danger text-danger-dark hover:bg-danger-light',
};

export function Button({ variant = 'primary', block = false, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; block?: boolean }) {
  return (
    <button
      {...rest}
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl px-4 text-[15px] font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${BTN[variant]} ${block ? 'w-full' : ''} ${className}`}
    />
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-4 shadow-soft ${className}`}>{children}</div>;
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2.5 mt-6 flex items-end justify-between">
      <h2 className="text-[17px] font-extrabold text-brown">{children}</h2>
      {right}
    </div>
  );
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
        active ? 'border-coral bg-coral text-white' : 'border-[#EFE3D6] bg-white text-brown hover:border-coral-light'
      }`}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, back = true, right }: { title: ReactNode; back?: boolean; right?: ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-2 flex h-14 items-center gap-2 bg-warm/95 px-4 backdrop-blur">
      {back && (
        <button onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-cream" aria-label="뒤로">
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      <h1 className="flex-1 truncate text-lg font-extrabold">{title}</h1>
      {right}
    </header>
  );
}

export function FavButton({ id, className = '' }: { id: string; className?: string }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const on = state.favorites.includes(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        actions.toggleFavorite(id);
        toast(on ? '즐겨찾기에서 삭제했어요' : '즐겨찾기에 저장했어요 💛');
      }}
      aria-pressed={on}
      aria-label={on ? '즐겨찾기 해제' : '즐겨찾기'}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-soft transition active:scale-90 ${className}`}
    >
      <Heart className={`h-5 w-5 ${on ? 'fill-coral text-coral' : 'text-brown-soft'}`} />
    </button>
  );
}

export function BellButton() {
  const { state } = useStore();
  const unread = state.notifications.filter((n) => !n.read).length;
  return (
    <NavLink to="/notifications" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-cream" aria-label={`알림 ${unread}건`}>
      <Bell className="h-6 w-6" />
      {unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">{unread}</span>}
    </NavLink>
  );
}

/* ---------------- 목욕탕 카드 ---------------- */

export function BathCard({ bath, onOpen, compact = false }: { bath: Bathhouse; onOpen: () => void; compact?: boolean }) {
  const { state } = useStore();
  const q = state.queues[bath.id];
  const waiting = q ? q.entries.filter((e) => e.status === 'waiting').length : 0;
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="cursor-pointer overflow-hidden rounded-3xl bg-white shadow-soft transition hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <div className="relative">
        <BathArt bath={bath} className={`w-full ${compact ? 'h-28' : 'h-36'}`} />
        <FavButton id={bath.id} className="absolute right-3 top-3" />
        <DemoBadge className="absolute left-3 top-3" label="가상 시설" />
        <div className="absolute bottom-2 left-3">
          <CrowdBadge current={bath.currentVisitors} recommended={bath.comfortCapacity} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-extrabold">{bath.name}</h3>
            <p className="text-sm text-brown-soft">
              {bath.region} · {bath.type} · ★ {bath.rating.toFixed(1)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[17px] font-extrabold">{won(bath.price)}</div>
            <div className="text-[11px] text-brown-soft">입장료</div>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {bath.facilities.slice(0, compact ? 4 : 6).map((f) => (
            <span key={f} className="rounded-lg bg-cream px-2 py-0.5 text-xs">
              {FACILITY_EMOJI[f]} {f}
            </span>
          ))}
          {bath.facilities.length > (compact ? 4 : 6) && <span className="px-1 text-xs text-brown-soft">+{bath.facilities.length - (compact ? 4 : 6)}</span>}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
          {bath.scrubReservation ? (
            <span className="rounded-full bg-coral-light/60 px-2.5 py-1 text-coral-dark">🧽 세신 예약 가능</span>
          ) : bath.services.includes('세신') ? (
            <span className="rounded-full bg-cream px-2.5 py-1 text-brown-soft">세신 현장 접수만</span>
          ) : (
            <span className="rounded-full bg-cream px-2.5 py-1 text-brown-soft">세신 없음</span>
          )}
          {bath.scrubReservation && <span className="text-brown-soft">현장 대기 {waiting}명</span>}
          <span className="ml-auto text-brown-soft">{bath.openingHours}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 하단 내비게이션 ---------------- */

const NAV = [
  { to: '/', label: '홈', icon: Home, end: true },
  { to: '/search', label: '목욕탕 찾기', icon: Search },
  { to: '/reserve', label: '세신 예약', icon: CalendarCheck },
  { to: '/crowd', label: '찜질방 현황', icon: Flame },
  { to: '/my', label: '마이', icon: User },
];

export function BottomNav() {
  return (
    <nav className="pb-safe sticky bottom-0 z-30 -mx-4 mt-8 border-t border-[#F1E6DA] bg-white/95 backdrop-blur" aria-label="주요 메뉴">
      <ul className="grid grid-cols-5">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => `flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${isActive ? 'text-coral' : 'text-brown-faint hover:text-brown-soft'}`}
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.6 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------------- 토스트 / 웹앱 내부 알림 ---------------- */

type ToastItem = { id: number; title: string; body?: string; link?: string };
const ToastCtx = createContext<(title: string, body?: string, link?: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nav = useNavigate();
  const counter = useRef(0);
  const push = useCallback((title: string, body?: string, link?: string) => {
    const id = ++counter.current;
    setItems((x) => [...x.slice(-2), { id, title, body, link }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3800);
  }, []);

  // 새 알림(다른 탭에서 발생한 것 포함)을 토스트로 표시
  const { state } = useStore();
  const { pathname } = useLocation();
  const consumerView = !/^\/(admin|staff|display)/.test(pathname);
  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!seen.current) {
      seen.current = new Set(state.notifications.map((n) => n.id));
      return;
    }
    for (const n of [...state.notifications].reverse()) {
      if (!seen.current.has(n.id)) {
        seen.current.add(n.id);
        if (!n.read && consumerView) push(n.title, n.body, n.link);
      }
    }
  }, [state.notifications, push, consumerView]);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 mx-auto flex w-full max-w-[460px] flex-col gap-2 px-3" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            onClick={() => t.link && nav(t.link)}
            className={`toast-in pointer-events-auto flex items-start gap-2 rounded-2xl bg-brown px-4 py-3 text-white shadow-lift ${t.link ? 'cursor-pointer' : ''}`}
          >
            <Hamster size={28} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{t.title}</div>
              {t.body && <div className="text-xs text-white/80">{t.body}</div>}
            </div>
            <button onClick={(e) => (e.stopPropagation(), setItems((x) => x.filter((y) => y.id !== t.id)))} aria-label="닫기" className="text-white/70">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------------- 확인 다이얼로그 ---------------- */

export function ConfirmSheet({ open, title, body, confirmLabel = '확인', danger, onConfirm, onClose }: { open: boolean; title: string; body?: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-brown/40 sm:items-center" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-[480px] rounded-t-3xl bg-white p-5 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-extrabold">{title}</h3>
        {body && <div className="mt-2 whitespace-pre-line text-sm text-brown-soft">{body}</div>}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={() => (onConfirm(), onClose())}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-10 text-center shadow-soft">
      <Hamster size={64} mood="sleepy" />
      <p className="mt-3 font-bold">{title}</p>
      {body && <p className="mt-1 text-sm text-brown-soft">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------------- 디스플레이 링크 ---------------- */
// 일반 웹앱에서는 새 탭(같은 브라우저 탭 간 실시간 연동), 아티팩트 뷰어에서는 같은 화면 안에서 이동
export const IS_ARTIFACT = import.meta.env.VITE_ARTIFACT === '1';

export function DisplayLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  if (IS_ARTIFACT)
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  return (
    <a href={`#${to}`} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}
