import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav_logview = [
  
  {
    _tag: 'CSidebarNavItem',
    name: '웹소켓 로그뷰',
    to: '/get/logview',
    icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: 'CSidebarNavItem',
    name: '충전기관리',
    to: '/set/chargerinfo',
    icon: <CIcon name="cil-mouse" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

export default _nav_logview
