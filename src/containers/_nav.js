import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: 'CSidebarNavItem',
    name: '충전 이력',
    to: '/set/report',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },



  {
    _tag: 'CSidebarNavItem',
    name: '충전소 목록',
    to: '/set/chargingstation',
    icon: 'cil-layers'
  },


  {
    _tag: 'CSidebarNavDropdown',
    name: '충전기 관리',
    route: '',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: '충전기 목록',
        to: '/set/chargerinfo',
      }
      ,
      {
        _tag: 'CSidebarNavItem',
        name: '충전기 제어',
        to: '/set/control',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '충전기 단가관리',
        to: '/set/price'
      }
    ]
  },


  {
    _tag: 'CSidebarNavTitle',
    _children: ['System Manage']
  },

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------


  // ---------------------------------------------------------------------


  {
    _tag: 'CSidebarNavDropdown',
    name: '관리',
    route: '',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: '운수사관리',
        to: '/set/vendor',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '제조업체관리',
        to: '/set/manufacturer',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '모델관리',
        to: '/set/chargermodel',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '노선관리',
        to: '/set/lineinfo',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '버스관리',
        to: '/set/businfo',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '카드관리',
        to: '/set/cardinfo',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '사용자 관리',
        to: '/set/manager',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '환경설정',
        to: '/set/settings',
      },

    ]
  },


  {
    _tag: 'CSidebarNavDropdown',
    name: '로그분석',
    route: '',
    icon: 'cil-puzzle',
    _children: [{
      _tag: 'CSidebarNavItem',
      name: '충전인증',
      to: '/log/authorize',
      icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon" />,
    },
    {
      _tag: 'CSidebarNavItem',
      name: '충전시작',
      to: '/log/starttran',
      icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon" />,
    },
    {
      _tag: 'CSidebarNavItem',
      name: '충전진행',
      to: '/log/metervalue',
      icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon" />,
    },
    {
      _tag: 'CSidebarNavItem',
      name: '충전종료',
      to: '/log/stoptran',
      icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon" />,
    },
    {
      _tag: 'CSidebarNavItem',
      name: '상태정보',
      to: '/log/statusnoti',
      icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon" />,
    },
    {
      _tag: 'CSidebarNavItem',
      name: '부팅정보',
      to: '/log/bootnoti',
      icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon" />,
    },


    ]
  },


  {
    _tag: 'CSidebarNavDropdown',
    name: '이력조회',
    route: '',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: '로그인 이력',
        to: '/get/loginhistory',
      }
      ,
      {
        _tag: 'CSidebarNavItem',
        name: '웹소켓로그뷰',
        to: '/get/logview',
      }

    ]
  },

  // ---------------------------------------------------------------------
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

export default _nav
