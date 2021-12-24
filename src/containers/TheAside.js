import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem,
  CSwitch,
  CProgress,
  CSidebar,
  CImg,
  CSidebarClose
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const TheAside = () => {
  const show = useSelector(state => state.asideShow)
  const dispatch = useDispatch()
  const setState = (state) => dispatch({type: 'set', asideShow: state})
  
  return (
    <CSidebar
      aside
      colorScheme='light'
      size='lg'
      overlaid
      show={show}
      onShowChange={(state) => setState(state)}
    >
      
    </CSidebar>
  )
}

export default React.memo(TheAside)
