import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie';
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CNavItem,
  CProgress,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'
import * as UTIL from '../util/Fnc'

// sidebar nav config
import navigation_admin from './_nav_admin'
import navigation_logview from './_nav_logview'
import navigation_monitor from './_nav_monitor'
import navigation_vendor from './_nav_vendor'
import navigation from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const [cookies] = useCookies(['token']);
  const [userinfo] = useState(UTIL.getUserInfo(cookies))  // 쿠키 복호화
  const [menu, setMenu] = useState(navigation)

  useEffect(() => {
    if (userinfo.grade === "0") {
      setMenu(navigation)
    }
    if (userinfo.grade === "1") {
      setMenu(navigation_admin)
    }
    if (userinfo.grade === "2") {
      setMenu(navigation_vendor)
    }
    if (userinfo.grade === "3") {
      if (userinfo.userid === "costel") {
        setMenu(navigation_logview)
      } else {
        setMenu(navigation_monitor)
      }
    }
  }, [])

  return (
    <CSidebar
      show={show}
      unfoldable
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        TOC
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={menu}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
