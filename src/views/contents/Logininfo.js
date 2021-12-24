import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CSelect,
  CButton
} from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';
import Moment from 'react-moment'

const Logininfo = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '이름', _classes: 'Tablefirst' }, { key: '로그인아이디', _classes: 'Tablefirst' }, { key: 'IP', _classes: 'Tablefirst' }, { key: '로그인일시', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '로그인아이디', _classes: 'Tablefirst' }, { key: 'IP', _classes: 'Tablefirst' }, { key: '로그인일시', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '로그인아이디', _classes: 'Tablefirst' }, { key: 'IP', _classes: 'Tablefirst' }, { key: '로그인일시', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '로그인아이디', _classes: 'Tablefirst' }, { key: 'IP', _classes: 'Tablefirst' }, { key: '로그인일시', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  const [vendordata, setVendorData] = useState([]);
  const [csIdvalue, setCsIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(5);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [columnFilterValue, setColumnFilterValue] = useState();
  const [tableFilterValue, setTableFilterValue] = useState("");
  const [sorterValue, setSorterValue] = useState();
  const [csdata, setCsData] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용

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
      // 리스트 출력 기본 세팅값 정의 
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/loginlist/" + page, configHeader).then(result => {
        setItems(result.data.data.docs);
        setPages(result.data.data.totalPages);
        setLoading(false);
      }).catch(err => {

        UTIL.api401chk(err);
        setTimeout(() => {
          setFetchTrigger(fetchTrigger + 1);
        }, 2000);
      });
    } else {
      userSelect();
    }
  }, [query, fetchTrigger]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      setItems(result.data.data.docs);
      setPages(result.data.data.totalPages);
      setLoading(false);
      setVendorData(result.data.data.docs)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }, [])



  const userSelect = (e) => {

    let companyId = $('#schform [name="companyId"]').val();
    let selectUser = $('#schform [name="selectUser"]').val();
    let selectValue = $('#schform [name="selectValue"]').val();
    if (userinfo.grade !== "0") {
      companyId = userinfo.vendorid
    }

    if (selectValue == "") {
      selectValue = "0"
    }

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/loginselect/" + companyId + "/" + selectValue, configHeader).then(result => {
      setItems(result.data.data);
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  return (
    <>
      <CRow>
        <CCol>
          <CRow>
            <CCard id="listtable2" className="p-5" style={{ width: "100%", position: "relative", float: "left" }}>
              {userinfo.grade === "0" &&
                <form name="schform" id="schform" metghod="post">
                  <div style={{ paddingBottom: "5px", float: "left" }}>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 운수사</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect custom name="select" id="companyId" defaultValue={vendorIdvalue} onChange={e => userSelect(e)} name="companyId" >
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

                      <CInput type="text" id="selectValue" name="selectValue" placeholder="아이디 또는 이름" />
                      <CButton type="button" size="bg" onClick={userSelect} color="success" style={{ width: "100px" }}> 검색</CButton>
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
                      <CSelect custom name="select" id="companyId" value={userinfo.vendorid} onChange={e => userSelect(e)} name="companyId" disabled="disabled">
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
                      <CInput type="text" id="selectValue" name="selectValue" placeholder="아이디 또는 이름" />
                      <CButton type="button" size="bg" onClick={userSelect} color="success" style={{ width: "100px" }}> 검색</CButton>
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
                      <CInput type="text" id="selectValue" name="selectValue" placeholder="아이디 또는 이름" />
                      <CButton type="button" size="bg" onClick={userSelect} color="success" style={{ width: "100px" }}> 검색</CButton>
                    </CInputGroup>
                  </div>
                </form>
              }
              <CDataTable
                items={items}
                fields={fields}
                itemsPerPage={10}
                hover
                sorter
                pagination
                scopedSlots={{
                  '운수사':
                    (item) => (
                      <td >
                        {item.companyId}
                      </td>
                    ),
                  '충전소':
                    (item) => (
                      <td >
                        {item.csId}
                      </td>
                    ),
                  '이름':
                    (item) => (
                      <td>
                        {item.username}
                      </td>
                    ),
                  '로그인아이디':
                    (item) => (
                      <td >
                        {item.userId}
                      </td>
                    ),
                  'IP':
                    (item) => (
                      <td>
                        {item.ipAddress}
                      </td>
                    ),
                  '로그인일시':
                    (item) => (
                      <td>
                        <Moment local format="YYYY-MM-DD  HH:mm">{item.createdAt}</Moment>
                      </td>
                    ),
                  '상태':
                    (item) => (
                      <td>{item.state}
                      </td>
                    )
                }}
              />

            </CCard>




          </CRow>

        </CCol>
      </CRow>
    </>
  )
}

export default Logininfo