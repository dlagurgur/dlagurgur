import React, { useState, useEffect } from 'react'
import { Redirect } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import cookie, { useCookies } from 'react-cookie'
import * as UTIL from '../../../util/Fnc'
import MODAL from '../../modals/Modals'
import CryptoJS from "crypto-js"


const Login = ({ authenticated, login, location }) => {
  const [id, setId] = useState("");
  const [config, setConfig] = useState(0);
  const [pwd, setPwd] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  // login 로그인
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } }


  const handleClick = async () => {
    let preferencesName = "ENCRYPT_KEY"
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/preferences/" + preferencesName, configHeader).then(result => {
      if (result.data.data.docs.length == 0) {
        axios.post(process.env.REACT_APP_APISERVER + "/api/pages/preferencesr", { preferencesName: "ENCRYPT_KEY", preferencesValue: 180000, preferencesNote: "token time" }, configHeader).then(result => {

          if (result.data.status == 1) {
            axios.get(process.env.REACT_APP_APISERVER + "/api/pages/preferences/" + preferencesName, configHeader).then(result => {
              axios.post(process.env.REACT_APP_APISERVER + "/api/auth/weblogin/", { userId: id, password: pwd, userIp: "" }).then(function (response) {
                //토큰 시간 api 추가할 자리
                const company = response.data.data.company;
                const token = response.data.data.token;
                var userId = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.userId), process.env.REACT_APP_ENCRYPT_KEY).toString();
                var username = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.username), process.env.REACT_APP_ENCRYPT_KEY).toString();
                var grade = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.grade), process.env.REACT_APP_ENCRYPT_KEY).toString();
                var vendorId = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.companyId), process.env.REACT_APP_ENCRYPT_KEY).toString();
                var csId = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.csId), process.env.REACT_APP_ENCRYPT_KEY).toString();
                setCookie('TocToken', response.data.data.token, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
                setCookie('TocData1', userId, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
                setCookie('TocData2', username, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
                setCookie('TocData3', grade, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
                setCookie('TocData4', vendorId, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
                setCookie('TocData5', csId, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
                login({ userId, token });
                // return setTimeout(() => logout(), (result.data.data.docs[0].preferencesValueig * 100) - 10000);
              }).catch(function (err) {
                //console.log(err)
                setModal(UTIL.modalopen('<span style="font-size:20px;"><b>로그인 오류1</b>' + JSON.stringify(err) + '</span>', 'danger'))
                setId("");
                setPwd("");
              })
            })
          } else {
            alert("실패")
          }
        }).catch(err => {

        })
      } else {
        axios.post(process.env.REACT_APP_APISERVER + "/api/auth/weblogin/", { userId: id, password: pwd, userIp: "" }).then(function (response) {
          //토큰 시간 api 추가할 자리
          if (response.data.status === 1) {
            const company = response.data.data.company;
            const token = response.data.data.token;
            var userId = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.userId), process.env.REACT_APP_ENCRYPT_KEY).toString();
            var username = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.username), process.env.REACT_APP_ENCRYPT_KEY).toString();
            var grade = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.grade), process.env.REACT_APP_ENCRYPT_KEY).toString();
            var vendorId = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.companyId), process.env.REACT_APP_ENCRYPT_KEY).toString();
            var csId = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.csId), process.env.REACT_APP_ENCRYPT_KEY).toString();
            setCookie('TocToken', response.data.data.token, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
            setCookie('TocData1', userId, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
            setCookie('TocData2', username, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
            setCookie('TocData3', grade, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
            setCookie('TocData4', vendorId, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
            setCookie('TocData5', csId, { path: '/', maxAge: result.data.data.docs[0].preferencesValue });
            login({ userId, token });
            // return setTimeout(() => logout(), (result.data.data.docs[0].preferencesValueig * 100) - 10000);
          } else {
            setModal(UTIL.modalopen('입력한 정보가 정확하지 않습니다', 'danger'))
          }
        }).catch(function (err) {
          //console.log(err)
          setModal(UTIL.modalopen('<span style="font-size:20px;"><b>로그인 오류1</b>' + JSON.stringify(err) + '</span>', 'danger'))
          setId("");
          setPwd("");
        })
      }
    })
  }



  const logout = () => {

    window.location.href = '/logout';
  }

  const closemodal = () => {
    setModal(false);
  }
  const { from } = location.state || { from: { pathname: "/" } }
  if (authenticated) window.location = "/dashboard"//<Redirect to="/" />

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <MODAL data={warning} fnc={closemodal}></MODAL>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm id="frmname">
                    <h1>Login</h1>
                    <p className="text-muted">로그인해주세요</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" value={id} onChange={({ target: { value } }) => setId(value)} placeholder="ID" autoComplete="account" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" value={pwd} onChange={({ target: { value } }) => setPwd(value)} placeholder="Password" autoComplete="current-password" />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" onClick={handleClick} className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">

                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
