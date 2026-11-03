import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatClock } from '../lib/logic';
import { useStore } from '../store';
import { EmptyState, PageHeader } from '../components/ui';

export default function NotificationsPage() {
  const { state, actions } = useStore();
  const nav = useNavigate();
  const unread = state.notifications.filter((n) => !n.read).length;
  useEffect(() => {
    if (unread) {
      const t = setTimeout(() => actions.markAllRead(), 1500);
      return () => clearTimeout(t);
    }
  }, [unread, actions]);
  return (
    <div>
      <PageHeader
        title="알림"
        right={
          state.notifications.length > 0 && (
            <button onClick={actions.clearNotifications} className="text-sm font-semibold text-brown-soft">
              모두 지우기
            </button>
          )
        }
      />
      <p className="mb-3 text-xs text-brown-soft">프로토타입에서는 실제 푸시 대신 웹앱 내부 알림으로 안내해요.</p>
      {state.notifications.length ? (
        <ul className="space-y-2">
          {state.notifications.map((n) => (
            <li key={n.id}>
              <button onClick={() => n.link && nav(n.link)} className={`w-full rounded-2xl p-4 text-left shadow-soft ${n.read ? 'bg-white' : 'bg-coral-light/40'}`}>
                <div className="flex items-center justify-between gap-2">
                  <b className="text-sm">{n.title}</b>
                  <span className="text-xs text-brown-faint">{formatClock(n.at)}</span>
                </div>
                <div className="mt-0.5 text-xs text-brown-soft">{n.body}</div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="새 알림이 없어요" body="예약·대기 상태가 바뀌면 여기에 알려드릴게요." />
      )}
    </div>
  );
}
