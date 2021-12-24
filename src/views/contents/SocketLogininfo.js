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
  CSwitch,
  CInputRadio,
  CLabel
} from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import MODAL from '../modals/Modals';
import GV from '../../globalSet'
import { Vendorlist, ManagerGrade, SetGradeTxt } from 'src/reusable/CommonAxios'
import { isMobile } from 'react-device-detect';


const defaultValue = [{ _id: "", username: "", userId: "", phone: "", email: "", grade: "", status: 1, password: "" }];
const Lineinfo = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var fields1 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '업체코드', _classes: 'Tablefirst' }, { key: '연락처', _classes: 'Tablefirst' }, { key: '권한', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '업체코드', _classes: 'Tablefirst' }, { key: '권한', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '업체코드', _classes: 'Tablefirst' }, { key: '연락처', _classes: 'Tablefirst' }, { key: '권한', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '이름', _classes: 'Tablefirst' }, { key: '업체코드', _classes: 'Tablefirst' }, { key: '권한', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [mode, setMode] = useState("alert");

  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const [data, setData] = useState([]);
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendordata, setVendorData] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [gradevalue, setGradevalue] = useState("");   // 사용자 추가시 권한 설정



  useEffect(() => {
    getList();
  }, []);

  // 사용자 리스트 호출 함수 
  const getList = () => {
    let listdata = { status: 1, pagesize: GV.vendorTablepagesize }  // 리스트 출력 기본 세팅값 정의 
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages/managerlist", listdata, configHeader).then(result => {
      setData(result.data.data)
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
    closemodal();
    $("#frmadd")[0].reset();
    let listdata = { _id: _id }
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages/managerdetail", listdata, configHeader).then(result => {
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].vendorId)
      setGradevalue(result.data.data[0].grade)
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
    let url = "/api/pages/manager";

    if ($('#frmadd [name="id"]').val()) {
      txt = "수정";
      url = "/api/pages/updatemanager/" + $('#frmadd [name="id"]').val();
    } else {
      txt = "등록";
      url = "/api/pages/manager";
    }

    let frmstruserId = $('#frmadd [name="userId"]').val();
    let frmstrvendorId = $('#frmadd [name="vendorId"]').val();
    let frmstrpassword = $('#frmadd [name="password"]').val();
    let frmstrusername = $('#frmadd [name="username"]').val();
    let frmstrgrade = $('#frmadd [name="grade"]').val();
    let frmstrpermission = $('#frmadd [name="permission"]').val();
    let frmstrphone = $('#frmadd [name="phone"]').val();
    let frmstremail = $('#frmadd [name="email"]').val();
    let frmstatus = $("input[name='status']:checked").val();
    let sendinfcreate = {
      vendorId: frmstrvendorId,
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

    axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {

      if (result.data.status === 1) {
        getList();

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

  const openmodal = () => {
    let txt = "";
    let url = "";
    setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
    if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
    setModal(UTIL.modalopen('사용자 정보를 ' + txt + '하시겠습니까?', 'danger'))
  }
  const closemodal = () => {
    setModal(false);
  }
  // 입력폼 표시 애니메이션 처리
  const setTableOpen = () => {
    setModal(false);
    setDetailData(defaultValue)
    $("#frmadd input").val("");
    $("#dateview").fadeOut();
    setFields(fields2);
    UTIL.writeani('open')
  }
  // 입력폼 닫기 애니메이션 처리
  const setTableClose = () => {
    setModal(false);
    UTIL.writeani('close')
    setFields(fields1);
  }

  const change = (e) => { setVendorIdvalue(e.target.value) }    // 벤더사 선택시 state 변경 
  const changeGrade = (e) => { setGradevalue(e.target.value) }  // 권한 선택시 state 변경
  return (
    <>
      <CRow>
        <CCol>
          <MODAL data={warning} fnc={closemodal} mode={mode} handleClick={handleClick}></MODAL>
          <CRow>

            <CCard id="listtable2" style={{ width: "100%", position: "relative", float: "left" }}>
              <CCardHeader>
                버스 리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>버스등록</CButton>
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
                  clickableRows
                  onRowClick={(item) => getDetail(item._id)}
                  scopedSlots={{
                    '이름':
                      (item) => (
                        <td >
                          {/* {item.status === 1 && <CBadge className="mr-1" color="primary" style={{padding:"5px",fontSize:"13px"}}>{item.name_kr}</CBadge> }
                          {item.status === 0 && <CBadge className="mr-1" color="dark" style={{padding:"5px",fontSize:"13px"}}>{item.name_kr}</CBadge> } */}
                          {item.username}
                        </td>
                      ),
                    '업체코드':
                      (item) => (
                        <td>
                          {item.status === 1 && <CBadge className="mr-1" color="info" style={{ padding: "5px", fontSize: "13px" }}>{item.vendorId}</CBadge>}
                          {item.status === 0 && <CBadge className="mr-1" color="dark" style={{ padding: "5px", fontSize: "13px" }}>{item.vendorId}</CBadge>}
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
                          {item.status === 1 && <CBadge className="mr-1" color="warning" style={{ padding: "5px", fontSize: "13px" }}>등록중</CBadge>}
                          {item.status === 0 && <CBadge className="mr-1" color="dark" style={{ padding: "5px", fontSize: "13px" }}>삭제됨</CBadge>}
                        </td>
                      )
                  }}
                />
              </CCardBody>
            </CCard>


            <CCard id="writefrm" style={{ width: "45%", position: "relative", float: "left", display: "none" }}>
              <CCardHeader>
                사용자정보 입력
              </CCardHeader>
              <CCardBody>
                <CForm action="" name="frmadd" id="frmadd" method="post">
                  <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> * 소속업체</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="select" id="vendorId" value={vendorIdvalue} onChange={e => change(e)} name="vendorId">
                        <option value="0"> ::: 선택하세요 :::</option>
                        {
                          vendordata.map((item, index) => {
                            var a = detaildata[0].vendorId === item.vendorId ? ' selected' : ''
                            return (
                              <option value={item.vendorId}>{item.name_kr}</option>
                            )
                          })
                        }
                      </CSelect>
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> * 사용자아이디</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="userId" name="userId" defaultValue={detaildata[0].userId} />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> * 비밀번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" id="password" name="password" defaultValue={detaildata[0].password} />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> * 사용자이름</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="username" name="username" defaultValue={detaildata[0].username} />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> * 권한</CInputGroupText>
                      </CInputGroupPrepend>
                      <ManagerGrade grade={gradevalue} changeGrade={changeGrade} />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>연락처</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="phone" name="phone" defaultValue={detaildata[0].phone} />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>이메일</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" id="email" name="email" defaultValue={detaildata[0].email} />
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> * 상태정보</CInputGroupText>
                      </CInputGroupPrepend>
                      <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
                        <CFormGroup variant="custom-radio" inline>
                          {detaildata[0].status === 1 && <CInputRadio custom id="status1" name="status" value="1" defaultChecked />}
                          {detaildata[0].status === 0 && <CInputRadio custom id="status1" name="status" value="1" />}
                          <CLabel variant="custom-checkbox" htmlFor="status1">등록중</CLabel>
                        </CFormGroup>
                        <CFormGroup variant="custom-radio" inline>
                          {detaildata[0].status === 1 && <CInputRadio custom id="status2" name="status" value="0" />}
                          {detaildata[0].status === 0 && <CInputRadio custom id="status2" name="status" value="0" defaultChecked />}
                          <CLabel variant="custom-checkbox" htmlFor="status2">삭제중</CLabel>
                        </CFormGroup>
                      </div>
                    </CInputGroup>
                  </CFormGroup>
                  <div id="dateview" style={{ display: "none" }}>
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
                  </div>
                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={openmodal} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>

                </CForm>
              </CCardBody>
            </CCard>

          </CRow>

        </CCol>
      </CRow>
    </>
  )
}

export default Lineinfo