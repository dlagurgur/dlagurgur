/* global kakao */
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
  CTextarea,
  CSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import MODAL from '../modals/Modals';
import GV from '../../globalSet'

const fields1 = [{ key: '충전소(운수사)', _classes: 'Tablefirst' }, { key: '충전기 수', _classes: 'Tablefirst' }, { key: '연락처', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '충전이력', _classes: 'Tablefirst' }]
const fields2 = [{ key: '충전소(운수사)', _classes: 'Tablefirst' }, { key: '충전기 수', _classes: 'Tablefirst' }, { key: '연락처', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
const defaultValue = [{ _id: "", name_kr: "", tel_number: "", address_detail: "", biznum: "", vendorId: "", status: 1 }];
const fileds3 = [{ key: '사용월', _classes: 'Tablefirst' }, { key: '총 충전횟수', _classes: 'Tablefirst' }, { key: '총 충전시간', _classes: 'Tablefirst' }, { key: '충전전력량(kW/h)', _classes: 'Tablefirst' }, { key: '충전기인입전력량(kW/h)', _classes: 'Tablefirst' }, { key: '충전요금(원)', _classes: 'Tablefirst' }]
const Vendor = () => {
  const { kakao } = window;
  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [fields3, setFields3] = useState(fileds3)
  const [mode, setMode] = useState("alert");
  const [vendordata, setVendorData] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [cpanyName, setCompanyName] = useState([]);
  const [data, setData] = useState([]);
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendorIdreadonly, setVRO] = useState(false)
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [pages, setPages] = useState(5);
  const [addressdata, AddressData] = useState("");
  const [csdata, setCsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  const [modal, setModal1] = useState(false);
  const [warning3, setModal3] = useState("");
  const [wattage, setWattage] = useState([]);
  useEffect(() => {
    if (userinfo.grade === "0") {
      getList();
    } else {
      change4();
      change3();
    }

  }, []);


  //운수사 리스트
  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      setVendorData(result.data.data.docs)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }, [])

  // // 충전소 리스트 호출 함수 
  const getList = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations", configHeader).then(result => {
      setData(result.data.data.docs)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  // 운수사 상세정보 호출 함수

  const getDetail = (_id) => {
    $("#insert").hide()
    $("#detail").show()
    setVRO(false);
    $("#frmadd")[0].reset();
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/id/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setFields(fields2);
      setVendorIdvalue(result.data.data.companyId)
      // 지도를 생성합니다.
      setTimeout(() => {
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(35.12, 129.1),
          level: 3
        };
        const map = new kakao.maps.Map(container, options);
        // 주소-좌표 변환 객체를 생성합니다.
        const geocoder = new kakao.maps.services.Geocoder();
        // 주소로 좌표를 검색합니다..
        geocoder.addressSearch(result.data.data.address, function (result, status) {
          // 정상적으로 검색이 완료됐으면 
          if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
              map: map,
              position: coords
            });
            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
          }
        })
      }, 500);
      UTIL.writeani('open')

      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/wattage/" + result.data.data.csId + "/" + result.data.data.companyId, configHeader).then(result => {
        setWattage(result.data.data.docs)
      })

    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  const handleClick = async () => {
    let txt = "";
    let url = "/api/pages/chargingstations";

    if ($('#frmadd [name="id"]').val()) {
      txt = "수정";
      url = "/api/pages_cp/chargingstations/" + $('#frmadd [name="id"]').val();
    } else {
      txt = "등록";

      url = "/api/pages_cp/chargingstations";
    }
    let frmstrcompanyId = $('#frmadd [name="companyId"]').val();
    let frmstrcsName = $('#frmadd [name="csName"]').val() + $('#frmadd [name="cpanyName"]').val();
    let frmstrcsId = $('#frmadd [name="csId"]').val();
    let frmstrtel = $('#frmadd [name="tel"]').val();
    let frmstraddress = $('#frmadd [name="address"]').val();
    let frmstraddressdetail = $('#frmadd [name="addressdetail"]').val();
    let frmstrbiznum = $('#frmadd [name="biznum"]').val();
    let frmstrnote = $('#frmadd [name="etcinfo"]').val();
    let frmstatus = $('#frmadd [name="status"]').val();

    let sendinfcreate = {
      companyId: frmstrcompanyId,
      csId: frmstrcsId,
      csName: frmstrcsName,
      tel: frmstrtel,
      address: frmstraddress,
      addressdetail: frmstraddressdetail,
      biznum: frmstrbiznum,
      note: frmstrnote,
      status: frmstatus,
      pagesize: GV.vendorTablepagesize
    }

    if (frmstrcompanyId == "0") {
      alert("운수사 정보를 입력해주세요")
      toggle()
      return false
    } else if (frmstrcsId == "") {
      alert("충전소 ID 를 입력해주세요")
      toggle()
      return false
    } else if (frmstrcsName == "") {
      alert("충전소 명을 입력해주세요")
      toggle()
      return false
    } else if (frmstrbiznum == "") {
      alert("사업자 번호를 입력해주세요")
      toggle()
      return false
    } else {
      if (txt === "수정") {
        axios.put(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
          if (result.data.status === 1) {
            if (userinfo.grade === "0") {
              let companyId12 = $('#schform [name="companyId"]').val();
              if (companyId12 == 0) {
                getList();
                setFields(fields1);
                UTIL.writeani('close')
                toggle()
              } else {
                setFields(fields1);
                UTIL.writeani('close')
                toggle();
                change10();
              }
            } else {
              change3();
              setFields(fields1);
              UTIL.writeani('close')
              toggle();
            }
          } else {

            if (result.data.status === 9) {
              $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
              $("#btn_modal_save").hide();
              //setErrmsg(result.data.errmsg[0].msg)
            } else {
              $("#txtmsg").text("등록실패")
              $("#btn_modal_save").hide();
            }

          }
        }).catch(err => {
          setModal(UTIL.api401chk(err));
        })
      } else {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/" + frmstrcsId, configHeader).then(result => {
          if (result.data.data === 2) {
            alert("사용중인 충전소 ID 입니다")
            toggle();
            return false
          } else {
            axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
              if (result.data.status === 1) {
                if (userinfo.grade === "0") {
                  let companyId12 = $('#schform [name="companyId"]').val();
                  if (companyId12 == 0) {
                    getList();
                    setFields(fields1);
                    UTIL.writeani('close')
                    toggle()
                  } else {
                    setFields(fields1);
                    UTIL.writeani('close')
                    toggle();
                    change10();
                  }
                } else {
                  change3();
                  setFields(fields1);
                  UTIL.writeani('close')
                  toggle();
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
        })
      }
    }
  }

  const closemodal = () => {
    setModal(false);
  }
  // 입력폼 표시 애니메이션 처리
  const setTableOpen = () => {
    $("#detail").hide()
    $("#insert").show();
    closemodal();    // 모달 팝업창 닫기(false)
    $("#frmadd")[0].reset();
    setDetailData(defaultValue)
    setModal(false);
    setFields(fields2);
    if (userinfo.grade === "3") {
      change4();
    }
    UTIL.writeani('open')
  }

  const insertModal = (_id) => {
    $("#detail").hide()
    $("#insert").show();
    $("#frmadd")[0].reset();
    setModal(false);
    setFields(fields2);
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/id/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data.companyId)
      if (userinfo.grade === "3") {
        change4();
      }
      UTIL.writeani('open')
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });

  }

  const setTableClose = () => {
    closemodal();
    UTIL.writeani('close')
    setFields(fields1);
  }

  const change = (e) => {
    setVendorIdvalue(e.target.value)
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/company/name/" + e.target.value, configHeader).then(result => {
      setCompanyName("[" + result.data.data.companyName + "]");
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });

  }

  const change3 = (e) => {
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
    }

    let companyId = $('#schform [name="companyId"]').val();
    UTIL.writeani('close')
    if (companyId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/select/" + companyId, configHeader).then(result => {
      setData(result.data.data.docs);
      setPages(result.data.data.totalPages);
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change10 = () => {
    let companyId = $('#schform [name="companyId"]').val();

    if (companyId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/select/" + companyId, configHeader).then(result => {
      setData(result.data.data.docs);
      setPages(result.data.data.totalPages);
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }


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

  const sum = () => {
    window.location = "/set/report"
  }

  const toggle = () => {
    let txt = "";
    setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
    if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
    setModal3('충전소 정보를 ' + txt + '하시겠습니까?')
    setModal1(!modal);
  }


  const sample4_execDaumPostcode = () => { //다음 주소 api
    new window.daum.Postcode({
      oncomplete: function (data) {
        var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
        var extraRoadAddr = ''; // 도로명 조합형 주소 변수

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraRoadAddr !== '') {
          extraRoadAddr = ' (' + extraRoadAddr + ')';
        }
        // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
        if (fullRoadAddr !== '') {
          fullRoadAddr += extraRoadAddr;
        }
        AddressData(data.jibunAddress);
        window.self.close();
      }
    }).open();
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
          {warning3}
        </CModalBody>
        <CModalFooter>
          {mode === "save" && <CButton color="primary" onClick={handleClick} >저장 </CButton>}
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
      <CRow>
        <CCol xs="12" lg="12">
          <CRow>
            <MODAL data={warning} fnc={closemodal} mode={mode} handleClick={handleClick}></MODAL>

            <CCard id="listtable2" style={{ width: "100%", position: "relative" }}>
              <CCardHeader>
                충전소 리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>충전소 등록</CButton>
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
                        <CSelect custom name="select" id="companyId" defaultValue={vendorIdvalue} onChange={e => change3(e)} name="companyId">
                          <option value="0"> 운수사 선택 </option>
                          {
                            vendordata.map((item, index) => {

                              return (
                                <option value={item.companyId}>{item.companyName}</option>
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
                        <CInput type="text" id="companyId" maxLength="5" name="companyId" value={userinfo.vendorid} placeholder="" readOnly />
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
                      </CInputGroup>
                    </div>
                  </form>
                }
                <CDataTable
                  items={data}
                  fields={fields}
                  striped
                  sorter
                  itemsPerPage={pagesize}
                  pagination
                  itemsPerPage={GV.vendorTablepagingsize}
                  clickableRows
                  onRowClick={(item) => getDetail(item._id)}
                  scopedSlots={{
                    '충전소(운수사)':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.csName}</CBadge>
                        </td>
                      ),
                    '충전기 수':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="danger" style={{ padding: "5px", fontSize: "13px" }}>{item.csCount.length}개</CBadge>
                        </td>
                      ),
                    '연락처':
                      (item) => (
                        <td>{item.tel}</td>
                      )
                    ,
                    '상태':
                      (item) => (
                        <td>
                          {item.status === 1 && <CBadge className="mr-1" color="success" style={{ padding: "5px", fontSize: "13px" }}>사용중</CBadge>}
                          {item.status === 0 && <CBadge className="mr-1" color="danger" style={{ padding: "5px", fontSize: "13px" }}>미사용</CBadge>}
                        </td>
                      ),
                    '충전이력':
                      (item) => (
                        <td onClick={sum}>
                          바로가기
                        </td>
                      ),

                  }}
                />
              </CCardBody>
            </CCard>


            <CCard id="writefrm" style={{ display: "none", width: "45%", position: "relative" }}>
              <div id="insert" style={{ display: "none" }}>
                <CCardHeader>
                  충전소 정보 입력
                </CCardHeader>
                <CCardBody>
                  <CForm action="" name="frmadd" id="frmadd" method="post">
                    <input type="hidden" name="id" id="id" defaultValue={detaildata._id} />
                    <input type="hidden" name="cpanyName" id="cpanyName" defaultValue={cpanyName} />
                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> * 운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        {userinfo.grade === "0" &&

                          <CSelect custom name="select" id="companyId" value={vendorIdvalue} onChange={e => change(e)} name="companyId" disabled={detaildata.companyId}>
                            <option value="0" disabled={detaildata.companyId}> 운수사 선택 </option>
                            {
                              vendordata.map((item, index) => {

                                return (
                                  <option value={item.companyId}>{item.companyName}</option>
                                )
                              })
                            }
                          </CSelect>
                        }

                        {userinfo.grade === "2" &&

                          <CSelect custom name="select" id="companyId" value={userinfo.vendorid} onChange={e => change(e)} name="companyId" disabled="disabled">
                            <option value="0" disabled="disabled"> 운수사 선택 </option>
                            {
                              vendordata.map((item, index) => {

                                return (
                                  <option value={item.companyId}>{item.companyName}</option>
                                )
                              })
                            }
                          </CSelect>

                        }


                        {userinfo.grade === "3" &&

                          <CSelect custom name="select" id="companyId" value={userinfo.vendorid} onChange={e => change(e)} name="companyId" disabled="disabled">
                            <option value="0" disabled="disabled"> 운수사 선택 </option>
                            {
                              vendordata.map((item, index) => {

                                return (
                                  <option value={item.companyId}>{item.companyName}</option>
                                )
                              })
                            }
                          </CSelect>

                        }
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>* 사업자번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="biznum" name="biznum" defaultValue={detaildata.biznum} placeholder="사업자번호" />

                      </CInputGroup>
                    </CFormGroup>



                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>* 충전소ID</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput id="csIpd" maxLength="4" name="csId" defaultValue={detaildata.csId} placeholder="충전소 아이디(4자리 코드)" readOnly={detaildata.csId} />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>* 충전소명</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput id="csName" name="csName" maxLength="30" placeholder="업체명" defaultValue={detaildata.csName} />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>연락처</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="number" id="tel" name="tel" maxLength="15" defaultValue={detaildata.tel} placeholder="연락처(-를 빼고 입력해주세요)" />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        <CInputGroupPrepend>
                          <CInputGroupText> 상태정보 </CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom id="status" name="status" defaultValue={detaildata.status}>
                          <option value="1"> 사용중 </option>
                          <option value="0"> 미사용 </option>
                          <option value="2"> 등록대기 </option>
                        </CSelect>
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>주소</CInputGroupText>
                        </CInputGroupPrepend>
                        {addressdata == "" && <CInput type="text" id="address" name="address" maxLength="100" defaultValue={detaildata.address} placeholder="주소" readOnly />}
                        {addressdata != "" && <CInput type="text" id="address" name="address" maxLength="100" defaultValue={detaildata.address} value={addressdata} placeholder="주소" readOnly />}
                        <CButton type="button" size="bg" color="success" style={{ width: "100px" }} onClick={sample4_execDaumPostcode}> 조회</CButton>
                      </CInputGroup>
                    </CFormGroup>


                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>상세 주소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="addressdetail" name="addressdetail" maxLength="100" defaultValue={detaildata.addressdetail} placeholder="상세 주소" />

                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>기타</CInputGroupText>
                        </CInputGroupPrepend>
                        <CTextarea
                          name="etcinfo"
                          id="textarea-input"
                          rows="4"
                          placeholder="Content..."
                          defaultValue={detaildata.note}
                        />
                      </CInputGroup>
                    </CFormGroup>



                    <CFormGroup className="form-actions">
                      <CButton type="button" onClick={toggle} size="bg" color="success" style={{ width: "100px" }}> 저장</CButton>
                      <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                    </CFormGroup>

                  </CForm>
                </CCardBody>
              </div>


              <div id="detail" style={{ display: "none" }}>
                <CCardHeader>
                  충전소 상세 보기
                </CCardHeader>
                <CCardBody>
                  <CForm action="" name="frmadd1" id="frmadd1">
                    <input type="hidden" name="id" id="id" defaultValue={detaildata._id} />

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 운수사</CInputGroupText>
                        </CInputGroupPrepend>

                        <CSelect custom name="select" id="companyId" value={vendorIdvalue} name="companyId" disabled="disabled">
                          <option value="0" disabled="disabled"> ::: 선택하세요 :::</option>
                          {
                            vendordata.map((item, index) => {

                              return (
                                <option value={item.companyId}>{item.companyName}</option>
                              )
                            })
                          }
                        </CSelect>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        <CInputGroupPrepend>
                          <CInputGroupText>사업자번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="biznum" name="biznum" defaultValue={detaildata.biznum} placeholder="사업자번호" readOnly />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>충전소아이디</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput id="csIpd" readOnly={!vendorIdreadonly} maxLength="10" name="csId" defaultValue={detaildata.csId} placeholder="충전소 아이디(4자리 코드)" readOnly />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>충전소명</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput id="csName" name="csName" placeholder="업체명" defaultValue={detaildata.csName} readOnly />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>연락처</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="tel" name="tel" maxLength="15" defaultValue={detaildata.tel} placeholder="연락처" readOnly />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>상태정보</CInputGroupText>
                        </CInputGroupPrepend>
                        {detaildata.status === 1 && <CInput value="사용중" readOnly></CInput>}
                        {detaildata.status === 2 && <CInput value="등록대기" readOnly></CInput>}
                        {detaildata.status === 0 && <CInput value="미사용" readOnly></CInput>}

                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>주소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="address" name="address" maxLength="100" defaultValue={detaildata.address} placeholder="주소" readOnly />

                      </CInputGroup>
                    </CFormGroup>


                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>위치</CInputGroupText>
                        </CInputGroupPrepend>
                        <div id='map' style={{
                          width: '740px',
                          height: '400px'
                        }}></div>

                      </CInputGroup>
                    </CFormGroup>


                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>기타</CInputGroupText>
                        </CInputGroupPrepend>
                        <CTextarea
                          name="etcinfo"
                          id="textarea-input"
                          rows="4"
                          placeholder="Content..."
                          defaultValue={detaildata.note}
                          readOnly
                        />
                      </CInputGroup>
                    </CFormGroup>

                  </CForm>


                </CCardBody>

                <CCardHeader>
                  전력 사용량 통계
                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    items={wattage}
                    fields={fields3}
                    striped
                    sorter
                    itemsPerPage={pagesize}
                    pagination
                    clickableRows
                    itemsPerPage={GV.vendorTablepagingsize}
                    scopedSlots={{
                      '사용월':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item._id.year}년{item._id.month}월</CBadge>

                          </td>
                        ),
                      '총 충전횟수':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{item.count}회</CBadge>
                          </td>
                        ),
                      '총 충전시간':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.date / 1000 / 60 / 60).toFixed()}시간</CBadge>

                          </td>
                        ),
                      '충전전력량(kW/h)':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.meter).toFixed(2)}kW/h</CBadge>
                          </td>
                        ),
                      '충전기인입전력량(kW/h)':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.meter).toFixed(2)}kW/h</CBadge>
                          </td>
                        ),
                      '충전요금(원)':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>15000원</CBadge>
                          </td>
                        )



                    }}
                  />
                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={() => insertModal(detaildata._id)} size="bg" color="success" style={{ width: "100px" }}> 수정</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>
                </CCardBody>

              </div>
            </CCard>

          </CRow>

        </CCol>
      </CRow>
    </>
  )
}

export default Vendor