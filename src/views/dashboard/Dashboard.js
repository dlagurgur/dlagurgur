import React, { lazy, useState, useEffect } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CSelect,
  CContainer,
  CCardFooter,
  CCardTitle,
  CCardSubtitle,
  CCardText,
} from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import * as UTIL from 'src/util/Fnc';
import GV from '../../globalSet';
import '../css/custom.css';
import { isMobile } from 'react-device-detect';
import ProgressBar from 'react-customizable-progressbar'

var fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전기 정보', _classes: 'Tablefirst' }, { key: '차량번호', _classes: 'Tablefirst' }, { key: '경과시간', _classes: 'Tablefirst' }, { key: '남은시간', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst', _style: { textAlign: "center" } }]
if (isMobile) { fields1 = [{ key: '소속정보', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '진행률', _classes: 'Tablefirst' }] }


const Dashboard = (props) => {
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용

  const moment = require('moment');
  const [pagesize, setPageSize] = useState(GV.chargerTablepagesize);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [pages, setPages] = useState(5);

  const [items, setItems] = useState([]);


  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [vendordata, setVendorData] = useState([]);
  const [csdata, setCsData] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [csIdvalue, setCsIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  // 라이브 페이징을 위한 정의  START
  const [userinfo] = useState(UTIL.getUserInfo(cookies))


  useEffect(() => {
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/charger/statuslist/" + companyId + "/" + csId, configHeader).then(result => {
      if (result) {
        if (userinfo.grade === "0") {
          //setData(result.data.data)  
          setItems(result.data.data.docs);
          setPages(result.data.data.totalPages);
        }
        if (userinfo.grade === "2") {
          change4();
        } else {
          change4();
          change3();
        }
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });



    const interval2 = setInterval(function () {
      let companyId = $('#schform [name="companyId"]').val();
      let csId = $('#schform [name="csId"]').val();
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/charger/statuslist/" + companyId + "/" + csId, configHeader).then(result => {
        if (result) {
          if (userinfo.grade === "0") {
            if (companyId === "0" || csId === "0") {
              setItems(result.data.data.docs);
              setPages(result.data.data.totalPages);
            } else {
              change5()
            }
          } else {
            change4();
            change3();
          }
        } else {
          alert("데이터 없어!")
        }
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });
    }, 3000);
    return () => clearInterval(interval2);

  }, [fetchTrigger]);


  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      setVendorData(result.data.data.docs)
    }).catch(err => {

      setModal(UTIL.api401chk(err));
    })
  }, [])

  const change4 = (e) => {
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
        setCsData(result.data.data)

      }).catch(err => {
        setModal(UTIL.api401chk(err));
      })
    } else {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + userinfo.vendorid, configHeader).then(result => {
        setCsData(result.data.data)

      }).catch(err => {
        setModal(UTIL.api401chk(err));
      })
    }
  }


  const change5 = (e) => {

    let url = "/api/pages_ccnf/chargerstatuslist";


    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();


    if (companyId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (csId === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }

    let listdata = { status: 1, pagesize: pagesize, companyId: companyId, csId: csId }  // 리스트 출력 기본 세팅값 정의
    axios.post(process.env.REACT_APP_APISERVER + url, listdata, configHeader).then(result => {
      setItems(result.data.data.docs);
      setPages(result.data.data.totalPages);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change3 = (e) => {
    if (userinfo.grade === "0") {
      setCsIdvalue(e.target.value)
    }

    let url = "/api/pages_ccnf/chargerstatuslist";

    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();


    if (companyId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (csId === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }

    let listdata = { status: 1, pagesize: pagesize, companyId: companyId, csId: csId }  // 리스트 출력 기본 세팅값 정의
    axios.post(process.env.REACT_APP_APISERVER + url, listdata, configHeader).then(result => {
      setItems(result.data.data.docs);
      setPages(result.data.data.totalPages);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }
  return (
    <>

      <CRow>
        <CCol>
          <CCardHeader>
            Dashboard
          </CCardHeader>

          <CCard>
            <CCardBody style={{ textAlign: "center" }}>
              {
                userinfo.grade === "0" &&
                <form name="schform" id="schform" metghod="post">
                  <div style={{ paddingBottom: "5px", float: "left" }}>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 운수사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="select" id="companyId" value={vendorIdvalue} onChange={e => change4(e)} name="companyId" >
                        <option value="0" > 운수사 선택 </option>
                        {
                          vendordata.map((item, index) => {

                            return (
                              <option value={item.companyId}>{item.companyName}</option>
                            )
                          })
                        }
                      </CSelect>
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 충전소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="csId" id="csId" value={csIdvalue} onChange={e => change3(e)}>
                        <option value="0" >::: 선택하세요::: </option>
                        {
                          csdata.map((item, index) => {
                            return (
                              <option value={item.csId}>[{item.companyId}]- {item.csName}</option>
                            )
                          })
                        }
                      </CSelect>
                    </CInputGroup>
                  </div>


                </form>
              }


              {userinfo.grade === "2" &&
                <form name="schform" id="schform" metghod="post">
                  <div style={{ paddingBottom: "5px", float: "left" }}>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 운수사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="select" id="companyId" value={userinfo.vendorid} onChange={e => change4(e)} name="companyId" disabled="disabled">
                        <option value="0" disabled="disabled"> 운수사 선택 </option>
                        {
                          vendordata.map((item, index) => {

                            return (
                              <option value={item.companyId}>{item.companyName}</option>
                            )
                          })
                        }
                      </CSelect>
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 충전소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="csId" id="csId" defaultValue={csIdvalue} onChange={e => change3(e)}>
                        <option value="0" >::: 선택하세요::: </option>
                        {
                          csdata.map((item, index) => {
                            return (
                              <option value={item.csId}>[{item.companyId}]- {item.csName}</option>
                            )
                          })
                        }
                      </CSelect>
                    </CInputGroup>
                  </div>
                </form>
              }

              {userinfo.grade === "3" &&
                <form name="schform" id="schform" metghod="post">
                  <div style={{ paddingBottom: "5px", float: "left" }}>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 운수사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="companyId" maxLength="5" name="companyId" value={userinfo.vendorid} placeholder="" readOnly />

                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 충전소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="csId" maxLength="5" name="csId" value={userinfo.csid} placeholder="" readOnly />
                    </CInputGroup>

                  </div>

                </form>

              }


            </CCardBody>
            <CCardBody>
              <CContainer fluid>
                <CRow>
                  {
                    items.map((item, index) => {
                      return (
                        <CCol sm="3">
                          <CCard>
                            <CCardHeader>
                              <img width="40px" src="/charger.png"></img>&nbsp;&nbsp;
                              <CBadge className="mr-1" color="" style={{ fontSize: "15px" }}>충전기 : {item.csId}({item.connectorId}) </CBadge> &nbsp; &nbsp; &nbsp;
                              {
                                item.company_name.map((item, index) => {
                                  return (
                                    <CBadge className="mr-1" color="" style={{ fontSize: "15px" }}>운수사 : {item.companyName}</CBadge>
                                  )
                                })
                              }

                            </CCardHeader>
                            <CCardBody style={{ textAlign: "center", paddingLeft: "55px" }}>
                              {item.soc < 100 &&
                                <ProgressBar
                                  progress={item.soc}
                                  radius={100}
                                  childrensteps
                                  strokeColor={"#00FF7F"}
                                  trackStrokeWidth={25}
                                  strokeWidth={25}
                                >
                                  <div className="indicator">
                                    <div>{item.soc}%</div>
                                  </div>
                                </ProgressBar>
                              }
                              {item.soc > 100 &&
                                <ProgressBar
                                  progress={100}
                                  radius={100}
                                  strokeColor={"#1E90FF"}
                                  trackStrokeWidth={25}
                                  strokeWidth={25}
                                >
                                  <div className="indicator">
                                    <div>충전완료</div>
                                  </div>
                                </ProgressBar>
                              }
                              <br />

                              <CBadge className="mr-1" color="" style={{ fontSize: "15px" }}>경과 시간 : {moment(item.time).format("mm:ss")}
                              </CBadge>


                              <CBadge className="mr-1" color="" style={{ fontSize: "15px" }}>남은 시간 : {moment(item.time).format("mm:ss")}</CBadge>

                              &nbsp;&nbsp;&nbsp;&nbsp;
                            </CCardBody>
                            <CCardFooter style={{ verticalAlign: "middle", textAlign: "center" }}>
                              {
                                item.busValue.map((item, index) => {
                                  return (
                                    <CBadge className="mr-1" color="" style={{ fontSize: "18px" }}>차량번호 : {item.vehicleId}</CBadge>
                                  )
                                })
                              }
                            </CCardFooter>
                          </CCard>
                        </CCol>
                      )
                    })
                  }
                </CRow>
              </CContainer>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


    </>
  )
}

export default Dashboard
