import React, { useState, useEffect } from 'react'
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
  CSelect, CPagination
} from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';
import { saveAs } from "file-saver"; import * as XLSX from 'xlsx';
import { Day } from 'react-big-calendar';
import Moment from 'react-moment'

const Report = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소(충전기ID)', _classes: 'Tablefirst' }, { key: '충전건번호', _classes: 'Tablefirst' }, { key: '차량번호', _classes: 'Tablefirst' }, { key: '카드번호', _classes: 'Tablefirst' }, { key: '충전량(kwh)', _classes: 'Tablefirst' }, , { key: '충전요금(원)', _classes: 'Tablefirst' }, { key: '시작%', _classes: 'Tablefirst' }, { key: '종료%', _classes: 'Tablefirst' }, { key: '충전시작일시', _classes: 'Tablefirst', _style: { textAlign: "center" } }, { key: '충전종료일시', _classes: 'Tablefirst', _style: { textAlign: "center" } }, { key: '충전 시간', _classes: 'Tablefirst', _style: { textAlign: "center" } }]
  if (isMobile) { fields1 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '시작전력', _classes: 'Tablefirst' }, { key: '종료전력', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState({ mode: false, msg: "", color: "info" });    // 모달 팝업용
  const [fields, setFields] = useState(fields1)
  const moment = require('moment');
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const [firstDate, setFirstDate] = useState()
  const [lastDate, setLastDate] = useState()
  const [meterValue, setSumMeter] = useState("0")
  const [totaltime, setTotalTime] = useState("0시간0분0초")
  const [reportcount, setReportCount] = useState("0")
  const [vendordata, setVendorData] = useState([]);
  const [csdata, setCsData] = useState([]);
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  const [csIdvalue, setCsIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(5);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [columnFilterValue, setColumnFilterValue] = useState();
  const [tableFilterValue, setTableFilterValue] = useState("");
  const [sorterValue, setSorterValue] = useState();

  const [userinfo] = useState(UTIL.getUserInfo(cookies))

  //운수사 리스트
  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      if (userinfo.grade === "0") {
        setLoading(false);
        setVendorData(result.data.data.docs)
      } else {
        change4()
        setLoading(false);
        setVendorData(result.data.data.docs)
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }, [])

  // 소속업체 선택시 소속 충전소 정보 호출하기
  const change = (e) => {
    setVendorIdvalue(e.target.value);
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
      setCsData(result.data.data)
      $("#routeno").hide();
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }


  const change2 = (e) => {
    setCsIdvalue(e.target.value)
  }

  const handleClick = async () => {
    let url = "/api/pages_report/reportlist/";

    let frmstrcsId = $('#schform [name="csId"]').val();
    let frmstrstartdate = $('#schform [name="startdate"]').val();
    let frmstrenddate = $('#schform [name="enddate"]').val();

    if (frmstrcsId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (frmstrstartdate === "" || frmstrenddate === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }

    axios.get(process.env.REACT_APP_APISERVER + url + page + "/" + frmstrcsId + "/" + frmstrstartdate + "/" + frmstrenddate, configHeader).then(result => {

      if (result.data.status === 1) {
        setItems(result.data.data);
        setPages(result.data.data.totalPages);
        setLoading(false);

        //총 소비전력
        const result1 = result.data.data.reduce(function (sum, currValue) {
          return sum + currValue.meter;
        }, 0);
        // 총 충전 시간

        let hour = result.data.data.reduce(function (hour, currValue) {
          return hour + moment(currValue.totaltime).hours()
        }, 0);

        let minute = result.data.data.reduce(function (minute, currValue) {
          return minute + moment(currValue.totaltime).minutes()
        }, 0);

        let second = result.data.data.reduce(function (second, currValue) {
          return second + moment(currValue.totaltime).seconds()
        }, 0);

        var d1 = moment.duration({ seconds: second, minutes: minute, hours: hour });
        var d2 = moment.duration({ seconds: 0, minutes: 0, hours: 0 });
        var dur;
        dur = d1.subtract(d2);
        var h = dur.hours();
        var m = dur.minutes();
        var s = dur.seconds();

        setTotalTime(h + "시간" + m + "분" + s + "초")
        setReportCount(result.data.data.length)
        setSumMeter(result1)

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


  const ExcelDownload = async () => {
    let url = "/api/pages_report/reportlistexcel";


    let frmstrcompanyuId = $('#schform [name="companyId"]').val();
    let frmstrcsId = $('#schform [name="csId"]').val();
    let frmstrstartdate = $('#schform [name="startdate"]').val();
    let frmstrenddate = $('#schform [name="enddate"]').val();

    if (frmstrcsId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (frmstrstartdate === "" || frmstrenddate === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }

    let sendinfcreate = {
      csId: frmstrcsId,
      startdate: frmstrstartdate,
      enddate: frmstrenddate,
      pagesize: 1000000,
      page: page
    }

    let params = {
      page,
      columnFilterValue: JSON.stringify(columnFilterValue),
      tableFilterValue,
      sorterValue: JSON.stringify(sendinfcreate),
      itemsPerPage
    };
    let listdata = { status: 1, params: params }  // 리스트 출력 기본 세팅값 정의 
    axios.post(process.env.REACT_APP_APISERVER + url, listdata, configHeader).then(result => {
      //setSorterValue(sendinfcreate)
      if (result.data.status === 1) {
        // setItems(result.data.data.docs);

        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const ws = XLSX.utils.json_to_sheet(result.data.data.docs)
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month >= 10 ? month : '0' + month
        let day = date.getDate()
        day = day >= 10 ? day : '0' + day
        let hour = date.getHours()
        hour = hour >= 10 ? hour : '0' + hour
        let min = date.getMinutes()
        let sec = date.getSeconds()
        sec = sec >= 10 ? sec : '0' + sec

        let purchaseDay = year + '' + month + '' + day + +hour + min + sec
        saveAs(data, `file_${frmstrcsId}_${purchaseDay}${fileExtension}`);
      } else {

        alert('엑셀파일 생성 실패');
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const Monthdate1 = () => {
    let now = new Date();
    let firstDate, lastDate;
    firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
    lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    let firstDate1 = moment(firstDate).format("YYYY-MM-DD")
    let firstDate2 = moment(lastDate).format("YYYY-MM-DD")
    setFirstDate(firstDate1)
    setLastDate(firstDate2)
  }

  const Monthdate2 = () => {
    let now = new Date();
    let firstDate, lastDate;
    firstDate = new Date(now.setDate(now.getDate() - 30));
    lastDate = new Date();
    let firstDate1 = moment(firstDate).format("YYYY-MM-DD")
    let firstDate2 = moment(lastDate).format("YYYY-MM-DD")
    setFirstDate(firstDate1)
    setLastDate(firstDate2)
  }

  const Monthdate3 = () => {
    let now = new Date();
    let firstDate, lastDate;
    firstDate = new Date(now.setDate(now.getDate() - 180));
    lastDate = new Date();
    let firstDate1 = moment(firstDate).format("YYYY-MM-DD")
    let firstDate2 = moment(lastDate).format("YYYY-MM-DD")
    setFirstDate(firstDate1)
    setLastDate(firstDate2)
  }

  const Monthdate4 = () => {
    let now = new Date();
    let firstDate, lastDate;
    firstDate = new Date(now.getFullYear(), 0);
    lastDate = new Date(now.getFullYear() + 1, -1, 31);
    let firstDate1 = moment(firstDate).format("YYYY-MM-DD")
    let firstDate2 = moment(lastDate).format("YYYY-MM-DD")
    setFirstDate(firstDate1)
    setLastDate(firstDate2)
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
  return (
    <>
      <CRow>
        <CCol>
          <CRow>
            <CCard id="listtable2" style={{ width: "100%", position: "relative", float: "left" }}>
              <CCardHeader>

                <div style={{ widht: "100%", border: "0px solid red" }}>
                  <form name="schform" id="schform" metghod="post">
                    <table style={{ widht: "100%", border: "0px solid red" }}>
                      <tr>

                        <td width="5%">
                          {userinfo.grade === "0" && <CSelect custom id="companyId" style={{ width: "100%" }} value={vendorIdvalue} onChange={e => change(e)} name="companyId">
                            <option value="0"> 운수사 선택 </option>
                            {
                              vendordata.map((item, index) => {
                                return (
                                  <option value={item.companyId} >{item.companyName}</option>
                                )
                              })
                            }
                          </CSelect>
                          }

                          {userinfo.grade === "2" && <CSelect custom id="companyId" value={userinfo.vendorid} onChange={e => change4(e)} name="companyId" disabled="disabled">
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

                          {userinfo.grade === "3" && <CSelect custom id="companyId" value={userinfo.vendorid} onChange={e => change4(e)} name="companyId" disabled="disabled">
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

                        </td>
                        <td width="5%">
                          {userinfo.grade === "0" &&
                            <CSelect custom name="csId" id="csId" style={{ width: "100%" }} value={csIdvalue} onChange={e => change2(e)}>
                              <option value="0"> ::: 선택하세요 :::</option>
                              {
                                csdata.map((item, index) => {
                                  return (
                                    <option value={item.csId}>[ {item.companyId} ] - {item.csName}</option>
                                  )
                                })
                              }
                            </CSelect>
                          }
                          {userinfo.grade === "2" &&
                            <CSelect custom name="csId" id="csId" style={{ width: "100%" }} value={csIdvalue} onChange={e => change2(e)}>
                              <option value="0"> ::: 선택하세요 :::</option>
                              {
                                csdata.map((item, index) => {
                                  return (
                                    <option value={item.csId}>[ {item.companyId} ] - {item.csName}</option>
                                  )
                                })
                              }
                            </CSelect>
                          }
                          {userinfo.grade === "3" &&

                            <CInput type="text" id="csId" maxLength="5" name="csId" value={userinfo.csid} placeholder="" readOnly />
                          }
                        </td>

                        <td width="10%">
                          <CButton color="info" onClick={Monthdate1}>이번달</CButton>
                          <CButton color="info" onClick={Monthdate2}>1개월</CButton>
                          <CButton color="info" onClick={Monthdate3}>6개월</CButton>
                          <CButton color="info" onClick={Monthdate4}>올해</CButton>
                        </td>

                        <td width="1.5%">시작일 :</td><td width="10%"><CInput type="date" value={firstDate} id="startdate" name="startdate" placeholder="date" style={{ width: "100%" }} /></td>
                        <td width="1.5%">종료일 :</td><td width="10%"> <CInput type="date" value={lastDate} id="enddate" name="enddate" placeholder="date" style={{ width: "100%" }} /></td>
                      </tr>
                      <tr><td colSpan="8" style={{ width: "100%", textAlign: "center", paddingTop: "15px" }}>
                        <CButton color="info" style={{ width: "90%", float: "center" }} onClick={handleClick}>검색하기</CButton>
                        <CButton color="danger" style={{ width: "150", float: "center" }} onClick={ExcelDownload}>엑셀다운로드</CButton>
                      </td></tr>
                    </table>
                  </form>
                </div>

              </CCardHeader>
              <CCardBody style={{ textAlign: "center" }}>
                <table class="table table-bordered" id="123">
                  <thead>
                    <tr>
                      <th>총 충전횟수</th>
                      <th>총 충전시간</th>
                      <th>총 소비전력(kW/h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><CBadge className="mr-1" color="danger" style={{ fontSize: "18px" }}>{reportcount}</CBadge></td>
                      <td><CBadge className="mr-1" color="danger" style={{ fontSize: "18px" }}>{totaltime}</CBadge></td>
                      <td><CBadge className="mr-1" color="danger" style={{ fontSize: "18px" }}>{meterValue}</CBadge></td>
                    </tr>
                  </tbody>
                </table>

                <CDataTable
                  class="table-light"
                  border
                  items={items}
                  fields={fields}
                  striped
                  tableFilterValue={tableFilterValue}
                  onTableFilterChange={setTableFilterValue}
                  sorter
                  sorterValue={sorterValue}
                  onSorterValueChange={setSorterValue}
                  // itemsPerPageSelect={{ external: true }}
                  itemsPerPage={itemsPerPage}
                  onPaginationChange={setItemsPerPage}
                  scopedSlots={{
                    '운수사':
                      (item) => (
                        <td>
                          {item.company_id}
                        </td>
                      ),
                    '충전소(충전기ID)':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{item.cs_id}({item.cp_id})</CBadge>
                        </td>
                      ),
                    '충전건번호':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{item.connectorId} </CBadge>
                        </td>
                      ),
                    '차량번호':
                      (item) => (
                        <td>
                          {item.vehicle_id}
                        </td>
                      ),
                    '카드번호':
                      (item) => (
                        <td>
                          {item.id_tag}
                        </td>
                      ),
                    '충전량(kwh)':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.meter).toFixed(2)}kW/h</CBadge>
                        </td>
                      ),
                    '충전요금(원)':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.price).toFixed(0)}원</CBadge>
                        </td>
                      ),
                    '시작%':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.meterStart).toFixed(0)}%</CBadge>
                        </td>
                      ),
                    '종료%':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="" style={{ padding: "5px", fontSize: "13px" }}>{parseFloat(item.meterStop).toFixed(0)}%</CBadge>
                        </td>
                      ),
                    '충전시작일시':
                      (item) => (
                        <td style={{ textAlign: "center" }}>
                          <Moment local format="YYYY-MM-DD  HH:mm">{item.starttimestamp}</Moment>
                        </td>
                      ),
                    '충전종료일시':
                      (item) => (
                        <td style={{ textAlign: "center" }}>
                          <Moment local format="YYYY-MM-DD  HH:mm">{item.stoptimestamp}</Moment>
                        </td>

                      ),
                    '충전 시간':
                      (item) => (
                        <td style={{ textAlign: "center" }}>
                          {moment(item.totaltime).format("HH시간 mm분 ss초")}
                        </td>

                      )
                  }}
                />
                <CPagination
                  pages={pages}
                  activePage={page}
                  onActivePageChange={setPage}
                  className={pages < 2 ? "d-none" : ""}
                />
              </CCardBody>
            </CCard>
          </CRow>
        </CCol>
      </CRow>
    </>
  )
}

export default Report