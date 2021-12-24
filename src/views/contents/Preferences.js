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
const moment = require('moment');


const defaultValue = [{ _id: "", vendorId: "", line_num: "", line_name: "" }];
const Lineinfo = () => {
    // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const fields1 = [{ key: '설정명', _classes: 'Tablefirst' }, { key: '설정값', _classes: 'Tablefirst' }, { key: '설명', _classes: 'Tablefirst' }]
    const fields3 = [{ key: '설정명', _classes: 'Tablefirst' }, { key: '설정값', _classes: 'Tablefirst' }, { key: '설명', _classes: 'Tablefirst' }]
    if (isMobile) { fields1 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '운행도시', _classes: 'Tablefirst' }] }
    const fields2 = [{ key: '설정명', _classes: 'Tablefirst' }, { key: '설정값', _classes: 'Tablefirst' }, { key: '설명', _classes: 'Tablefirst' }]
    if (isMobile) { fields2 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '운행도시', _classes: 'Tablefirst' }] }

    const [cookies] = useCookies(['token']);  //Auth    
    const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
    const [warning, setModal] = useState("");    // 모달 팝업용
    const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
    const [fields, setFields] = useState(fields1)
    const [mode, setMode] = useState("alert");
    const [csdata1, setCsData1] = useState([]);
    const [detaildata, setDetailData] = useState(defaultValue);
    const [vendordata, setVendorData] = useState([]);
    const [csdata, setCsData] = useState([]);
    const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
    const [csIdvalue, setCsIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정 
    const [gradevalue, setGradevalue] = useState("");   // 사용자 추가시 권한 설정
    // 라이브 페이징을 위한 정의  START
    const [items, setItems] = useState([]);
    const [HistoryData, setHistoryData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(5);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [columnFilterValue, setColumnFilterValue] = useState();
    const [tableFilterValue, setTableFilterValue] = useState("");
    const [sorterValue, setSorterValue] = useState();
    const [countpage, setCountPage] = useState(25)

    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [userinfo] = useState(UTIL.getUserInfo(cookies))
    const [modal, setModal1] = useState(false);
    // 라이브 페이징을 위한 정의  END


    useEffect(() => {
        getList()

    }, []);


    const getList = () => {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages/preferences/" + "0", configHeader).then(result => {
            setItems(result.data.data.docs.slice(0, 15));

        }).catch(err => {

        });

    }


    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        let companyId = $('#schform [name="companyId"]').val();
        let csId = $('#schform [name="csId"]').val();
        if (scrollTop + clientHeight >= scrollHeight) {

            setCountPage(countpage + 10)
            getList12()

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
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages/preferences/" + "0", configHeader).then(result => {
            setItems(result.data.data.docs.slice(0, countpage));
            setPages(result.data.data.totalPages);
            setLoading(false);
        }).catch(err => {
            setModal(UTIL.api401chk(err));
        });
    }

    // 사용자 리스트 호출 함수 

    //d운수사 리스트



    //환경 설정 상세정보 호출 함수
    const getDetail = (_id) => {
        $("#insert").show()
        $("#frmadd")[0].reset();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages/preferences/detaile/" + _id, configHeader).then(result => {
            setDetailData(result.data.data);
            setFields(fields2);
            // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
            UTIL.writeani('open')
            // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------
        }).catch(err => {
            setModal(UTIL.api401chk(err));
        });
    }

    const setTableOpen = () => {
        $("#insert").show();
        $("#dateviewbtn").fadeOut();
        closemodal();    // 모달 팝업창 닫기(false)
        $("#frmadd")[0].reset();
        setDetailData(defaultValue)
        setModal(false);
        setFields(fields2);
        UTIL.writeani('open')
    }



    // 소속업체 선택시 소속 충전소 정보 호출하기


    // 소속업체 선택시 소속 충전소 정보 호출하기

    const handleClick = async () => {
        let txt = "";
        let url = "/api/pages/preferencesr";
        let preferencesName = $('#frmadd [name="preferencesName"]').val();
        let preferencesValue = $('#frmadd [name="preferencesValue"]').val();
        let preferencesNote = $('#frmadd [name="preferencesNote"]').val();

        let sendinfcreate = {
            preferencesName: preferencesName,   // 설정명
            preferencesValue: preferencesValue,   // 설정값
            preferencesNote: preferencesNote //설정 설명
        }


        if ($('#frmadd [name="id"]').val()) {
            txt = "수정";
            url = "/api/pages/preferencesr/" + $('#frmadd [name="id"]').val();
            axios.put(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
                if (result.data.status === 1) {
                    getList();
                    setFields(fields1);
                    UTIL.writeani('close')
                    toggle()
                } else {
                    if (result.data.status === 9) {
                        $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
                    } else {
                        $("#txtmsg").text("등록실패")
                        $("#btn_modal_save").hide();
                    }

                }
            }).catch(err => {

            })
        } else {
            txt = "등록";
            url = "/api/pages/preferencesr";
            axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
                if (result.data.status === 1) {
                    getList();
                    setFields(fields1);
                    UTIL.writeani('close')
                    toggle()
                } else {
                    if (result.data.status === 9) {
                        $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
                    } else {
                        $("#txtmsg").text("등록실패")
                        $("#btn_modal_save").hide();
                    }

                }
            }).catch(err => {

            })
        }

    }



    const closemodal = () => {
        setModal(false);
    }

    const setTableClose = () => {
        setModal(false);
        setDetailData(defaultValue)
        UTIL.writeani('close')
        setFields(fields1);
    }



    const toggle = () => {
        let txt = "";
        setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
        if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
        setModal('설정 정보를 ' + txt + '하시겠습니까?')
        setModal1(!modal);
    }



    return (
        <>
            <CModal
                show={modal}
                onClose={toggle}
                color="denger"
            >
                <CModalHeader closeButton>
                    <CModalTitle>TOC System POPUP</CModalTitle>
                </CModalHeader>
                <CModalBody id="txtmsg" style={{ textAlign: 'center', paddingTop: "30px", paddingBottom: "30px" }} >
                    {warning}
                </CModalBody>
                <CModalFooter>
                    {mode === "save" && <CButton color="primary" onClick={handleClick} >저장 </CButton>}

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
                                TOC 환경설정 리스트
                                <div style={{ paddingBottom: "5px", float: "right" }}>
                                    <CButton block color="info" onClick={setTableOpen}>환경설정 등록</CButton>
                                </div>
                            </CCardHeader>

                            <CCardBody>

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
                                        '설정명':
                                            (item) => (
                                                <td>
                                                    <CBadge className="mr-1" size="large" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.preferencesName}</CBadge>
                                                </td>
                                            ),
                                        '설정값':
                                            (item) => (
                                                <td>
                                                    {item.preferencesValue}
                                                </td>
                                            ),
                                        '설명':
                                            (item) => (
                                                <td>
                                                    {item.preferencesNote}
                                                </td>
                                            ),
                                    }}
                                />

                            </CCardBody>
                        </CCard>


                        <CCard id="writefrm" style={{ width: "45%", position: "relative", float: "left", display: "none" }}>

                            <div id="insert" style={{ display: "none" }}>
                                <CCardHeader>
                                    설정 정보 입력
                                </CCardHeader>
                                <CCardBody>
                                    <CForm action="" name="frmadd" id="frmadd" method="post">
                                        <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                                        <CInputGroup>
                                            <CInputGroupPrepend>
                                                <CInputGroupText>설정 이름</CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput id="preferencesName" name="preferencesName" maxLength="30" defaultValue={detaildata[0].preferencesName} placeholder="설정 이름" />
                                        </CInputGroup>

                                        <br />
                                        <CInputGroup>
                                            <CInputGroupPrepend>
                                                <CInputGroupText>설정 값</CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="number" id="preferencesValue" name="preferencesValue" defaultValue={detaildata[0].preferencesValue} maxLength="30" placeholder="설정 값" />
                                        </CInputGroup>


                                        <br />

                                        <CInputGroup>
                                            <CInputGroupPrepend>
                                                <CInputGroupText>설명</CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" id="preferencesNote" name="preferencesNote" defaultValue={detaildata[0].preferencesNote} maxLength="30" placeholder="설명" />
                                        </CInputGroup>
                                        <br />

                                        <CFormGroup className="form-actions">
                                            <CButton type="button" onClick={toggle} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
                                            &nbsp; &nbsp; &nbsp; &nbsp;

                                            <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                                        </CFormGroup>

                                    </CForm>
                                </CCardBody>
                            </div>
                        </CCard>
                    </CRow>
                </CCol>
            </CRow >
        </>
    )
}

export default Lineinfo
