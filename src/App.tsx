import { useEffect } from 'react';
import { HashRouter, MemoryRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider } from './store';
import { BottomNav, IS_ARTIFACT, ToastProvider } from './components/ui';

// 아티팩트 뷰어는 #/경로 해시를 지원하지 않으므로 메모리 라우터 사용
const Router = IS_ARTIFACT ? MemoryRouter : HashRouter;
import { DemoGuide } from './components/DemoGuide';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import BathDetail from './pages/BathDetail';
import Booking, { BookingDone } from './pages/Booking';
import ReserveHub from './pages/ReserveHub';
import QueuePage from './pages/Queue';
import CrowdPage from './pages/Crowd';
import MyPage from './pages/My';
import NotificationsPage from './pages/Notifications';
import StaffPage from './pages/Staff';
import AdminPage from './pages/Admin';
import { QueueDisplay, RoomDisplay, RoomsDisplay } from './pages/Displays';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ConsumerLayout() {
  return (
    <div className="min-h-screen bg-[#F6EDE3] lg:flex lg:justify-center lg:gap-8 lg:py-0">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] flex flex-col bg-warm px-4 lg:mx-0 lg:shadow-lift">
        <div className="flex-1">
          <Outlet />
        </div>
        <BottomNav />
      </div>
      <DemoGuide />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <StoreProvider>
        <ToastProvider>
          <ScrollTop />
          <Routes>
            <Route element={<ConsumerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bath/:id" element={<BathDetail />} />
              <Route path="/book/:bathId" element={<Booking />} />
              <Route path="/book/done/:resId" element={<BookingDone />} />
              <Route path="/reserve" element={<ReserveHub />} />
              <Route path="/queue/:bathId" element={<QueuePage />} />
              <Route path="/crowd" element={<CrowdPage />} />
              <Route path="/crowd/:bathId" element={<CrowdPage />} />
              <Route path="/my" element={<MyPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/display/room/:roomId" element={<RoomDisplay />} />
            <Route path="/display/rooms/:bathId" element={<RoomsDisplay />} />
            <Route path="/display/queue/:bathId" element={<QueueDisplay />} />
            <Route path="*" element={<ConsumerLayout />}>
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </ToastProvider>
      </StoreProvider>
    </Router>
  );
}
