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
    icon: 'cil-puzzle'
  },
  {
    _tag: 'CSidebarNavItem',
    name: '충전소 목록',
    to: '/set/chargingstation',
    icon: 'cil-puzzle'
  },

  {
    _tag: 'CSidebarNavItem',
    name: '충전기 목록',
    to: '/set/chargerinfo',
    icon: 'cil-puzzle'
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
        name: '로그인 이력',
        to: '/get/loginhistory',
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
