import React from 'react';
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Vendor = React.lazy(() => import('./views/contents/Vendor'));
const CharingStation = React.lazy(() => import('./views/contents/ChargingStation'));
const Manager = React.lazy(() => import('./views/contents/Manager'));
const Businfo = React.lazy(() => import('./views/contents/Businfo'));
const Lineinfo = React.lazy(() => import('./views/contents/Lineinfo'));
const Chargerinfo = React.lazy(() => import('./views/contents/Chargerinfo'));
const Report = React.lazy(() => import('./views/contents/Report'));
const Price = React.lazy(() => import('./views/contents/Price'));
const Logininfo = React.lazy(() => import('./views/contents/Logininfo'));
const LogView = React.lazy(() => import('./views/contents/LogView'));
const SocketLogininfo = React.lazy(() => import('./views/contents/SocketLogininfo'));
const ReactLazy = React.lazy(() => import('./views/contents/ReactLazy'));
const Control = React.lazy(() => import('./views/contents/Chargercontrol'));
const Preferences = React.lazy(() => import('./views/contents/Preferences'));
const Manufacturer = React.lazy(() => import('./views/contents/Manufacturer'));
const ChargerModel = React.lazy(() => import('./views/contents/Chargermodel'));
const Cardinfo = React.lazy(() => import('./views/contents/Cardinfo'));
const Todoinfo = React.lazy(() => import('./views/contents/Todoinfo'));

//+++++++++++++++++++++++  Data Log View page START +++++++++++++++++++++++++++++++++++
const Authorize = React.lazy(() => import('./views/datalog/Authorize'));
const StartTransaction = React.lazy(() => import('./views/datalog/StartTransaction'));
const MeterValues = React.lazy(() => import('./views/datalog/MeterValues'));
const StopTransaction = React.lazy(() => import('./views/datalog/StopTransaction'));
const StatusNotification = React.lazy(() => import('./views/datalog/StatusNotification'));
const BootNotification = React.lazy(() => import('./views/datalog/BootNotification'));
//+++++++++++++++++++++++  Data Log View page END +++++++++++++++++++++++++++++++++++


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/logview', name: '로그뷰', component: ReactLazy },
  { path: '/log/authorize', name: '충전인증로그', component: Authorize },
  { path: '/log/starttran', name: '충전시작로그', component: StartTransaction },
  { path: '/log/metervalue', name: '충전진행로그', component: MeterValues },
  { path: '/log/stoptran', name: '충전종료로그', component: StopTransaction },
  { path: '/log/statusnoti', name: '상태정보로그', component: StatusNotification },
  { path: '/log/bootnoti', name: '부팅정보로그', component: BootNotification },
  { path: '/set/vendor', name: '운수사관리', component: Vendor },
  { path: '/set/chargingstation', name: '충전소관리', component: CharingStation },
  { path: '/set/manager', name: '사용자관리', component: Manager },
  { path: '/set/lineinfo', name: '노선관리', component: Lineinfo },
  { path: '/set/businfo', name: '버스관리', component: Businfo },
  { path: '/set/chargerinfo', name: '충전기관리', component: Chargerinfo },
  { path: '/set/report', name: '정산관리', component: Report },
  { path: '/set/price', name: '충전기 단가관리', component: Price },
  { path: '/set/control', name: '충전기 제어', component: Control },
  { path: '/set/manufacturer', name: '제조 업체 관리', component: Manufacturer },
  { path: '/set/chargermodel', name: '충전기 모델 관리', component: ChargerModel },
  { path: '/set/settings', name: 'TOC 환경 설정', component: Preferences },
  { path: '/set/cardinfo', name: '카드관리', component: Cardinfo },
  { path: '/set/todoinfo', name: 'TODO관리', component: Todoinfo },
  { path: '/get/loginhistory', name: '로그인이력', component: Logininfo },
  { path: '/get/socketlogin', name: '소켓서버로그인이력', component: SocketLogininfo },
  { path: '/get/logview', name: '소켓로그뷰', component: LogView },

]

export default routes;
