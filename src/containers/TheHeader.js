import React, { useEffect, useState, Component } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie';
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CSubheader,
  CBreadcrumbRouter,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Link } from 'react-router-dom'
import * as UTIL from '../util/Fnc'
import axios from 'axios';
// routes config
import routes from '../routes'
import Clock from 'react-live-clock'


const TheHeader = () => {

  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.darkMode)
  const sidebarShow = useSelector(state => state.sidebarShow)
  const [start, setStart] = useState("");
  const [state, setState] = useState("");
  const [stop, setStop] = useState("");
  const [cookies] = useCookies(['token']);
  const [modal, setModal1] = useState(false);
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } }
  //var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cookies), 'my-secret-key@123').toString();
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  useEffect(() => {
    dispatch({ type: 'set', darkMode: !darkMode });
    getList();
    return setTimeout(() => logout(), process.env.REACT_APP_JWT_LOGOUT_TIME);
  }, []);


  const getList = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/chargerstatus").then(result => {
      var statusSum = result.data.data
      var start = statusSum.filter((item) => item.status === 'Charging').length
      var state = statusSum.filter((item) => item.status === 'Available').length
      var stop = statusSum.filter((item) => item.status === 'Faulted').length
      setStart(start)
      setState(state)
      setStop(stop)

    }).catch(err => {
      alert(err)
    });
  }


  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const logout = () => {
    window.location.href = '/logout';
  }

  const toggle = () => {
    setModal1(!modal);
  }


  return (
    <>
      <CModal
        show={modal}
        onClose={toggle}
        color="danger"
      >
        <CModalHeader closeButton>
          <CModalTitle>TOC System POPUP</CModalTitle>
        </CModalHeader>
        <CModalBody id="txtmsg" style={{ textAlign: 'center', paddingTop: "30px", paddingBottom: "30px" }} >
          로그아웃 하시겠습니까?
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={logout} >확인 </CButton>
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>

      <CHeader withSubheader>
        <CToggler
          inHeader
          className="ml-md-3 d-lg-none"
          onClick={toggleSidebarMobile}
        />
        <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        />
        <CHeaderBrand className="mx-auto d-lg-none" to="/">
          PMGROW TOC MANAGEMENT SYSTEM
        </CHeaderBrand>

        <CHeaderNav className="d-md-down-none mr-auto">

        </CHeaderNav>

        <CHeaderNav className="px-3" >
          <li style={{ paddingTop: "15px" }}>
            <p style={{ display: 'inline-block', background: "#708090", width: "15px", height: "15px", borderRadius: "15px", lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}></p>&nbsp;&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle", color: '#708090' }}>총 충전기</p>&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}>{start + stop + state}</p>
          </li>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <li style={{ paddingTop: "15px" }}>
            <p style={{ display: 'inline-block', background: "#81c750", width: "15px", height: "15px", borderRadius: "15px", lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}></p>&nbsp;&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle", color: '#81c750' }}>충전중</p>&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}>{start}</p>
          </li>

          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <li style={{ paddingTop: "15px" }}>
            <p style={{ display: 'inline-block', background: "#e55e5e", width: "15px", height: "15px", borderRadius: "15px", lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}></p>&nbsp;&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle", color: "#e55e5e" }}>충전 중지</p>&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}>{stop}</p>
          </li>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;

          <li style={{ paddingTop: "15px" }}>
            <p style={{ display: 'inline-block', background: "#00BFFF", width: "15px", height: "15px", borderRadius: "15px", lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}></p>&nbsp;&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle", color: "00BFFF" }}>대기중</p>&nbsp;
            <p style={{ display: 'inline-block', lineHeight: "24px", fontWeight: "bold", verticalAlign: "middle" }}>{state}</p>
          </li>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <div>
            <Clock format={'YYYY년 MM월 DD일 HH:mm:ss'} ticking={true} timezone={''} style={{ fontWeight: "bold", fontSize: "15px" }} />
            {/* {moment("2021-11-30T11:57:25.311Z").format("YYYY/MM/DD HH:mm")} */}
          </div>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <CToggler
            inHeader
            className="ml-3 d-md-down-none c-d-legacy-none"
            onClick={() => dispatch({ type: 'set', darkMode: !darkMode })}
            title="Toggle Light/Dark Mode"
          >
            <CIcon name="cil-moon" className="c-d-dark-none" alt="CoreUI Icons Moon" />
            <CIcon name="cil-sun" className="c-d-default-none" alt="CoreUI Icons Sun" />
          </CToggler>
          <div style={{ float: "left", paddingRight: "10px", fontWeight: "bold" }}>{userinfo.username}</div>
          <div style={{ float: "left" }}>
            <Link to="#" onClick={toggle}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="c-icon c-icon-2xl" style={{ color: "gray", height: "30px" }} role="img"><polygon fill="var(--ci-primary-color, currentColor)" points="77.155 272.034 351.75 272.034 351.75 272.033 351.75 240.034 351.75 240.033 77.155 240.033 152.208 164.98 152.208 164.98 152.208 164.979 129.58 142.353 15.899 256.033 15.9 256.034 15.899 256.034 129.58 369.715 152.208 347.088 152.208 347.087 152.208 347.087 77.155 272.034" class="ci-primary"></polygon><polygon fill="var(--ci-primary-color, currentColor)" points="160 16 160 48 464 48 464 464 160 464 160 496 496 496 496 16 160 16" class="ci-primary"></polygon></svg></Link>

          </div>

        </CHeaderNav>

        <CSubheader className="px-3 justify-content-between">
          <CBreadcrumbRouter className="border-0 c-subheader-nav m-0 px-0 px-md-3" routes={routes} />

        </CSubheader>
      </CHeader >
    </>
  )
}

export default TheHeader
