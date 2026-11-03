import { useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { currentNumber, pad3, scrubbersAt, waitingList } from '../lib/logic';
import { useStore } from '../store';
import { BathArt, Button, DemoBadge, PageHeader, SectionTitle } from '../components/ui';
import { MyStatusCards } from './Home';

export default function ReserveHub() {
  const { state } = useStore();
  const nav = useNavigate();
  const baths = state.bathhouses.filter((b) => b.scrubReservation);
  return (
    <div>
      <PageHeader title="세신 예약" back={false} />
      <p className="text-sm text-brown-soft">원하는 시간에 미리 예약하거나, 현장에서 대기번호를 받아 자유롭게 쉬다가 차례에 맞춰 이동하세요.</p>
      <MyStatusCards />
      <SectionTitle right={<DemoBadge />}>세신 예약 가능한 목욕탕</SectionTitle>
      <div className="space-y-3">
        {baths.map((b) => {
          const q = state.queues[b.id];
          const staff = scrubbersAt(state, b.id);
          return (
            <div key={b.id} className="overflow-hidden rounded-3xl bg-white shadow-soft">
              <button onClick={() => nav(`/bath/${b.id}`)} className="flex w-full items-center gap-3 p-3 text-left">
                <BathArt bath={b} className="h-16 w-20 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <b className="block truncate">{b.name}</b>
                  <div className="text-xs text-brown-soft">
                    {b.region} · 세신사 {staff.length}명 · {staff.map((s) => s.name.replace(' 세신사', '')).join('/')}
                  </div>
                  <div className="mt-1 text-xs">
                    현재 진행 <b>{q ? pad3(currentNumber(q)) : '-'}</b> · 현장 대기 <b className="text-coral">{q ? waitingList(q).length : 0}명</b>
                  </div>
                </div>
              </button>
              <div className="grid grid-cols-2 gap-2 border-t border-cream p-3">
                <Button onClick={() => nav(`/book/${b.id}`)}>세신 예약하기</Button>
                <Button variant="outline" onClick={() => nav(`/queue/${b.id}`)}>
                  <Ticket className="h-4 w-4" /> 현장 대기
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
