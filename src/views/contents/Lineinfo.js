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
import MODAL from '../modals/Modals';
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';


const defaultValue = [{ _id: "", vendorId: "", line_num: "", line_name: "" }];
const Lineinfo = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '운행도시', _classes: 'Tablefirst' }, { key: '운행정보', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '운행도시', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '운행도시', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [mode, setMode] = useState("alert");
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendordata, setVendorData] = useState([]);
  const [csdata, setCsData] = useState([]);
  const [csdata1, setCsData1] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [csIdvalue, setCsIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [gradevalue, setGradevalue] = useState("");   // 사용자 추가시 권한 설정
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [userinfo] = useState(UTIL.getUserInfo(cookies))

  const [warning3, setModal3] = useState("");
  const [modal, setModal1] = useState(false);
  const [countpage, setCountPage] = useState(25)

  // 라이브 페이징을 위한 정의  END

  useEffect(() => {
    if (userinfo.grade === "0") {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line", configHeader).then(result => {
        setItems(result.data.data.docs.slice(0, 15));
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });
    } else {
      change4();
      change3();
    }
  }, []);


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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line", configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, countpage));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  // 사용자 리스트 호출 함수 
  const getList = () => {
    let listdata = { status: 1, params: pagesize }   // 리스트 출력 기본 세팅값 정의
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line", configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, 15));
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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].companyId)
      setCsIdvalue(result.data.data[0].csId)

      change(result.data.data[0].companyId);
      setFields(fields2);
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
      UTIL.writeani('open')
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  const setTableOpen = () => {
    $("#detail").hide()
    $("#insert").show();
    $("#dateviewbtn").fadeOut();
    setDetailData(defaultValue)
    if (userinfo.grade === "0") {
      setCsIdvalue("")

    }
    closemodal();    // 모달 팝업창 닫기(false)
    $("#frmadd")[0].reset();
    setModal(false);
    setFields(fields2);
    if (userinfo.grade != "0") {
      change4();
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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].companyId);
      setGradevalue(result.data.data[0].grade)
      setFields(fields2);
      setCsIdvalue(result.data.data[0].csId)
      change(result.data.data[0].companyId);

      if (userinfo.grade != "0") {
        change4();
      }
      UTIL.writeani('open')
      // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });

  }




  const change13 = (e) => {
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
        setCsData1(result.data.data)

      }).catch(err => {
        setModal(UTIL.api401chk(err));
      })
    }
  }

  // 소속업체 선택시 소속 충전소 정보 호출하기
  const change = (value) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + value, configHeader).then(result => {
      setCsData1(result.data.data)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  //충전소 선택시 해당 충전소에서 운행중인 라인정보 호출
  const change2 = (e) => {
    setCsIdvalue(e.target.value)
    UTIL.getLineinfo(configHeader, e.target.value, "");

  }    // 벤더사 선택시 state 변경 

  const handleClick = async () => {
    let txt = "";
    let url = "/api/pages/line";

    if ($('#frmadd [name="id"]').val()) {
      txt = "수정";
      url = "/api/pages/line/" + $('#frmadd [name="id"]').val();
    } else {
      txt = "등록";
      url = "/api/pages/line";
    }

    let frmstrroutname = $('#frmadd [name="routename1"]').val();
    let frmstrrouteno = $('#frmadd [name="routeno1"]').val();
    let frmstrcompnayId = $('#frmadd [name="companyId1"]').val();
    let frmstrcsId = $('#frmadd [name="csId1"]').val();
    let frmstrstartnodenm = $('#frmadd [name="startnodenm1"]').val();
    let frmstrendnodenm = $('#frmadd [name="endnodenm1"]').val();
    let frmstrcityname = $('#frmadd [name="cityname1"]').val();

    let sendinfcreate = {
      companyId: frmstrcompnayId,   // 벤더아이디
      csId: frmstrcsId,   // 벤더아이디           
      startnodenm: frmstrstartnodenm,      // 노선 번호
      routeno: frmstrrouteno,   // 노선 명
      routename: frmstrroutname,
      endnodenm: frmstrendnodenm,    // 기타정보
      cityname: frmstrcityname,
      pagesize: GV.vendorTablepagesize
    }

    if (frmstrcompnayId == "0") {
      alert("운수사 정보를 입력해주세요")
      toggle()
      return false
    } else if (frmstrcsId == "0") {
      alert("충전소 정보를 입력해주세요")
      toggle()
      return false
    } else if (frmstrrouteno == "") {
      alert("노선번호를 입력해주세요")
      toggle()
      return false
    } else if (frmstrroutname == "") {
      alert("노선명을 입력해주세요")
      toggle()
      return false
    } else if (frmstrstartnodenm == "") {
      alert("출발지를 입력해주세요")
      toggle()
      return false
    } else if (frmstrendnodenm == "") {
      alert("도착지를 입력해주세요")
      toggle()
      return false
    } else if (frmstrcityname == "") {
      alert("운행시도를 입력해주세요")
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
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/count/" + frmstrrouteno, configHeader).then(result => {
          if (result.data.data === 2) {
            alert("사용중인 노선 번호 입니다")
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
          }
        });
      }
    }
  }


  const delClick = async () => {
    let frmstrrouteno = $('#frmadd [name="routeno"]').val();
    axios.delete(process.env.REACT_APP_APISERVER + "/api/pages/line/" + $('#frmadd [name="id"]').val() + "/" + frmstrrouteno, configHeader).then(result => {

      if (result.data.status === 1) {
        if (userinfo.grade != "0") {
          change4();
          change3();
          setFields(fields1);
          UTIL.writeani('close')
          toggle();
        } else {
          getList();
          setFields(fields1);
          UTIL.writeani('close')
          toggle()
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

  const closemodal = () => {
    setModal(!warning);
  }

  const setTableClose = () => {
    setModal(false);
    setDetailData(defaultValue)
    UTIL.writeani('close')
    setFields(fields1);
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

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/" + csId + "/" + companyId, configHeader).then(result => {
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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/" + csId + "/" + companyId, configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, 15));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change20 = (e) => {
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();

    let listdata = { status: 1, pagesize: pagesize, companyId: companyId, csId: csId }  // 리스트 출력 기본 세팅값 정의
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/" + csId + "/" + companyId, configHeader).then(result => {
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
          <MODAL data={warning} fnc={closemodal} mode={mode} handleClick={handleClick} delClick={delClick}></MODAL>
          <CRow>

            <CCard id="listtable2" style={{ width: "100%", position: "relative", float: "left" }}>
              <CCardHeader>
                노선 리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>노선 등록</CButton>
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
                        <CInput type="text" id="companyId" maxLength="5" name="companyId" value={userinfo.vendorid} placeholder="" readOnly />
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
                  sorter
                  pagination
                  itemsPerPage={pagesize}
                  clickableRows
                  onRowClick={(item) => getDetail(item._id)}
                  scopedSlots={{
                    '운수사':
                      (item) => (

                        <td>

                          {
                            item.cpname.map((item, index) => {
                              return (
                                <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.companyName}</CBadge>
                              )
                            })
                          }

                        </td>

                      ),
                    '충전소':
                      (item) => (
                        <td>
                          {item.csname.length === 0 && <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>등록된 충전소 없음</CBadge>}
                          {
                            item.csname.map((item, index) => {
                              return (
                                <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.csName}</CBadge>
                              )
                            })
                          }
                        </td>
                      ),
                    '노선번호':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.routeno}</CBadge>
                        </td>
                      ),
                    '운행도시':
                      (item) => (
                        <td>{item.cityname}</td>
                      ),
                    '운행정보':
                      (item) => (
                        <td>{item.startnodenm} ~ {item.endnodenm}</td>
                      )
                  }}
                />

              </CCardBody>
            </CCard>


            <CCard id="writefrm" style={{ width: "45%", position: "relative", float: "left", display: "none" }}>
              <div id="detail" style={{ display: "none" }}>
                <CCardHeader>
                  노선 상세 정보
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
                        <CInputGroupText> * 노선번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="routeno" name="routeno" defaultValue={detaildata[0].routeno} readOnly />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>노선명</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="routeno" name="routename" defaultValue={detaildata[0].routename} readOnly />
                    </CInputGroup>
                  </CFormGroup>


                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>  출발지</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="startnodenm" name="startnodenm" defaultValue={detaildata[0].startnodenm} readOnly />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>  도착지</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="endnodenm" name="endnodenm" defaultValue={detaildata[0].endnodenm} readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>  운행시도</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="cityname" name="cityname" defaultValue={detaildata[0].cityname} placeholder="도시이름" readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={() => insertModal(detaildata[0]._id)} size="bg" color="success" style={{ width: "100px" }}> 수정</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>


                </CCardBody>
              </div>



              <div id="insert" style={{ display: "none" }}>
                <CCardHeader>
                  노선 정보 입력
                </CCardHeader>
                <CCardBody>
                  <CForm action="" name="frmadd" id="frmadd" method="post">
                    <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                    {userinfo.grade === "0" &&
                      <CFormGroup>
                        <CInputGroup>
                          <CInputGroupPrepend>
                            <CInputGroupText>*운수사</CInputGroupText>
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
                        <CSelect custom name="csId1" id="csId" value={csIdvalue} onChange={e => change2(e)} disabled={detaildata[0].csId}>
                          <option value="0" disabled={detaildata[0].csId}>::: 선택하세요::: </option>
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
                          <CInputGroupText>*노선번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="number" id="routeno" name="routeno1" defaultValue={detaildata[0].routeno} readOnly={detaildata[0].routeno} />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*노선명</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="routeno" name="routename1" defaultValue={detaildata[0].routename} />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>*출발지</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="startnodenm" name="startnodenm1" defaultValue={detaildata[0].startnodenm} />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*도착지</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="endnodenm" name="endnodenm1" defaultValue={detaildata[0].endnodenm} />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>*운행시도</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="cityname" name="cityname1" defaultValue={detaildata[0].cityname} placeholder="도시이름" />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup className="form-actions">
                      <CButton type="button" onClick={toggle} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
                      &nbsp;&nbsp;&nbsp;&nbsp;
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

export default Lineinfo