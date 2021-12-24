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
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';
import Moment from 'react-moment'

const defaultValue = [{ _id: "", vendorId: "", line_num: "", line_name: "" }];
const Businfo = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  var fields1 = [{ key: '소속 운수사', _classes: 'Tablefirst' }, { key: '충전소(차고지)', _classes: 'Tablefirst' }, { key: '차량번호', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '카드번호', _classes: 'Tablefirst' }, { key: '배터리 용량', _classes: 'Tablefirst' }, { key: '제조사', _classes: 'Tablefirst' }, { key: '운행시작일자', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '차량번호', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '차량번호', _classes: 'Tablefirst' }, { key: '소속 운수사', _classes: 'Tablefirst' }, { key: '충전소(차고지)', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '차량번호', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });
  const [warning3, setModal3] = useState("");
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [mode, setMode] = useState("alert");
  const [csdata1, setCsData1] = useState([]);
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendordata, setVendorData] = useState([]);
  const [csIdvalue, setCsIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설
  const [csIdvalue1, setCsIdvalue1] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [csdata, setCsData] = useState([]);
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(5);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [tableFilterValue, setTableFilterValue] = useState("");
  const [sorterValue, setSorterValue] = useState();
  const [linedata, setLineData] = useState(defaultValue);
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  const [modal, setModal1] = useState(false);
  const [countpage, setCountPage] = useState(25)



  useEffect(() => {
    getList()
  }, []);


  const getList = () => {
    if (userinfo.grade === "0") {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus", configHeader).then(result => {
        setItems(result.data.data.docs.slice(0, 15));
        setPages(result.data.data.totalPages);
        setLoading(false);
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });
    } else {
      change4();
      change3();
    }
  }



  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();
    if (scrollTop + clientHeight >= scrollHeight) {
      if (userinfo.grade === "0") {
        if (companyId === "0" && csId === "0") {
          setCountPage(countpage + 10)
          getList12()
        } else {
          setCountPage(countpage + 10)
          change20();
        }
      } else {
        setCountPage(countpage + 10)
        change4();
        change20();
      }
    }
  };


  useEffect(() => {
    // scroll event listener 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  });



  const getList12 = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus", configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, countpage));
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
  const getDetail = (_id) => {
    $("#insert").hide()
    $("#detail").show()
    $("#frmadd")[0].reset();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].companyId)
      setCsIdvalue(result.data.data[0].csId)
      setCsIdvalue1(result.data.data[0].csId)
      change(result.data.data[0].companyId);
      setFields(fields2);
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/routeno/" + result.data.data[0].routeno + "/" + "0", configHeader).then(result => {

        if (result.data.data.length !== 0) {
          setLineData(result.data.data)
        }

      })
      UTIL.writeani('open')
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }





  const handleClick = async () => {

    let txt = "";
    let url = "/api/pages/bus";

    if ($('#frmadd [name="id"]').val()) {
      txt = "수정";
      url = "/api/pages/bus/" + $('#frmadd [name="id"]').val();
    } else {
      txt = "등록";
      url = "/api/pages/bus";
    }


    let frmstrrouteno = $('#frmadd [name="routeno"]').val();
    let frmstrcompanyId = $('#frmadd [name="companyId1"]').val();
    let frmstrcsId = $('#frmadd [name="csId1"]').val();
    let frmstrvehicleId = $('#frmadd [name="vehicleId1"]').val();
    let frmstridTag = $('#frmadd [name="idTag1"]').val();
    let frmstrbaeteoli = $('#frmadd [name="baeteoli1"]').val();
    let frmstrmanufacturerg = $('#frmadd [name="manufacturer1"]').val();
    let frmstrracestart = $('#frmadd [name="racestart1"]').val();

    let sendinfcreate = {}

    if (frmstrrouteno || frmstridTag) {
      frmstrrouteno = $('#frmadd [name="routeno"]').val()
      frmstridTag = $('#frmadd [name="idTag1"]').val()
    } else {
      frmstrrouteno = ""
      frmstridTag = ""
    }

    sendinfcreate = {
      companyId: frmstrcompanyId,
      routeno: frmstrrouteno,
      csId: frmstrcsId,
      vehicleId: frmstrvehicleId,
      idTag: frmstridTag,
      baeteoli: frmstrbaeteoli,
      manufacturer: frmstrmanufacturerg,
      racestart: frmstrracestart,
      pagesize: GV.vendorTablepagesize
    }

    if (frmstrcompanyId == "0") {
      alert("운수사 정보를 입력해주세요")
      toggle()
      return false
    } else if (frmstrcsId == "0") {
      alert("충전소 정보를 입력해주세요")
      toggle()
      return false
    } else if (frmstrvehicleId == "") {
      alert("차량번호를 입력해주세요")
      toggle()
      return false
    } else if (frmstrmanufacturerg == "") {
      alert("제조사를 입력해주세요")
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
                change15();
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
            } else {
              $("#txtmsg").text("등록실패")
            }

          }
        }).catch(err => {
          setModal(UTIL.api401chk(err));
        })
      } else {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus/count/" + frmstrvehicleId, configHeader).then(result => {
          if (result.data.data === 2) {
            alert("사용중인 버스 번호 입니다")
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
                    change15();
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
                  //setErrmsg(result.data.errmsg[0].msg)
                } else {
                  $("#txtmsg").text("등록실패")
                }

              }
            }).catch(err => {
              setModal(UTIL.api401chk(err));
            })
          }
        });
      }
    }
  }
  const delClick = async () => {
    let frmstrvehicleId12 = $('#frmadd [name="vehicleId1"]').val();
    axios.delete(process.env.REACT_APP_APISERVER + "/api/pages/bus/" + $('#frmadd [name="id"]').val() + "/" + frmstrvehicleId12, configHeader).then(result => {
      if (result.data.status === 1) {
        getList();
        setFields(fields1);
        UTIL.writeani('close')
        toggle()
        $("#frmadd input").val("");
        $("#dateview").fadeOut();
        $("#dateviewbtn").fadeOut();
      } else {
        if (result.data.status === 9) {
          $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
        } else {
          $("#txtmsg").text("등록실패")
        }

      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }


  const toggle = () => {
    let txt = "";
    setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
    if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
    setModal3('버스 정보를 ' + txt + '하시겠습니까?')
    setModal1(!modal);
  }


  const deltoggle = () => {
    let txt = "삭제";
    setMode('del');
    setModal3('버스 정보를 ' + txt + '하시겠습니까?')
    setModal1(!modal);
  }


  // 입력폼 표시 애니메이션 처리
  const setTableOpen = () => {
    $("#detail").hide()
    $("#insert").show();
    $("#dateviewbtn").fadeOut();
    $("#frmadd")[0].reset();
    setDetailData(defaultValue)
    if (userinfo.grade === "0") {
      setCsIdvalue1("")
      setCsIdvalue("")

    }
    setModal(false);
    setFields(fields2);
    let csId1 = $('#schform [name="csId"]').val();
    if (csId1) {
      UTIL.getCardinfo(configHeader, csId1, "");
      UTIL.getLineinfo(configHeader, csId1, "");
    }
    if (userinfo.grade === "3") {
      let csId = $('#frmadd [name="csId1"]').val();
      change4();
      UTIL.getCardinfo(configHeader, csId, "");
      UTIL.getLineinfo(configHeader, csId, "");

    }
    UTIL.writeani('open')
  }

  const insertModal = (_id) => {
    $("#detail").hide()
    $("#insert").show();
    $("#dateviewbtn").show();
    $("#frmadd")[0].reset();
    setModal(false);
    setFields(fields2);

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].companyId)
      setCsIdvalue(result.data.data[0].csId)
      setCsIdvalue1(result.data.data[0].csId)

      setFields(fields2);
      UTIL.getLineinfo(configHeader, result.data.data[0].csId, "");
      UTIL.getCardinfo(configHeader, result.data.data[0].csId, result.data.data[0].idTag, "");
      $("#routeno").hide();

      UTIL.getLineinfono(configHeader, result.data.data[0].routeno, "");

      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
      if (userinfo.grade === "3") {
        change4();
        let csId = $('#frmadd [name="csId1"]').val();
        UTIL.getLineinfo(configHeader, csId, "");
        UTIL.getCardinfo(configHeader, csId, "");
      }
      UTIL.writeani('open')
      change(result.data.data[0].companyId);
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  // 입력폼 닫기 애니메이션 처리
  const setTableClose = () => {
    setModal(false);
    setDetailData(defaultValue)
    UTIL.writeani('close')
    if (userinfo.grade != "0") {
      change4();
    }
    setFields(fields1);
  }

  // 소속업체 선택시 소속 충전소 정보 호출하기
  const change = (value) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + value, configHeader).then(result => {

      setCsData1(result.data.data)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change13 = (e) => {
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
      let listdata = { status: 1, pagesize: pagesize, companyId: e.target.value }  // 리스트 출력 기본 세팅값 정의
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
        setCsData1(result.data.data)

      }).catch(err => {
        setModal(UTIL.api401chk(err));
      })
    }
  }

  const change4 = (e) => {
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
        setCsData(result.data.data)
        change3(e);
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      })
    } else if (userinfo.grade === "2") {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + userinfo.vendorid, configHeader).then(result => {
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
  //충전소 선택시 해당 충전소에서 운행중인 라인정보 호출
  const change2 = (e) => {
    setCsIdvalue(e.target.value)
    setCsIdvalue1(e.target.value)
    UTIL.getLineinfo(configHeader, e.target.value, "");
    UTIL.getCardinfo(configHeader, e.target.value, "");
    $("#routeno").hide();

  }    // 벤더사 선택시 state 변경 


  const change15 = () => {
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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus/" + csId + "/" + companyId, configHeader).then(result => {
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
    UTIL.writeani('close')
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus/" + csId + "/" + companyId, configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, 15));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change20 = (e) => {
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/bus/" + csId + "/" + companyId, configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, countpage));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
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
          {mode === "del" && <CButton color="primary" onClick={delClick} >삭제 </CButton>}
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol>
          <CRow>

            <CCard id="listtable2" style={{ width: "100%", position: "relative", float: "left" }}>
              <CCardHeader>
                버스 리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>버스 등록</CButton>
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
                        <CSelect custom name="select" id="companyId" defaultValue={vendorIdvalue} onChange={e => change4(e)} name="companyId" >
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
                        <CInput type="text" id="companyId" maxLength="20" name="companyId" value={userinfo.vendorid} placeholder="" readOnly />
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
                <CDataTable
                  items={items}
                  fields={fields}
                  striped
                  tableFilterValue={tableFilterValue}
                  onTableFilterChange={setTableFilterValue}
                  sorter
                  sorterValue={sorterValue}
                  onSorterValueChange={setSorterValue}
                  onPaginationChange={setItemsPerPage}
                  onRowClick={(item) => getDetail(item._id)}
                  scopedSlots={{
                    '소속 운수사':
                      (item) => (
                        <td>
                          {
                            item.companyname.map((item, index) => {
                              return (
                                <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.companyName}</CBadge>
                              )
                            })
                          }
                        </td>
                      ),
                    '충전소(차고지)':
                      (item) => (
                        <td>
                          {
                            item.csname.map((item, index) => {
                              return (
                                <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.csName}</CBadge>
                              )
                            })
                          }
                        </td>
                      ),
                    '차량번호':
                      (item) => (
                        <td >
                          <CBadge className="mr-1" size="large" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.vehicleId}</CBadge>
                        </td>
                      ),
                    '노선번호':
                      (item) => (
                        <td>
                          {item.routeno == "" && <CBadge className="mr-1" size="large" color="danger" style={{ padding: "5px", fontSize: "13px" }}>등록된 노선 없음</CBadge>}
                          {item.routeno != "" && <CBadge className="mr-1" size="large" color="success" style={{ padding: "5px", fontSize: "13px" }}>{item.routeno}</CBadge>}
                        </td>
                      ),
                    '카드번호':
                      (item) => (
                        <td>
                          {item.idTag == "" && <CBadge className="mr-1" size="large" color="danger" style={{ padding: "5px", fontSize: "13px" }}>등록된 카드없음</CBadge>}
                          {item.idTag != "" && <CBadge className="mr-1" size="large" color="success" style={{ padding: "5px", fontSize: "13px" }}>{item.idTag}</CBadge>}
                        </td>
                      ),

                    '배터리 용량':
                      (item) => (
                        <td>{item.baeteoli}</td>
                      ),
                    '제조사':
                      (item) => (
                        <td>{item.manufacturer}</td>
                      ),
                    '운행시작일자':
                      (item) => (
                        <td><Moment local format="YYYY-MM-DD  HH:mm">{item.racestart}</Moment></td>
                      ),
                  }}
                />

              </CCardBody>
            </CCard>


            <CCard id="writefrm" style={{ width: "45%", position: "relative", float: "left", display: "none" }}>
              <div id="detail" style={{ display: "none" }}>
                <CCardHeader>
                  버스 상세 정보
                </CCardHeader>
                <CCardBody>

                  <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 운수사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="select" id="companyId" value={detaildata[0].companyId} onChange={e => change(e)} name="companyId" disabled="disabled">
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
                      <CSelect custom name="csId" id="csId" value={detaildata[0].csId} onChange={e => change2(e)} disabled="disabled">
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
                        <CInputGroupText>노선번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="routeno1" name="routeno1" defaultValue={detaildata[0].routeno} readOnly />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>차량번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="vehicleId" name="vehicleId" defaultValue={detaildata[0].vehicleId} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>카드번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="idTag" name="idTag" defaultValue={detaildata[0].idTag} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>배터리 용량</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="baeteoli" name="baeteoli" defaultValue={detaildata[0].baeteoli} readOnly />
                      &nbsp;  &nbsp;  &nbsp;  &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>제조사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="manufacturer" name="manufacturer" defaultValue={detaildata[0].manufacturer} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>출발지</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="manufacturer" name="manufacturer" defaultValue={linedata[0].startnodenm} readOnly />
                      &nbsp;  &nbsp;  &nbsp;  &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>도착지</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="manufacturer" name="manufacturer" defaultValue={linedata[0].endnodenm} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>운행 시도</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="manufacturer" name="manufacturer" defaultValue={linedata[0].cityname} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>운행 시작일</CInputGroupText>
                      </CInputGroupPrepend>
                      <Moment local format="YYYY-MM-DD"><CInput type="date" id="racestart" name="racestart" defaultValue={detaildata[0].racestart} readOnly /></Moment>
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={() => insertModal(detaildata[0]._id)} size="bg" color="success" style={{ width: "100px" }}>수정</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>


                </CCardBody>
              </div>

              <div id="insert" style={{ display: "none" }}>
                <CCardHeader>
                  버스 정보 입력
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
                          &nbsp; &nbsp; &nbsp;
                          <CInputGroupPrepend>
                            <CInputGroupText> *충전소</CInputGroupText>
                          </CInputGroupPrepend>
                          <CSelect custom name="csId1" id="csId" value={csIdvalue} onChange={e => change2(e)} disabled={detaildata[0].csId}>
                            <option value="0" disabled={detaildata[0].csId}>::: 선택하세요::: </option>
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
                        <CSelect custom name="csId1" id="csId" value={csIdvalue} onChange={e => change2(e)}>
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
                        <CSelect custom name="csId1" id="csId" value={userinfo.csid} disabled="disabled">
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
                    <br />

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>노선번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <div id="lineinfosel" style={{ display: "flex", width: "250px" }}>{detaildata[0].routeno}</div>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*차량번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="vehicleId1" name="vehicleId1" defaultValue={detaildata[0].vehicleId} />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>카드번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <div id="cardlist" style={{ display: "flex", width: "250px" }}>{detaildata[0].idTag}</div>
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>배터리 용량</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="baeteoli1" name="baeteoli1" defaultValue={detaildata[0].baeteoli} />
                        &nbsp;  &nbsp;  &nbsp;  &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*제조사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="manufacturer1" name="manufacturer1" defaultValue={detaildata[0].manufacturer} />
                      </CInputGroup>
                    </CFormGroup>


                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>운행 시작일</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="date" id="racestart1" name="racestart1" defaultValue={detaildata[0].racestart} />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup className="form-actions">
                      <CButton type="button" onClick={toggle} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
                      &nbsp; &nbsp; &nbsp;
                      <CButton id="dateviewbtn" style={{ display: "none" }} type="button" onClick={deltoggle} size="bg" color="danger" style={{ width: "100px" }}>삭제</CButton>
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

export default Businfo