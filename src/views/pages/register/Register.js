import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import cookie, { useCookies } from 'react-cookie'
import * as UTIL from '../../../util/Fnc'
import MODAL from '../../modals/Modals'
import CryptoJS from "crypto-js"


const Register = () => {
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cookies] = useCookies(['token']);  //Auth  
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅





  var sum = 0;
  var name = username;
  var pass = pwd;


  // 아이디 중복환인
  const idchek = async () => {
    await axios.post(process.env.REACT_APP_APISERVER + "/api/auth/idchek/", { userId: userid }).then(user => {
      if (user.data.data === null) {
        alert("사용 가능한 아이디")
        sum = 1;
      } else {
        alert("이미 존재하는 아이디")
        sum = 2;
      }
    })
  }


  const params = {
    company_id: "PMGROW",
    csId: "1500",
    userId: userid,
    password: pwd,
    grade: "1",
    permission: "1234",
    username: username,
    email: email,
    phone: "010-4614-9846",
    status: 1

  };

  // 회원가입
  const handleClick = async () => {
    // if(sum === 2 || sum === 0){
    //   alert("아이디 중복확인을 해주세요")
    //   return false;
    // }
    // if(name === null){
    //   alert("이름을 입력해주세요")
    //   return false;
    // }

    // if(pass === null){
    //   alert("비밀번호를 입력해주세요")
    //   return false;
    // }

    await axios.post(process.env.REACT_APP_APISERVER + "/api/auth/register/", params).then(function (user) {
      if (user) {
        alert("회원가입 완료!")
        window.location = "/login"
      } else {
        setModal(UTIL.modalopen('입력한 정보가 정확하지 않습니다', 'danger'))
      }
    }).catch(function (err) {
      //console.log(err)
      setModal(UTIL.modalopen('정보를 입력해주세요'))

    })
  }

  const closemodal = () => {
    setModal(false);
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <MODAL data={warning} fnc={closemodal}></MODAL>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" value={userid} onChange={({ target: { value } }) => setUserid(value)} placeholder="Userid" autoComplete="userid" />
                    <CButton color="success" onClick={idchek}>아이디 중복 확인</CButton>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" value={username} onChange={({ target: { value } }) => setUsername(value)} placeholder="Username" autoComplete="username" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" value={email} onChange={({ target: { value } }) => setEmail(value)} placeholder="Email" autoComplete="email" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" value={pwd} onChange={({ target: { value } }) => setPwd(value)} placeholder="Password" autoComplete="new-password" />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Repeat password" autoComplete="new-password" />
                  </CInputGroup>


                  <CButton color="success" onClick={handleClick}>Create Account</CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
