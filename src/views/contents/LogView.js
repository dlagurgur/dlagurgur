import React, { useState, useEffect } from 'react'
import { CBadge, CCard, CButton, CCol, CDataTable, CRow, CPagination } from '@coreui/react'
import axios from 'axios';
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
import { isMobile } from 'react-device-detect';

const Logininfo = (props) => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var fields1 = [{ key: 'TYPE', _classes: 'Tablefirst' }, { key: '로그기록일', _classes: 'Tablefirst' }, { key: '메시지', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: 'TYPE', _classes: 'Tablefirst' }, { key: '로그기록일', _classes: 'Tablefirst' }, { key: '메시지', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: 'TYPE', _classes: 'Tablefirst' }, { key: '로그기록일', _classes: 'Tablefirst' }, { key: '메시지', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: 'TYPE', _classes: 'Tablefirst' }, { key: '로그기록일', _classes: 'Tablefirst' }, { key: '메시지', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [fields, setFields] = useState(fields1)
  const moment = require('moment');
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const [data, setData] = useState([]);
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(5);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [columnFilterValue, setColumnFilterValue] = useState();
  const [tableFilterValue, setTableFilterValue] = useState("0");
  const [sorterValue, setSorterValue] = useState();

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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/socketloglist/" + tableFilterValue + "/" + page, configHeader).then(result => {
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
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/socketloglist/" + tableFilterValue + "/" + page, configHeader).then(result => {
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
                  'TYPE':
                    (item) => (
                      <td >
                        {item.log.doctype}
                      </td>
                    ),
                  '로그기록일':
                    (item) => (
                      <td>{moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                    )
                  ,
                  '메시지':
                    (item) => (
                      <td>
                        <ul style={{ listStyle: "none" }}>
                          <li>
                            <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>입력데이터</CBadge>
                            {item.log.inputdata}
                          </li>
                          <li>
                            <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>출력데이터</CBadge>
                            {item.log.returndata}
                          </li>
                        </ul>

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
            </CCard>




          </CRow>

        </CCol>
      </CRow>
    </>
  )
}

export default Logininfo