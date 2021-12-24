import React, { useState, useEffect } from 'react'
import { CBadge, CCard, CButton, CCardHeader, CCol, CDataTable, CRow, CPagination } from '@coreui/react'
import $ from 'jquery';
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';
import '../css/style.css'
import Moment from 'react-moment'
const defaultValue = [{ _id: "", username: "", userId: "", phone: "", email: "", grade: "", status: 1, password: "" }];
const StartTransaction = (props) => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var fields1 = [{ key: '통신코드', _classes: 'Tablefirst' }, { key: '충전기아이디', _classes: 'Tablefirst' }, { key: '충전건번호', _classes: 'Tablefirst' }, { key: '트랜잭션아이디', _classes: 'Tablefirst' }, { key: '등록일시', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '통신코드', _classes: 'Tablefirst' }, { key: '충전기아이디', _classes: 'Tablefirst' }, { key: '충전건번호', _classes: 'Tablefirst' }, { key: '트랜잭션아이디', _classes: 'Tablefirst' }, { key: '등록일시', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '통신코드', _classes: 'Tablefirst' }, { key: '충전기아이디', _classes: 'Tablefirst' }, { key: '충전건번호', _classes: 'Tablefirst' }, { key: '트랜잭션아이디', _classes: 'Tablefirst' }, { key: '등록일시', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '통신코드', _classes: 'Tablefirst' }, { key: '충전기아이디', _classes: 'Tablefirst' }, { key: '충전건번호', _classes: 'Tablefirst' }, { key: '트랜잭션아이디', _classes: 'Tablefirst' }, { key: '등록일시', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
  const [fields, setFields] = useState(fields1)

  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [data, setData] = useState([]);
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(5);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [columnFilterValue, setColumnFilterValue] = useState();
  const [tableFilterValue, setTableFilterValue] = useState("0");
  const [sorterValue, setSorterValue] = useState();
  const [last_id, setlast_id] = useState("");    // 페이징 쿼리를 위해 가장 마지막 _id값 세팅
  const [senddata, setSenddata] = useState({ status: 1, pagesize: itemsPerPage, lastid: last_id });

  const [fetchTrigger, setFetchTrigger] = useState(0);

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

    // 리스트 출력 기본 세팅값 정의 
    axios.get(process.env.REACT_APP_APISERVER + "/api/data/metervalue/" + tableFilterValue + "/" + page, configHeader).then(result => {
      setItems(result.data.data.docs);
      setPages(result.data.data.totalPages);
      setLoading(false);
    }).catch(err => {

      UTIL.api401chk(err);
      setTimeout(() => {
        setFetchTrigger(fetchTrigger + 1);
      }, 5000);
    });
  }, [query, fetchTrigger]);

  function refresh() {
    // window.location='/get/logview';

    // 리스트 출력 기본 세팅값 정의 
    axios.get(process.env.REACT_APP_APISERVER + "/api/data/metervalue/" + tableFilterValue + "/" + page, configHeader).then(result => {
      setItems(result.data.data.docs);
      setPages(result.data.data.totalPages);
      setLoading(false);
    }).catch(err => {

      UTIL.api401chk(err);
      setTimeout(() => {
        setFetchTrigger(fetchTrigger + 1);
      }, 5000);
    });
  }


  return (
    <>
      <CRow>
        <CCol>
          <CRow>

            <CCard id="listtable2" className="p-5" style={{ width: "100%", position: "relative", float: "left" }}>
              <div style={{ marginTop: "-40px" }}>
                <CButton block color="info" onClick={refresh}>새로고침</CButton>
              </div>
              <CDataTable
                items={items}
                fields={fields}
                loading={loading}
                hover

                // columnFilter={{ external: true }}
                // columnFilterValue={columnFilterValue}
                // onColumnFilterChange={setColumnFilterValue}
                tableFilter={{ external: true }}
                tableFilterValue={tableFilterValue}
                onTableFilterChange={setTableFilterValue}
                sorter
                sorterValue={sorterValue}
                onSorterValueChange={setSorterValue}
                itemsPerPageSelect={{ external: true }}
                itemsPerPage={itemsPerPage}
                onPaginationChange={setItemsPerPage}
                scopedSlots={{

                  '통신코드': (item) => (<td style={{ width: "20%" }}>{item.pid}</td>),
                  '카드번호': (item) => (<td className="wordlimit100">{item.idTag} </td>),
                  '충전기아이디': (item) => (<td style={{ width: "20%" }} >{item.cpId}</td>),
                  '충전건번호': (item) => (<td style={{ width: "20%" }}>{item.connectorId}</td>),
                  '트랜잭션아이디': (item) => (<td style={{ width: "20%" }}>{item.transactionId}</td>),
                  '등록일시': (item) => (<td style={{ width: "30%" }}><Moment local format="YYYY-MM-DD  HH:mm">{item.localtime}</Moment></td>),
                }}
              />
              <CPagination
                pages={pages}
                activePage={page}
                onActivePageChange={setPage}
                className={pages < 2 ? "d-none" : ""}
              />
            </CCard>




          </CRow>

        </CCol>
      </CRow>
    </>
  )
}

export default StartTransaction