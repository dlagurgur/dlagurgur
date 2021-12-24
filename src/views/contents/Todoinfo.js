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
  CInputRadio,
  CLabel
} from '@coreui/react'
import $, { post } from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import MODAL from '../modals/Modals';
import GV from '../../globalSet'



const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
const fields1 = [{ key: '충전소명', _classes: 'Tablefirst' }, { key: '충전소아이디', _classes: 'Tablefirst' }, { key: '등록 충전기', _classes: 'Tablefirst' }, { key: '연락처', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '주소', _classes: 'Tablefirst' }, { key: '충전이력', _classes: 'Tablefirst' }]
const fields2 = [{ key: '충전소명', _classes: 'Tablefirst' }, { key: '충전소아이디', _classes: 'Tablefirst' }, { key: '등록 충전기', _classes: 'Tablefirst' }, { key: '연락처', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '주소', _classes: 'Tablefirst' }, { key: '충전이력', _classes: 'Tablefirst' }]
const defaultValue = [{ _id: "", name_kr: "", tel_number: "", address_detail: "", biznum: "", vendorId: "", status: 1 }];
const Vendor = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [cardsize, setCardSize] = useState(12);
  const [fields, setFields] = useState(fields1)
  const [mode, setMode] = useState("alert");
  const [vendordata, setVendorData] = useState([]);
  const [cpanyName, setCompanyName] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const [data, setData] = useState([]);
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendorIdreadonly, setVRO] = useState(false)

  useEffect(() => {
    getList();
  }, []);

  //운수사 리스트
  useEffect(() => {
    let listdata = { status: 1, pagesize: pagesize }  // 리스트 출력 기본 세팅값 정의 
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages/comapny", listdata, configHeader).then(result => {
      setVendorData(result.data.data)
    }).catch(err => {

      setModal(UTIL.api401chk(err));
    })
  }, [])

  // 충전소 리스트 호출 함수 
  const getList = () => {
    let listdata = { status: "all", pagesize: pagesize }  // 리스트 출력 기본 세팅값 정의 
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages_cp/cslist", listdata, configHeader).then(result => {
      setData(result.data.data)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  // 운수사 상세정보 호출 함수
  const getDetail = (_id) => {
    closemodal();
    setVRO(false);
    $("#frmadd")[0].reset();
    let listdata = { _id: _id }
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages_cp/csdetail", listdata, configHeader).then(result => {
      setDetailData(result.data.data);
      setFields(fields2);
      setVendorIdvalue(result.data.data.companyId)
      UTIL.writeani('open')
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  const handleClick = async () => {
    let txt = "";
    let url = "/api/pages_cp/chargingstations";

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
    let frmstrcsCount = $('#frmadd [name="csCount"]').val();
    let frmstrtel = $('#frmadd [name="tel"]').val();
    let frmstraddress = $('#frmadd [name="address"]').val();
    let frmstrbiznum = $('#frmadd [name="biznum"]').val();
    let frmstrnote = $('#frmadd [name="etcinfo"]').val();
    let frmstatus = $("input[name='status']:checked").val();
    let sendinfcreate = {
      companyId: frmstrcompanyId,
      csId: frmstrcsId,
      csCount: frmstrcsCount,
      csName: frmstrcsName,
      tel: frmstrtel,
      address: frmstraddress,
      biznum: frmstrbiznum,
      note: frmstrnote,
      deleted: frmstatus,
      pagesize: GV.vendorTablepagesize
    }

    if (txt === "수정") {
      axios.put(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
        if (result.data.status === 1) {
          getList();
          closemodal();
          //$("#frmadd input").val("");  // 입력박스  Reset
          //$("#listtable2").animate({left:"-10px"},300, function() {$("#listtable2").animate({left:"10px"},100) })
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
      axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
        if (result.data.status === 1) {
          getList();
          closemodal();
          //$("#frmadd input").val("");  // 입력박스  Reset
          //$("#listtable2").animate({left:"-10px"},300, function() {$("#listtable2").animate({left:"10px"},100) })
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


  }

  const openmodal = () => {
    let txt = "";
    let url = "";
    setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
    if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
    setModal(UTIL.modalopen('충전소 정보를 ' + txt + '하시겠습니까?', 'danger'))
  }

  const closemodal = () => {
    setModal(false);
  }
  // 입력폼 표시 애니메이션 처리
  const setTableOpen = () => {
    closemodal();    // 모달 팝업창 닫기(false)
    setVRO(true);   // 벤더코드 ReadOnly 해제
    setDetailData(defaultValue);  // 수정시 input box 노출되어있던 데이터를 reset
    setFields(fields2);    // 리스트 필드 설정 (필드를 하나 숨긴다.)
    UTIL.writeani('open')  // 입력폼 애니메이션 시작
  }
  // 입력폼 닫기 애니메이션 처리
  const setTableClose = () => {
    closemodal();     //모달 팝업창 닫기
    UTIL.writeani('close')
    setFields(fields1);
  }

  const sum = () => {
    window.location = "/login"
  }

  const change = (e) => {
    setVendorIdvalue(e.target.value)
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages/cpanyname", { companyId: e.target.value }, configHeader).then(result => {

      setCompanyName("[" + result.data.data.companyName + "]");
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });

  }    // 벤더사 선택시 state 변경 
  return (
    <>
      <CRow>
        <CCol>
          <CRow>
            <MODAL data={warning} fnc={closemodal} mode={mode} handleClick={handleClick}></MODAL>
            <CCard id="listtable2" style={{ width: "100%" }}>
              <CCardHeader>
                충전소 리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>충전소 등록</CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={data}
                  fields={fields}
                  striped
                  sorter
                  itemsPerPage={pagesize}
                  pagination
                  itemsPerPage={GV.vendorTablepagingsize}
                  onRowClick={(item) => getDetail(item._id)}
                  scopedSlots={{
                    '충전소명':
                      (item) => (
                        <td >
                          {/* {item.status === 1 && <CBadge className="mr-1" color="primary" style={{padding:"5px",fontSize:"13px"}}>{item.name_kr}</CBadge> }
                      {item.status === 0 && <CBadge className="mr-1" color="dark" style={{padding:"5px",fontSize:"13px"}}>{item.name_kr}</CBadge> } */}
                          {item.csName}
                        </td>
                      ),
                    '충전소아이디':
                      (item) => (
                        <td>
                          {item.deleted === 1 && <CBadge className="mr-1" color="info" style={{ padding: "5px", fontSize: "13px" }}>{item.csId}</CBadge>}
                          {item.deleted === 0 && <CBadge className="mr-1" color="dark" style={{ padding: "5px", fontSize: "13px" }}>{item.csId}</CBadge>}
                        </td>
                      ),
                    '등록 충전기':
                      (item) => (
                        <td>
                          {item.csCount != null && <CBadge className="mr-1" color="warning" style={{ padding: "5px", fontSize: "13px" }}>{item.csCount}기</CBadge>}
                          {item.csCount == null && <CBadge className="mr-1" color="warning" style={{ padding: "5px", fontSize: "13px" }}>0기</CBadge>}
                        </td>
                      ),
                    '연락처':
                      (item) => (
                        <td>{item.tel}</td>
                      )
                    ,
                    '주소':
                      (item) => (
                        <td>{item.address}</td>
                      ),
                    '상태':
                      (item) => (
                        <td>
                          {item.deleted === 1 && <CBadge className="mr-1" color="warning" style={{ padding: "5px", fontSize: "13px" }}>사용중</CBadge>}
                          {item.deleted === 0 && <CBadge className="mr-1" color="dark" style={{ padding: "5px", fontSize: "13px" }}>미사용</CBadge>}
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


            <CCard id="writefrm" style={{ display: "none", width: "95%" }}>
              <CCardHeader>
                충전소 상세 보기 및 정보 입력
              </CCardHeader>
              <CCardBody>
                <CForm action="" name="frmadd" id="frmadd" method="post">
                  <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> * 소속운수사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="select" id="companyId" value={vendorIdvalue} onChange={e => change(e)} name="companyId">
                        <option value="0"> ::: 선택하세요 :::</option>
                        {
                          vendordata.map((item, index) => {

                            return (
                              <option value={item.companyId}>{item.companyName},{item.companyId}</option>
                            )
                          })
                        }

                      </CSelect>
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>충전소명</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput id="csName" name="csName" maxLength="30" placeholder="업체명" defaultValue={detaildata[0].csName} />


                      <input type="hidden" name="cpanyName" id="cpanyName" value={cpanyName} />


                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>충전소아이디</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput id="csIpd" readOnly={!vendorIdreadonly} maxLength="10" name="csId" defaultValue={detaildata[0].csId} placeholder="충전소 아이디(4자리 코드)" />
                    </CInputGroup>
                  </CFormGroup>


                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>충전기 개수</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput id="csCount" maxLength="10" name="csCount" defaultValue={detaildata[0].csCount} placeholder="충전소 개수" />
                    </CInputGroup>
                  </CFormGroup>



                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>연락처</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="tel" name="tel" maxLength="15" defaultValue={detaildata[0].tel} placeholder="연락처" />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>주소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="address" name="address" maxLength="100" defaultValue={detaildata[0].address} placeholder="주소" />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>사업자번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="biznum" name="biznum" defaultValue={detaildata[0].biznum} placeholder="사업자번호" />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>상태정보</CInputGroupText>
                      </CInputGroupPrepend>
                      <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
                        <CFormGroup variant="custom-radio" inline>
                          {detaildata[0].deleted === 1 && <CInputRadio custom id="status1" name="status" value="1" defaultChecked />}
                          {detaildata[0].deleted === 0 && <CInputRadio custom id="status1" name="status" value="1" />}
                          <CLabel variant="custom-checkbox" htmlFor="status1">사용중</CLabel>
                        </CFormGroup>
                        <CFormGroup variant="custom-radio" inline>
                          {detaildata[0].deleted === 1 && <CInputRadio custom id="status2" name="status" value="0" />}
                          {detaildata[0].deleted === 0 && <CInputRadio custom id="status2" name="status" value="0" defaultChecked />}
                          <CLabel variant="custom-checkbox" htmlFor="status2">미사용</CLabel>
                        </CFormGroup>
                      </div>
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
                        defaultValue={detaildata[0].note}
                      />
                    </CInputGroup>
                  </CFormGroup>


                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>최초  등록일</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" id="email" readOnly name="email" defaultValue={detaildata[0].createdAt} />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>마지막수정일</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" id="email" readOnly name="email" defaultValue={detaildata[0].updatedAt} />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={openmodal} size="bg" color="success" style={{ width: "100px" }}> 저장</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>

                </CForm>
              </CCardBody>
              {detaildata[0].csCount == null && <CCardHeader> </CCardHeader>}
              {detaildata[0].csCount != null &&
                <CCardHeader> 전력 사용량 통계 </CCardHeader>

              }

            </CCard>




          </CRow>

        </CCol>
      </CRow>
    </>
  )
}

export default Vendor