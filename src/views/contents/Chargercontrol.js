import React, { useState, useEffect, useRef } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
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
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';

const Chargerinfo = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  var fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '충전기 정보', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '모델명', _classes: 'Tablefirst' }, { key: '충전기 제조사', _classes: 'Tablefirst' }, { key: '충전기 상태 설정', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '아이디', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '충전건개수', _classes: 'Tablefirst' }, { key: '충전기 제조사', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '충전기 정보', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '아이디', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '충전건개수', _classes: 'Tablefirst' }, { key: '충전기 제조사', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.chargerTablepagesize);
  const [fields, setFields] = useState(fields1)
  const socketUrl = process.env.REACT_APP_WSSERVER;   // 웹소켓 서버 연결 설정
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [vendordata, setVendorData] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csdata, setCsData] = useState([]);  // 소속업체 정의
  const [csIdvalue, setCsIdvalue] = useState("");
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  const [countpage, setCountPage] = useState(25)


  useEffect(() => {
    if (userinfo.grade != "0") {
      ChargerStationList();
      chargerSelect();
    } else {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + "0" + "/" + "0", configHeader).then(result => {
        if (result) {
          setItems(result.data.data.docs.slice(0, 15));
        }
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });
    }
  }, []);

  //무한 스크롤
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
          scrollList()
        } else {
          setCountPage(countpage + 10)
          scrollListSelect();
        }
      } else {
        setCountPage(countpage + 10)
        ChargerStationList();
        scrollListSelect();
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


  // 사용자 리스트 호출 함수 
  const scrollList = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + "0" + "/" + "0", configHeader).then(result => {
      if (result) {
        setItems(result.data.data.docs.slice(0, countpage));

      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  //d운수사 리스트
  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      setVendorData(result.data.data.docs)
    }).catch(err => {
      //UTIL.api401chk(err);
      setModal(UTIL.api401chk(err))
    })
  }, [])



  // const goWs = () => {
  //   let socket = new WebSocket(process.env.REACT_APP_WSSERVER + "/ocpp/PMGROW-ADM-102");
  //   socket.onopen = function () {
  //     ("connection server");
  //     sendMsg()
  //   };

  //   socket.onmessage = function (e) {
  //     const data = JSON.parse(e.data);

  //   };

  //   const sendMsg = () => {
  //     socket.send(
  //       JSON.stringify({
  //         admintype: "adminsend",
  //         clientid: "CSTL-P480-100",
  //         msg: [3, 12123132, "GetConfiguration", { "key": ["currentlimit"] }]
  //       })
  //     );
  //   };

  //   socket.onclose = function (event) {
  //     if (event.wasClean) {
  //       console.log("[close] 커넥션 종료됨");
  //     } else {
  //       console.log("[close] 커넥션 error");
  //     }
  //   };
  // }


  //벤더,모니터 권한 유저 충전소 select
  const ChargerStationList = (e) => {
    let csId = $('#schform [name="csId"]').val();
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
        setCsData(result.data.data)
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + e.target.value + "/" + csId, configHeader).then(result => {
          setItems(result.data.data.docs.slice(0, 15));
          setLoading(false);
        }).catch(err => {
          setModal(UTIL.api401chk(err));
        })
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      })
    } else {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + userinfo.vendorid, configHeader).then(result => {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + userinfo.vendorid + "/" + csId, configHeader).then(result => {
          setItems(result.data.data.docs.slice(0, 15));
          setLoading(false);
        }).catch(err => {
          setModal(UTIL.api401chk(err));
        })
        setCsData(result.data.data)

      }).catch(err => {
        setModal(UTIL.api401chk(err));
      })
    }
  }

  const updateControl = (value, pid, status, id) => {
    let connType = $(`#schform12 [name='csgun${status}']`).val();
    const connecdata = { pid: pid, conId: value, connType: connType, id: id }
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargeravailability", connecdata, configHeader).then(result => {
      if (result.data.status === 1) {
        alert("상태 변경 완료")
      } else {
        alert("상태 변경 실패")
      }

    })
  }

  //충전기 검색 기능
  const chargerSelect = (e) => {
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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + companyId + "/" + csId, configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, 15));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }


  //검색한 상태에서 무한 스크롤
  const scrollListSelect = (e) => {
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + companyId + "/" + csId, configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, countpage));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }



  // -----------------------------충전기 제어 영역-------------------------------------------

  // let listdata = { pid: pid, resetType : resetType }
  // axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargerreset", listdata, configHeader).then(result => {
  // }).catch(err => {
  //   setModal(UTIL.api401chk(err));
  // })


  // let listdata = { pid: pid, conId: conId, connType: connType }  
  // axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargeravailability", listdata, configHeader).then(result => {

  // }).catch(err => {
  //   setModal(UTIL.api401chk(err));
  // })


  // let listdata = { pid: pid } 
  // axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargercacheclear", listdata, configHeader).then(result => {

  // }).catch(err => {
  //   setModal(UTIL.api401chk(err));
  // })


  // let listdata = { pid: pid, vendorId: vendorId, messageId: messageId, transferData: transferData }  // 리스트 출력 기본 세팅값 정의
  // axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargerdatatransfer", listdata, configHeader).then(result => {

  // }).catch(err => {
  //   setModal(UTIL.api401chk(err));
  // })


  // let listdata = { pid: pid, idTag : idTag }  // 리스트 출력 기본 세팅값 정의
  // axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/remotestarttrasaction", listdata, configHeader).then(result => {

  // }).catch(err => {
  //   setModal(UTIL.api401chk(err));
  // })


  // let listdata = { pid: pid, transactionId: transactionId }  // 리스트 출력 기본 세팅값 정의
  // axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/remotestoptrasaction", listdata, configHeader).then(result => {

  // }).catch(err => {
  //   setModal(UTIL.api401chk(err));
  // })


  // let listdata = { pid: pid, connId: connId }  // 리스트 출력 기본 세팅값 정의
  // axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargerunlockconnector", listdata, configHeader).then(result => {

  // }).catch(err => {
  //   setModal(UTIL.api401chk(err));
  // })

  return (
    <>
      <CRow>
        <CCol>

          <CRow>

            <CCard id="listtable2" style={{ width: "100%", position: "relative", verticalAlign: "middle" }}>
              <CCardHeader>
                충전기 제어
              </CCardHeader>
              <CCardBody style={{ textAlign: "center", verticalAlign: "middle" }}>
                {userinfo.grade === "0" &&
                  <form name="schform" id="schform" metghod="post">
                    <div style={{ paddingBottom: "5px", float: "left" }}>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="companyId" defaultValue={vendorIdvalue} onChange={e => ChargerStationList(e)} name="companyId" >
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
                        <CSelect custom name="csId" id="csId" defaultValue={csIdvalue} onChange={e => chargerSelect(e)}>
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
                        <CSelect custom name="csId" id="csId" defaultValue={csIdvalue} onChange={e => chargerSelect(e)}>
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

                <form name="schform12" id="schform12" metghod="post">
                  <CDataTable
                    items={items}
                    fields={fields}
                    striped
                    sorter
                    pagination
                    itemsPerPage={pagesize}
                    clickableRows

                    scopedSlots={{
                      '운수사':
                        (item) => (
                          <td style={{ verticalAlign: "middle" }}>
                            {
                              item.companyname.map((item, index) => {
                                return (
                                  <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{item.companyName}</CBadge>
                                )
                              })
                            }
                          </td>
                        ),
                      '충전소':
                        (item) => (
                          <td style={{ verticalAlign: "middle" }}>
                            {
                              item.csname.map((item, index) => {
                                return (
                                  <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{item.csName}

                                  </CBadge>
                                )
                              })
                            }
                          </td>
                        ),
                      '충전기 정보':
                        (item) => (
                          <td style={{ verticalAlign: "middle" }}>
                            <img width="80px" src="/charger.png"></img>
                            <div>
                              <CBadge className="mr-1" color="" style={{ fontSize: "14px" }}>충전소 :{item.csId}</CBadge>/
                              <CBadge className="mr-1" color="" style={{ fontSize: "14px" }}>충전건 개수:{item.connectorNo}</CBadge>
                            </div>
                          </td>
                        ),
                      '상태':
                        (item) => (
                          <td style={{ verticalAlign: "middle" }}>
                            {item.status === "Disconnected" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>접속 끊김</CBadge>}
                            {item.status === "Available" && <img width="100px" src="/mo_img2.png" alt="" />}
                            {item.status === "Preparing" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전대기중</CBadge>}
                            {item.status === "Charging" && <img width="100px" src="/mo_img1.gif" alt="" />}
                            {item.status === "Finishing" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>고장</CBadge>}
                            {item.status === "SuspendedEVSE" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>허용하지 않는 상태</CBadge>}
                            {item.status === "SuspendedEV" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전 전력 못받음</CBadge>}
                            {item.status === "Reserved" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전예약 명령 이미 있음</CBadge>}
                            {item.status === "Unavailable" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>커넥터 사용할수 없음</CBadge>}
                            {item.status === "Faulted" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>오류로 충전이 불가능</CBadge>}
                            {item.status === "Stop" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>사용안함</CBadge>}
                            {item.status === "Delete" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>삭제</CBadge>}

                          </td>
                        ),

                      '모델명':
                        (item) => (
                          <td style={{ verticalAlign: "middle" }}>{item.modelNo}</td>
                        ),
                      '충전기 제조사':
                        (item) => (
                          <td style={{ verticalAlign: "middle" }}>{item.manufacturer}</td>
                        ),

                      '충전기 상태 설정':
                        (item) => (
                          <td style={{ verticalAlign: "middle" }}>
                            {
                              item.connectorId.map((item1, index) => {
                                return (
                                  <><CInputGroup>
                                    <CInputGroupPrepend>
                                      <CInputGroupText> 플러그 {index}</CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CSelect custom name={`csgun${index}`} id={`csgun${index}`} defaultValue={item1.status}>
                                      <option value="Inoperative">운영중지 </option>
                                      <option value="Operative">운영중</option>
                                    </CSelect>
                                    &nbsp;&nbsp;
                                    <CButton onClick={() => updateControl(item1.value, item.pid, index, item._id)} size="bg" color="success" style={{ width: "100px" }}>전송</CButton>
                                  </CInputGroup><br /></>

                                )
                              })
                            }

                            <CInputGroup>
                              <CInputGroupPrepend>
                                <CInputGroupText> RESET</CInputGroupText>
                              </CInputGroupPrepend>
                              <CSelect custom name="csId" id="csId" defaultValue={csIdvalue} onChange={e => chargerSelect(e)}>
                                <option value="0" >충전기 </option>
                              </CSelect>
                              &nbsp;&nbsp;
                              <CButton size="bg" color="success" style={{ width: "100px" }}>전송</CButton>
                            </CInputGroup>
                          </td>
                        )
                    }}
                  />
                </form>
              </CCardBody>
            </CCard>
          </CRow>
        </CCol>

      </CRow>
    </>
  )
}

export default Chargerinfo