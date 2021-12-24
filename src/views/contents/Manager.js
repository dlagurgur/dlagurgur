import React, { useState, useEffect } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CForm,
  CFormGroup,
  CButton,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CSelect,
} from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import MODAL from '../modals/Modals';
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';
import { ManagerGrade, SetGradeTxt } from 'src/reusable/CommonAxios'
import Moment from 'react-moment'
const moment = require('moment');

const defaultValue = [{ _id: "", username: "", userId: "", phone: "", email: "", grade: "", status: 1, password: "" }];
const Manager = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var fields1 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '사용자ID', _classes: 'Tablefirst' }, { key: '운수사', _classes: 'Tablefirst' }, { key: '연락처', _classes: 'Tablefirst' }, { key: '권한', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '업체코드', _classes: 'Tablefirst' }, { key: '권한', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '사용자ID', _classes: 'Tablefirst' }, { key: '운수사', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '업체코드', _classes: 'Tablefirst' }, { key: '권한', _classes: 'Tablefirst' }] }
  var fields3 = [{ key: '로그인IP', _classes: 'Tablefirst' }, { key: '로그인 일시', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  var logfield = [{ key: '로그 타입', _classes: 'Tablefirst' }, { key: '로그 일시', _classes: 'Tablefirst' }, { key: '입력값', _classes: 'Tablefirst' }, { key: '메세지', _classes: 'Tablefirst' },]
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [logfield1, setlogfield] = useState(logfield)
  const [fields4, setFields3] = useState(fields3)
  const [mode, setMode] = useState("alert");

  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [data, setData] = useState([]);
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendordata, setVendorData] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [gradevalue, setGradevalue] = useState("");   // 사용자 추가시 권한 설정

  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logdata, setLogData] = useState([])
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(5);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [columnFilterValue, setColumnFilterValue] = useState();
  const [tableFilterValue, setTableFilterValue] = useState("");
  const [sorterValue, setSorterValue] = useState();
  const [csdata1, setCsData1] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [csIdvalue, setCsIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [csIdvalue1, setCsIdvalue1] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [csdata, setCsData] = useState([]);
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  const params = {
    page,
    columnFilterValue: JSON.stringify(columnFilterValue),
    tableFilterValue,
    sorterValue: JSON.stringify(sorterValue),
    itemsPerPage
  };
  // 라이브 페이징을 위한 정의  END
  const query = new URLSearchParams(params).toString();
  useEffect(() => {
    if (userinfo.grade === "0") {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages/manager/list/" + page, configHeader).then(result => {
        setItems(result.data.data.docs);
        setPages(result.data.data.totalPages);
        setLoading(false);
      }).catch(err => {
        setModal(UTIL.api401chk(err));
        setTimeout(() => {
          setFetchTrigger(fetchTrigger + 1);
        }, 2000);
      });
    } else {
      change4();
      change3();
    }

  }, [query, fetchTrigger]);


  // 사용자 리스트 호출 함수 
  const getList = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/manager/list/" + page, configHeader).then(result => {
      setItems(result.data.data.docs);
      setPages(result.data.data.totalPages);
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  //d운수사 리스트
  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      setVendorData(result.data.data.docs)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }, [])

  // 운수사 상세정보 호출 함수
  const getDetail = (_id, userId) => {
    closemodal();
    $("#insert").hide()
    $("#detail").show()
    $("#frmadd")[0].reset();
    setFields(fields2);
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/manager/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].companyId)
      setGradevalue(result.data.data[0].grade)
      setCsIdvalue(result.data.data[0].csId)
      setCsIdvalue1(result.data.data[0].csId)
      change(result.data.data[0].companyId);
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/logindetail/" + userId, configHeader).then(result => {
        setData(result.data.data)
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });



      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/loghistory/" + userId, configHeader).then(result => {

        setLogData(result.data.data)
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
      UTIL.writeani('open')
      $("#dateview").fadeIn();
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });


  }

  const updateModal = (_id) => {
    closemodal();
    $("#detail").hide()
    $("#insert").show();
    setFields(fields2);
    $("#frmadd")[0].reset();
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/manager/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].vendorId)
      setGradevalue(result.data.data[0].grade)
      setCsIdvalue(result.data.data[0].csId)
      setCsIdvalue1(result.data.data[0].csId)
      change(result.data.data[0].companyId);
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
      UTIL.writeani('open')
      $("#dateview").fadeIn();
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  const handleClick = async () => {
    let txt = "";

    let frmstruserId = $('#frmadd [name="userId"]').val();
    let frmstrvendorId = $('#frmadd [name="companyId1"]').val();
    let frmstrcsId = $('#frmadd [name="csId1"]').val();
    let frmstrpassword = $('#frmadd [name="password"]').val();
    let frmstrusername = $('#frmadd [name="username"]').val();
    let frmstrgrade = $('#frmadd [name="grade"]').val();
    let frmstrpermission = $('#frmadd [name="permission"]').val();
    let frmstrphone = $('#frmadd [name="phone"]').val();
    let frmstremail = $('#frmadd [name="email"]').val();
    let frmstatus = $('#frmadd [name="status"]').val();
    let frmstrpassword2 = $('#frmadd [name="password2"]').val();

    let sendinfcreate = {
      companyId: frmstrvendorId,
      csId: frmstrcsId,
      userId: frmstruserId,
      password: frmstrpassword,
      grade: frmstrgrade,
      permission: frmstrpermission,
      username: frmstrusername,
      email: frmstremail,
      phone: frmstrphone,
      offdate: "",
      status: frmstatus,
      pagesize: GV.vendorTablepagesize
    }
    if (frmstrvendorId == "0") {
      alert("운수사 정보를 입력해주세요")
      return false
    } else if (frmstrcsId == "0") {
      alert("충전소 정보를 입력해주세요")
      return false
    } else if (frmstruserId == "") {
      alert("사용자 ID 를 입력해주세요")
      return false
    } else if (frmstrpassword == "") {
      alert("패스워드 를 입력해주세요")
      return false
    } else if (frmstrusername == "") {
      alert("사용자명을 입력해주세요")
      return false
    } else if (frmstrpassword != frmstrpassword2) {
      alert("비밀번호가 다릅니다")
      return false;
    } else {
      if ($('#frmadd [name="id"]').val()) {
        txt = "수정";
        let url = "/api/pages/manager/" + $('#frmadd [name="id"]').val();
        axios.put(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
          if (result.data.status === 1) {
            let companyId12 = $('#schform [name="vendorId"]').val();
            if (companyId12 == 0) {
              getList();
              setFields(fields1);
              UTIL.writeani('close')
              closemodal()
            } else {
              setFields(fields1);
              UTIL.writeani('close')
              closemodal();
              change15();
            }
          } else {

            if (result.data.status === 9) {
              $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
              $("#btn_modal_save").hide();
            } else {
              $("#txtmsg").text("등록실패")
              $("#btn_modal_save").hide();
            }
          }
        }).catch(err => {
          setModal(UTIL.api401chk(err));
        })
      } else {
        txt = "등록";
        let url = "/api/pages/manager";
        axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
          if (result.data.status === 1) {
            let companyId12 = $('#schform [name="vendorId"]').val();
            if (companyId12 == 0) {
              getList();
              setFields(fields1);
              UTIL.writeani('close')
              closemodal()
            } else {
              setFields(fields1);
              UTIL.writeani('close')
              closemodal();
              change15();
            }
          } else {

            if (result.data.status === 9) {
              $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
              $("#btn_modal_save").hide();
            } else {
              $("#txtmsg").text("등록실패")
              $("#btn_modal_save").hide();
            }
          }
        }).catch(err => {
          setModal(UTIL.api401chk(err));
        })
      }

    }
  }

  const change4 = (e) => {
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
        setCsData(result.data.data)
        change3(e)
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

  const openmodal = () => {
    let txt = "";
    setMode('save');
    $("#btn_modal_save").show();
    if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
    setModal(UTIL.modalopen('사용자 정보를 ' + txt + '하시겠습니까?', 'danger'))
  }
  const closemodal = () => {
    setModal(false);
  }
  // 입력폼 표시 애니메이션 처리
  const setTableOpen = () => {
    $("#detail").hide()
    $("#insert").show();
    $("#frmadd")[0].reset();
    setDetailData(defaultValue)
    if (userinfo.grade === "0") {
      setCsIdvalue1("")
      setCsIdvalue("")

    }
    $("#frmadd input").val("");
    $("#dateview").fadeOut();
    setModal(false);
    setFields(fields2);
    if (userinfo.grade != "0") {
      change4();
    }
    UTIL.writeani('open')
  }


  // 입력폼 닫기 애니메이션 처리
  const setTableClose = () => {
    closemodal();
    setDetailData(defaultValue)
    UTIL.writeani('close')
    setFields(fields1);
    if (userinfo.grade != "0") {
      change4();
    }
  }

  const change13 = (e) => {
    setVendorIdvalue(e.target.value)
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
      setCsData1(result.data.data)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change = (value) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + value, configHeader).then(result => {
      setCsData1(result.data.data)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change2 = (e) => {
    setCsIdvalue(e.target.value)
    setCsIdvalue1(e.target.value)
  }

  const changeGrade = (e) => { setGradevalue(e.target.value) }  // 권한 선택시 state 변경


  const change15 = () => {
    let vendorId = $('#schform [name="vendorId"]').val();
    let csId = $('#schform [name="csId"]').val();

    if (vendorId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (csId === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/manager/" + csId + "/" + vendorId, configHeader).then(result => {
      setItems(result.data.data.docs);
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }




  const change3 = (e) => {
    if (userinfo.grade === "0") {
      setCsIdvalue(e.target.value)
    }

    let txt = "";

    let vendorId = $('#schform [name="vendorId"]').val();
    let csId = $('#schform [name="csId"]').val();

    if (vendorId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (csId === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }
    UTIL.writeani('close')
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/manager/" + csId + "/" + vendorId, configHeader).then(result => {
      setItems(result.data.data.docs);
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }
  return (
    <>
      <CRow>
        <CCol>
          <MODAL data={warning} fnc={closemodal} mode={mode} handleClick={handleClick}></MODAL>
          <CRow>

            <CCard id="listtable2" style={{ width: "100%", position: "relative", float: "left" }}>
              <CCardHeader>
                사용자리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>사용자등록</CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                {userinfo.grade === "0" &&
                  <form name="schform" id="schform" metghod="post">
                    <div style={{ paddingBottom: "5px", float: "left" }}>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="vendorId" defaultValue={vendorIdvalue} onChange={e => change4(e)} name="vendorId" >
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


                {userinfo.grade === "2" &&
                  <form name="schform" id="schform" metghod="post">
                    <div style={{ paddingBottom: "5px", float: "left" }}>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="companyId" maxLength="5" name="vendorId" value={userinfo.vendorid} placeholder="" readOnly />
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
                        <CInput type="text" id="companyId" maxLength="5" name="vendorId" value={userinfo.vendorid} placeholder="" readOnly />

                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText> 충전소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="csId" maxLength="5" name="csId" value={userinfo.csid} placeholder="" readOnly />
                      </CInputGroup>
                    </div>
                  </form>
                }
                <CDataTable
                  items={items}
                  fields={fields}
                  onRowClick={(item) => getDetail(item._id, item.userId)}
                  scopedSlots={{
                    '이름':
                      (item) => (
                        <td >
                          {item.username}
                        </td>
                      ),
                    '사용자ID':
                      (item) => (
                        <td >
                          {item.userId}
                        </td>
                      ),
                    '운수사':
                      (item) => (
                        <td>
                          {
                            item.companyname.map((item, index) => {
                              return (
                                <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.companyName}</CBadge>
                              )
                            })
                          }
                        </td>
                      ),
                    '연락처':
                      (item) => (
                        <td>{item.phone}</td>
                      ),
                    '권한':
                      (item) => (
                        <td>
                          <SetGradeTxt grade={item.grade} />
                        </td>
                      ),
                    '상태':
                      (item) => (
                        <td>
                          {item.status === 1 && <CBadge className="mr-1" color="warning" style={{ padding: "5px", fontSize: "13px" }}>사용중</CBadge>}
                          {item.status === 0 && <CBadge className="mr-1" color="dark" style={{ padding: "5px", fontSize: "13px" }}>사용중지</CBadge>}
                          {item.status === 2 && <CBadge className="mr-1" color="warning" style={{ padding: "5px", fontSize: "13px" }}>등록대기</CBadge>}

                        </td>
                      )
                  }}
                />

              </CCardBody>
            </CCard>

            <CCard id="writefrm" style={{ width: "45%", position: "relative", float: "left", display: "none" }}>
              <div id="detail" style={{ display: "none" }}>
                <CCardHeader>
                  사용자 상세 정보
                </CCardHeader>
                <CCardBody>

                  <input type="hidden" name="id1" id="id1" defaultValue={detaildata[0]._id} />
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 운수사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="select" id="companyId" value={vendorIdvalue} onChange={e => change(e)} name="companyId" disabled="disabled">
                        <option value="0" disabled="disabled"> ::: 선택하세요 :::</option>
                        {
                          vendordata.map((item, index) => {
                            var a = detaildata[0].companyId === item.companyId ? ' selected' : ''
                            return (
                              <option value={item.companyId}>{item.companyName}</option>
                            )
                          })
                        }
                      </CSelect>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 충전소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="csId" id="csId" value={csIdvalue} onChange={e => change2(e)} disabled="disabled">
                        <option value="0" disabled="disabled"> ::: 선택하세요 :::</option>
                        {
                          csdata1.map((item, index) => {
                            return (
                              <option value={item.csId}>[ {item.companyId} ] - {item.csName}</option>
                            )
                          })
                        }
                      </CSelect>

                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 사용자ID</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" name="userId1" defaultValue={detaildata[0].userId} readOnly />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 비밀번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" name="password1" defaultValue={detaildata[0].password} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>사용자명</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" name="username1" defaultValue={detaildata[0].username} readOnly />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>이메일</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" name="email1" defaultValue={detaildata[0].email} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 권한</CInputGroupText>
                      </CInputGroupPrepend>
                      {detaildata[0].grade === "3" && <CInput type="text" defaultValue="Monitor" readOnly ></CInput>}
                      {detaildata[0].grade === "2" && <CInput type="text" defaultValue="Vendor" readOnly />}
                      {detaildata[0].grade === "1" && <CInput type="text" defaultValue="Admin" readOnly></CInput>}
                      {detaildata[0].grade === "0" && <CInput type="text" defaultValue="Super" readOnly></CInput>}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 상태정보 </CInputGroupText>
                      </CInputGroupPrepend>
                      {detaildata[0].status === 0 && <CInput type="text" defaultValue="사용중지" readOnly ></CInput>}
                      {detaildata[0].status === 1 && <CInput type="text" defaultValue="사용중" readOnly />}
                      {detaildata[0].status === 2 && <CInput type="text" defaultValue="등록대기" readOnly></CInput>}
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>연락처</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" name="phone1" defaultValue={detaildata[0].phone} readOnly />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>등록일</CInputGroupText>
                      </CInputGroupPrepend>
                      <Moment local format="YYYY-MM-DD  HH:mm">{detaildata[0].createdAt}</Moment>
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={() => updateModal(detaildata[0]._id)} size="bg" color="success" style={{ width: "100px" }}>수정</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>
                </CCardBody>




                <CCardHeader>
                  로그인 이력
                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    items={data}
                    fields={fields4}
                    itemsPerPage={5}
                    hover
                    sorter
                    pagination
                    scopedSlots={{
                      '로그인IP':
                        (item) => (
                          <td>
                            {item.ipAddress}
                          </td>
                        ),
                      '로그인 일시':
                        (item) => (
                          <td>
                            {/* {item.createdAt} */}
                            <Moment local format="YYYY-MM-DD  HH:mm">{item.createdAt}</Moment>
                          </td>
                        ),
                      '상태':
                        (item) => (
                          <td>{item.state}</td>
                        )



                    }}
                  />
                </CCardBody>



                <CCardHeader>
                  로그 정보
                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    items={logdata}
                    fields={logfield1}
                    itemsPerPage={5}
                    hover
                    sorter
                    pagination
                    scopedSlots={{
                      '로그 타입':
                        (item) => (
                          <td >
                            {item.log.doctype}
                          </td>
                        ),
                      '로그 일시':
                        (item) => (
                          <td>
                            {/* {item.createdAt} */}
                            <Moment local format="YYYY-MM-DD  HH:mm">{item.createdAt}</Moment>
                          </td>
                        ),
                      '입력값':
                        (item) => (
                          <td style={{ width: "300px", display: "block", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.log.inputdata}</td>
                        ),
                      '메세지':
                        (item) => (
                          <td>{item.log.errmsg}</td>
                        )
                    }}
                  />
                </CCardBody>

              </div>


              <div id="insert" style={{ display: "none" }}>
                <CCardHeader>
                  사용자정보 입력
                </CCardHeader>
                <CCardBody>
                  <CForm action="" name="frmadd" id="frmadd" method="post">
                    <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                    {userinfo.grade === "0" &&
                      <CFormGroup>
                        <CInputGroup>
                          <CInputGroupPrepend>
                            <CInputGroupText> *운수사</CInputGroupText>
                          </CInputGroupPrepend>
                          <CSelect custom name="select" id="companyId" value={detaildata[0].companyId} onChange={e => change13(e)} name="companyId1" disabled={detaildata[0].companyId}>
                            <option value="0" disabled={detaildata[0].companyId}> ::: 선택하세요 :::</option>
                            {
                              vendordata.map((item, index) => {
                                var a = detaildata[0].companyId === item.companyId ? ' selected' : ''
                                return (
                                  <option value={item.companyId}>{item.companyName}</option>
                                )
                              })
                            }
                          </CSelect>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <CInputGroupPrepend>
                            <CInputGroupText> *충전소</CInputGroupText>
                          </CInputGroupPrepend>
                          <CSelect custom name="csId1" id="csId" value={csIdvalue1} onChange={e => change2(e)}>
                            <option value="0" >::: 선택하세요::: </option>
                            {
                              csdata1.map((item, index) => {
                                return (
                                  <option value={item.csId}>[{item.companyId}]- {item.csName}</option>
                                )
                              })
                            }
                          </CSelect>
                        </CInputGroup>
                      </CFormGroup>
                    }

                    {userinfo.grade === "2" &&
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> *운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="companyId" value={userinfo.vendorid} onChange={e => change4(e)} name="companyId1" disabled="disabled">
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
                          <CInputGroupText> *충전소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="csId1" id="csId" value={csIdvalue} onChange={e => change3(e)}>
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


                    }

                    {userinfo.grade === "3" &&

                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> *운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="companyId" value={userinfo.vendorid} name="companyId1" disabled="disabled">
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
                          <CInputGroupText> *충전소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="csId1" id="csId" value={userinfo.csid} onChange={e => change4(e)} disabled="disabled">
                          <option value="0" disabled="disabled"> ::: 선택하세요 :::</option>
                          {
                            csdata.map((item, index) => {
                              return (
                                <option value={item.csId}>[ {item.companyId} ] - {item.csName}</option>
                              )
                            })
                          }
                        </CSelect>
                      </CInputGroup>

                    }


                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>*사용자ID</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="userId" name="userId" defaultValue={detaildata[0].userId} />

                      </CInputGroup>
                    </CFormGroup>


                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> *비밀번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" id="password" name="password" defaultValue={detaildata[0].password} />

                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText> *비밀번호 재확인</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" id="password2" name="password2" defaultValue={detaildata[0].password} />


                      </CInputGroup>
                    </CFormGroup>





                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>*사용자명</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="username" name="username" defaultValue={detaildata[0].username} />
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>이메일</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="email" id="email" name="email" defaultValue={detaildata[0].email} />
                      </CInputGroup>
                    </CFormGroup>


                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 상태정보 </CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom id="status" name="status">
                          <option value="1"> 사용중 </option>
                          <option value="2"> 등록대기 </option>
                          <option value="0"> 사용중지 </option>

                        </CSelect>

                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*권한</CInputGroupText>
                        </CInputGroupPrepend>
                        <ManagerGrade grade={gradevalue} changeGrade={changeGrade} />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>연락처</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="number" id="phone" name="phone" defaultValue={detaildata[0].phone} />
                      </CInputGroup>
                    </CFormGroup>


                    <CFormGroup className="form-actions">
                      <CButton type="button" onClick={openmodal} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
                      <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                    </CFormGroup>

                  </CForm>
                </CCardBody>

              </div>

            </CCard>

          </CRow>

        </CCol>
      </CRow>
    </>
  )
}

export default Manager