import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav_admin = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: 'CSidebarNavItem',
    name: '충전인증로그',
    to: '/log/authorize',
    icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon"/>,
   
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['System Manage']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: '설정',
    route: '/set',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: '운수사관리',
        to: '/set/vendor',
        icon: 'cil-library',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '충전소관리',
        to: '/set/chargingstation',
        icon: 'cil-library',
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
        name: '충전기관리',
        to: '/set/chargerinfo',
      }
      ,
      {
        _tag: 'CSidebarNavItem',
        name: '사용자관리',
        to: '/set/manager',
      }
      ,
      {
        _tag: 'CSidebarNavItem',
        name: '정산관리',
        to: '/set/report',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '로그인이력',
        to: '/get/loginhistory',
      },
    ]
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

export default _nav_admin
