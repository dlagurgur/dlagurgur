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
  CSwitch,
  CInputRadio,
  CLabel,
  CSelect
} from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import MODAL from '../modals/Modals';
import GV from '../../globalSet'
import Moment from 'react-moment'
const moment = require('moment');


const fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '코드', _classes: 'Tablefirst' }, { key: '사업자번호', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '주소', _classes: 'Tablefirst' }, { key: '등록일', _classes: 'Tablefirst' }]
const fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '주소', _classes: 'Tablefirst' }]
const defaultValue = [{ _id: "", name_kr: "", tel_number: "", address_detail: "", biznum: "", vendorId: "", status: 1 }];
const fileds3 = [{ key: '사용월', _classes: 'Tablefirst' }, { key: '총 충전횟수', _classes: 'Tablefirst' }, { key: '총 충전시간', _classes: 'Tablefirst' }, { key: '총배터리 충전량(kW/h)', _classes: 'Tablefirst' }, { key: '총 충전기 인입전력량(kW/h)', _classes: 'Tablefirst' }]
const failurefields = [{ key: '충전소', _classes: 'Tablefirst' }, { key: '충전소ID', _classes: 'Tablefirst' }, { key: '신고자', _classes: 'Tablefirst' }, { key: '발생 날짜', _classes: 'Tablefirst' }, { key: '증상', _classes: 'Tablefirst' }, { key: '조치사항', _classes: 'Tablefirst' }, , { key: '처리 날짜', _classes: 'Tablefirst' }]

const Vendor = () => {
  const [fields34, setFields3] = useState(fileds3)
  const { kakao } = window;
  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [wattage, setWattage] = useState([]);

  const [fields3, setFields2] = useState()
  const [mode, setMode] = useState("alert");
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [addressdata, AddressData] = useState("");
  const [data, setData] = useState([]);
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendorIdreadonly, setVRO] = useState(false)
  const [frist, serFrist] = useState("")
  const [failure, setFailure] = useState([]);

  useEffect(() => {
    getList();
  }, []);
  // 운수사 리스트 호출 함수 
  const getList = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      setData(result.data.data.docs);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  // 운수사 상세정보 호출 함수
  const getDetail = (_id) => {
    $("#insert").hide()
    $("#detail").show()
    $("#frmadd")[0].reset();


    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/company/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setFields(fields2);

      setTimeout(() => {
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(35.12, 129.1),
          level: 3
        };
        const map = new kakao.maps.Map(container, options);

        const geocoder = new kakao.maps.services.Geocoder();
        // 주소-좌표 변환 객체를 생성합니다.

        // 주소로 좌표를 검색합니다..
        geocoder.addressSearch(result.data.data[0].address, function (result, status) {

          // 정상적으로 검색이 완료됐으면 
          if (status === kakao.maps.services.Status.OK) {

            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
              map: map,
              position: coords
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다


            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
          }
        })
      }, 1000);
      UTIL.writeani('open')
      getFailurelist(result.data.data[0].companyId)
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/wattage/" + "0" + "/" + result.data.data[0].companyId, configHeader).then(result => {
        setWattage(result.data.data.docs)
      })
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  const getFailurelist = (companyid) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/failurehistory/" + "0" + "/" + companyid, configHeader).then(resultfirm => {
      if (resultfirm) {
        setFailure(resultfirm.data.data.docs)
      }
    });
  }

  const setTableOpen = () => {
    $("#detail").hide()
    $("#insert").show();
    closemodal();    // 모달 팝업창 닫기(false)
    $("#frmadd")[0].reset();
    setDetailData(defaultValue)
    setModal(false);
    setFields(fields2);

    UTIL.writeani('open')
  }


  const insertModal = (_id) => {
    $("#detail").hide()
    $("#insert").show();
    $("#frmadd")[0].reset();
    setDetailData(defaultValue)
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/company/" + _id, configHeader).then(result => {
      setDetailData(result.data.data);
      setFields(fields2);
      UTIL.writeani('open')
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  const openmodal = () => {
    let txt = "";
    setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
    if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
    setModal(UTIL.modalopen('운수사 정보를 ' + txt + '하시겠습니까?', 'danger'))
  }

  const closemodal = () => {
    setModal(false);
  }
  // 입력폼 표시 애니메이션 처리

  // 입력폼 닫기 애니메이션 처리
  const setTableClose = () => {
    setModal(false);
    setDetailData(defaultValue)
    UTIL.writeani('close')
    setFields(fields1);
  }

  const handleClick = async () => {
    let txt = "";

    let frmstrcompanyName = $('#frmadd [name="companyName1"]').val();
    let frmstrcompanyId = $('#frmadd [name="companyId1"]').val();
    let frmstrtel = $('#frmadd [name="phone1"]').val();
    let frmstraddres = $('#frmadd [name="address12"]').val();
    let frmstraddresdetail = $('#frmadd [name="addressdetail1"]').val();
    let frmstrbiznum = $('#frmadd [name="biznum1"]').val();
    let frmstrnote = $('#frmadd [name="etcinfo1"]').val();
    let frmdeleted = $('#frmadd [name="deleted1"]').val();
    let sendinfcreate = {
      companyId: frmstrcompanyId,
      companyName: frmstrcompanyName,
      tel: frmstrtel,
      address: frmstraddres,
      addressdetail: frmstraddresdetail,
      biznum: frmstrbiznum,
      note: frmstrnote,
      deleted: frmdeleted,
      pagesize: GV.vendorTablepagesize
    }


    if (frmstrcompanyId == "") {
      alert("운수사 ID를 입력해주세요")
      return false
    } else if (frmstrcompanyName == "") {
      alert("운수사 명을 등록해주세요")
      return false
    } else if (frmstrtel == "") {
      alert("연락처를 입력해주세요")
      return false
    } else if (frmstrbiznum == "") {
      alert("사업자 번호를 입력해주세요")
      return false
    } else {
      if ($('#frmadd [name="id"]').val()) {
        txt = "수정";
        let url = "/api/pages/company/" + $('#frmadd [name="id"]').val();
        axios.put(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
          if (result.data.status === 1) {
            getList();
            setFields(fields1);
            UTIL.writeani('close')
            closemodal()
          } else {
            if (result.data.status === 9) {
              $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
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
        let url = "/api/pages/company";
        axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
          if (result.data.status === 1) {
            getList();
            setFields(fields1);
            UTIL.writeani('close')
            closemodal()
          } else {
            if (result.data.status === 9) {
              $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
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
      <CRow>
        <CCol xs="12" lg="12">
          <CRow>
            <MODAL data={warning} fnc={closemodal} mode={mode} handleClick={handleClick}></MODAL>

            <CCard id="listtable2" style={{ width: "100%", position: "relative" }}>
              <CCardHeader>
                운수사 리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>운수사 등록</CButton>
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
                    '운수사':
                      (item) => (
                        <td >
                          <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.companyName}</CBadge>
                        </td>
                      ),
                    '코드':
                      (item) => (
                        <td>
                          {item.companyId}
                        </td>
                      ),
                    '사업자번호':
                      (item) => (
                        <td>{item.biznum}</td>
                      )
                    ,
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
                      )
                    ,
                    '주소'
                      :
                      (item) => (
                        <td>{item.address}</td>
                      ),
                    '등록일':
                      (item) => (
                        <td>
                          <Moment local format="YYYY-MM-DD  HH:mm">{item.createdAt}</Moment>
                        </td>
                      ),


                  }}
                />
              </CCardBody>
            </CCard>




            <CCard id="writefrm" style={{ display: "none", width: "45%", position: "relative" }}>
              <div id="detail" style={{ display: "none" }}>
                <CCardHeader>
                  운수사 상세 정보
                </CCardHeader>
                <CCardBody>

                  <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>운수사ID</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput id="companyId" readOnly={!vendorIdreadonly} maxLength="20" name="companyId" defaultValue={detaildata[0].companyId} placeholder="운수사코드(4자리 코드)" />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>운수사명</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput id="companyName" name="companyName" maxLength="30" placeholder="운수사명" defaultValue={detaildata[0].companyName} readOnly />
                    </CInputGroup>
                  </CFormGroup>


                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>연락처</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="phone" name="phone" maxLength="15" defaultValue={detaildata[0].tel} placeholder="연락처" readOnly />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText>사업자번호</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="biznum" name="biznum" defaultValue={detaildata[0].biznum} placeholder="사업자번호" readOnly />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>주소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="address" name="address" maxLength="100" defaultValue={detaildata[0].address} placeholder="주소" readOnly />

                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>상세 주소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="address" name="addressdetail" maxLength="100" defaultValue={detaildata[0].addressdetail} placeholder="주소" readOnly />
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
                        <CInputGroupText> 상태정보 </CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom id="deleted" name="deleted" defaultValue={detaildata[0].status} disabled="disabled">
                        <option value="1" disabled="disabled"> 등록완료 </option>
                        <option value="0" disabled="disabled"> 삭제 </option>
                        <option value="2" disabled="disabled"> 등록대기 </option>
                      </CSelect>
                    </CInputGroup>
                  </CFormGroup>

                </CCardBody>

                <CCardHeader>
                  전력 사용량 통계
                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    items={wattage}
                    fields={fields34}
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
                            <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.count}회</CBadge>
                          </td>
                        ),
                      '총 충전시간':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="danger" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.date / 1000 / 3600).toFixed()}시간 </CBadge>
                          </td>
                        ),
                      '총배터리 충전량(kW/h)':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.meter).toFixed(2)}kW/h</CBadge>
                          </td>
                        ),
                      '총 충전기 인입전력량(kW/h)':
                        (item) => (
                          <td>
                            <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.meter).toFixed(2)}kW/h</CBadge>
                          </td>
                        )
                    }}
                  />
                </CCardBody>
                <CCard id="listtable5" >
                  <CCardHeader >
                    고장 이력
                  </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      items={failure}
                      fields={failurefields}
                      scopedSlots={{
                        '충전소':
                          (item) => (
                            <td>
                              <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.csId}</CBadge>
                            </td>
                          ),
                        '충전소ID':
                          (item) => (
                            <td>
                              <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.cpId}</CBadge>
                            </td>
                          ),
                        '신고자':
                          (item) => (
                            <td>
                              <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.reporter}</CBadge>
                            </td>
                          ),
                        '발생 날짜':
                          (item) => (
                            <td>  {moment(item.createdAt).format("YYYY-MM-DD")}</td>

                          ),
                        '증상':
                          (item) => (
                            <td>{item.symptom}</td>
                          ),
                        '조치사항':
                          (item) => (
                            <td>{item.action}</td>
                          ),
                        '처리 날짜':
                          (item) => (
                            <td>{item.processing}</td>
                          ),

                      }}
                    />
                  </CCardBody>
                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={() => insertModal(detaildata[0]._id)} size="bg" color="success" style={{ width: "100px" }}> 수정</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>
                </CCard>


              </div>


              <div id="insert" style={{ display: "none" }}>
                <CCardHeader>
                  운수사 정보 입력 및 수정
                </CCardHeader>
                <CCardBody>
                  <CForm action="" name="frmadd" id="frmadd" method="post">
                    <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>*운수사ID</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput id="companyId" readOnly={detaildata[0].companyId} maxLength="20" name="companyId1" defaultValue={detaildata[0].companyId} placeholder="운수사코드(4자리 코드)" />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*운수사명</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput id="companyName" name="companyName1" maxLength="30" placeholder="운수사명" defaultValue={detaildata[0].companyName} />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>*연락처</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="number" id="phone" name="phone1" maxLength="15" defaultValue={detaildata[0].tel} placeholder="연락처( - 를 빼고 입력해주세요)" />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*사업자번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="biznum" name="biznum1" defaultValue={detaildata[0].biznum} placeholder="사업자번호" />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>주소</CInputGroupText>
                        </CInputGroupPrepend>
                        {addressdata == "" && <CInput type="text" id="address12" name="address12" maxLength="100" defaultValue={detaildata[0].address} placeholder="주소" readOnly />}
                        {addressdata != "" && <CInput type="text" id="address12" name="address12" maxLength="100" defaultValue={detaildata[0].address} value={addressdata} placeholder="주소" readOnly />}
                        <CButton type="button" size="bg" color="success" style={{ width: "100px" }} onClick={sample4_execDaumPostcode}> 조회</CButton>
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>상세 주소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="address" name="addressdetail1" maxLength="100" defaultValue={detaildata[0].addressdetail} placeholder="상세 주소" />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CFormGroup>
                          <CInputGroup>
                            <CInputGroupPrepend>
                              <CInputGroupText> 상태정보 </CInputGroupText>
                            </CInputGroupPrepend>
                            <CSelect custom id="deleted1" name="deleted1" defaultValue={detaildata[0].deleted}>
                              <option value="1"> 등록완료 </option>
                              <option value="0"> 삭제 </option>
                              <option value="2"> 등록대기 </option>
                            </CSelect>
                          </CInputGroup>
                        </CFormGroup>
                      </CInputGroup>
                    </CFormGroup>


                  </CForm>
                  <CFormGroup className="form-actions">
                    <CButton type="button" onClick={openmodal} size="bg" color="success" style={{ width: "100px" }}> 저장</CButton>
                    <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                  </CFormGroup>
                </CCardBody>
              </div>
            </CCard>
          </CRow>
        </CCol>
      </CRow >
    </>
  )
}

export default Vendor