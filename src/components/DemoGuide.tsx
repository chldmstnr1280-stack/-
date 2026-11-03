import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Monitor, RotateCcw, Scissors, Settings } from 'lucide-react';
import { useStore } from '../store';
import { ConfirmSheet, Hamster, useToast } from './ui';

export const SCENARIOS = [
  { id: 'A', title: '목욕탕 찾기', steps: ['찾기 탭 → 지역 ‘경기’ 선택', '‘세신 예약 가능’ 필터 적용', '조건에 맞는 목욕탕만 표시 → 선택'] },
  { id: 'B', title: '세신 예약', steps: ['멜팅 스파랜드 → 세신 예약하기', '세신사 선택 → ‘세신 + 오이팩’', '오후 2시(14:00) 선택 → 예약 확정', '같은 시간대가 ‘내 예약’으로 막힘', '마이 → 예약 취소 → 시간대 재오픈'] },
  { id: 'C', title: '현장 대기', steps: ['멜팅 스파랜드 → 현장 대기 등록', '대기번호 016번 발급', '관리자 → 대기·일정 → 서비스 완료', '진행 012 → 013, 앞 대기·예상시간 감소'] },
  { id: 'D', title: '찜질방 혼잡도', steps: ['황토방 4명 확인', '관리자 → 찜질방 → 황토방 입장 +1', '5명 / 혼잡도 42% 로 갱신', '입구 디스플레이에도 반영'] },
  { id: 'E', title: '세신사 일정', steps: ['세신사 관리 → 휴식 15:00~16:00 등록', '해당 시간 예약 불가(휴식시간)', '휴식 삭제 → 다시 예약 가능'] },
];

export function OpsLinks({ dark = false }: { dark?: boolean }) {
  const item = `flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold transition ${dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-cream hover:bg-butter-light text-brown'}`;
  return (
    <div className="grid gap-2">
      <Link to="/admin" className={item}>
        <Settings className="h-4 w-4" /> 목욕탕 관리자 화면
      </Link>
      <Link to="/staff" className={item}>
        <Scissors className="h-4 w-4" /> 세신사 관리 화면
      </Link>
      <a href="#/display/rooms/bath_001" target="_blank" rel="noreferrer" className={item}>
        <Monitor className="h-4 w-4" /> 찜질방 입구 디스플레이 <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" />
      </a>
      <a href="#/display/queue/bath_001" target="_blank" rel="noreferrer" className={item}>
        <Monitor className="h-4 w-4" /> 세신 대기 공용 디스플레이 <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" />
      </a>
    </div>
  );
}

export function ResetDemoButton({ className = '' }: { className?: string }) {
  const { actions } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={`flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-brown-faint px-3 py-2.5 text-sm font-semibold text-brown-soft hover:bg-cream ${className}`}>
        <RotateCcw className="h-4 w-4" /> 데모 데이터 초기화
      </button>
      <ConfirmSheet
        open={open}
        title="데모 데이터를 초기화할까요?"
        body="예약, 대기번호, 즐겨찾기, 찜질방 인원, 관리자 변경 사항이 모두 처음 상태로 돌아갑니다."
        confirmLabel="초기화"
        danger
        onConfirm={() => {
          actions.resetDemo();
          toast('데모 데이터를 초기화했어요');
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/** 데스크톱에서 소비자 화면 옆에 표시되는 시연 가이드 */
export function DemoGuide() {
  return (
    <aside className="hidden w-[340px] shrink-0 lg:block">
      <div className="sticky top-0 max-h-screen overflow-y-auto py-6">
        <div className="flex items-center gap-2">
          <Hamster size={40} />
          <div>
            <div className="text-lg font-extrabold">시연 가이드</div>
            <div className="text-xs text-brown-soft">왼쪽 모바일 화면에서 직접 체험해 보세요</div>
          </div>
        </div>
        <div className="mt-4">
          <OpsLinks />
        </div>
        <p className="mt-3 rounded-2xl bg-butter-light p-3 text-xs leading-relaxed text-brown-soft">
          모든 데이터는 이 브라우저의 LocalStorage에 저장되는 <b>가상 데모 데이터</b>입니다. 같은 브라우저의 다른 탭(관리자·디스플레이)과는 연동되지만, 다른 기기·브라우저 간 실시간 동기화는 지원하지 않습니다.
        </p>
        <div className="mt-4 space-y-2">
          {SCENARIOS.map((s) => (
            <details key={s.id} className="rounded-2xl bg-white p-3 shadow-soft" open={s.id === 'A'}>
              <summary className="cursor-pointer text-sm font-bold">
                <span className="mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full bg-coral text-[11px] text-white">{s.id}</span>
                {s.title}
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-brown-soft">
                {s.steps.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
        <ResetDemoButton className="mt-4 w-full" />
      </div>
    </aside>
  );
}
