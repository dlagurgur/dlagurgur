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
    const fields1 = [{ key: '업체 이름', _classes: 'Tablefirst' }, { key: '모델명', _classes: 'Tablefirst' }]
    const fields3 = [{ key: '업체 이름', _classes: 'Tablefirst' }, { key: '모델명', _classes: 'Tablefirst' }]
    if (isMobile) { fields1 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '운행도시', _classes: 'Tablefirst' }] }
    const fields2 = [{ key: '업체 이름', _classes: 'Tablefirst' }, { key: '모델명', _classes: 'Tablefirst' }]
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
    const [manufacturerValue, setManufacturervalue] = useState("");
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
    const [manufacturer, setManufacturer] = useState([]);

    useEffect(() => {
        getList()

    }, []);

    useEffect(() => {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/manufacturer", configHeader).then(result => {
            setManufacturer(result.data.data.docs);
        }).catch(err => {

        });
    }, [])



    const getList = () => {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/chargerModel/" + "0", configHeader).then(result => {
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
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/chargerModel/" + "0", configHeader).then(result => {
            setItems(result.data.data.docs.slice(0, countpage));
            setPages(result.data.data.totalPages);
            setLoading(false);
        }).catch(err => {
            setModal(UTIL.api401chk(err));
        });
    }

    // 사용자 리스트 호출 함수 



    const getDetail = (_id) => {
        $("#insert").show()
        $("#frmadd")[0].reset();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/chargerModel/detail/" + _id, configHeader).then(result => {
            setManufacturervalue(result.data.data[0].manufacturerName)
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
        $("#detail").hide()
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
        let url = "/api/pages_charger/chargerModel";

        let manufacturerName = $('#frmadd [name="manufacturerName"]').val();
        let modelName = $('#frmadd [name="modelName"]').val();

        let sendinfcreate = {
            manufacturerName: manufacturerName,   // 벤더아이디
            modelName: modelName,   // 벤더아이디
        }

        if (manufacturerName == "") {
            alert("제조업체 이름을 입력해주세요")
            toggle()
            return false
        } else if (modelName == "") {
            alert("모델명 을 입력해주세요")
            toggle()
            return false
        } else {

            if ($('#frmadd [name="id"]').val()) {
                txt = "수정";
                url = "/api/pages_charger/chargerModel/" + $('#frmadd [name="id"]').val();
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
                    setModal(UTIL.api401chk(err));
                })
            } else {
                txt = "등록";
                url = "/api/pages_charger/chargerModel";
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
                    setModal(UTIL.api401chk(err));
                })
            }

        }
    }

    const delmodal = () => {
        let txt = "삭제";
        let url = "";
        setMode('del');
        setModal('모델 정보를 ' + txt + '하시겠습니까?')
        setModal1(!modal);
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
        setModal('모델 정보를 ' + txt + '하시겠습니까?')
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
                                충전기 모델 리스트
                                <div style={{ paddingBottom: "5px", float: "right" }}>
                                    <CButton block color="info" onClick={setTableOpen}>모델 등록</CButton>
                                </div>
                            </CCardHeader>

                            <CCardBody>
                                {/* {userinfo.grade === "0" &&
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
                                } */}
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
                                        '업체 이름':
                                            (item) => (
                                                <td>
                                                    {item.manufacturerName}
                                                </td>
                                            ),
                                        '모델명':
                                            (item) => (
                                                <td>
                                                    {item.modelNo}
                                                </td>
                                            ),
                                    }}
                                />

                            </CCardBody>
                        </CCard>


                        <CCard id="writefrm" style={{ width: "45%", position: "relative", float: "left", display: "none" }}>
                            <div id="insert" style={{ display: "none" }}>
                                <CCardHeader>
                                    충전기 모델 정보 입력
                                </CCardHeader>
                                <CCardBody>
                                    <CForm action="" name="frmadd" id="frmadd" method="post">
                                        <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                                        <CInputGroup>
                                            <CInputGroupPrepend>
                                                <CInputGroupText>제조업체 이름</CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CSelect custom name="manufacturerName" id="manufacturerName" defaultValue={manufacturerValue} name="manufacturerName">
                                                {manufacturerValue !== "" && <option value={manufacturerValue} >{manufacturerValue} </option>}
                                                {manufacturerValue === "" && <option value="0" >::: 선택하세요 :::</option>}
                                                {
                                                    manufacturer.map((item, index) => {
                                                        var a = detaildata[0].manufacturerName === item.manufacturerName ? ' selected' : ''
                                                        return (
                                                            <option value={item.manufacturerName}>{item.manufacturerName}</option>
                                                        )
                                                    })
                                                }
                                            </CSelect>
                                        </CInputGroup>

                                        <br />
                                        <CInputGroup>
                                            <CInputGroupPrepend>
                                                <CInputGroupText>모델명</CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" id="modelName" name="modelName" defaultValue={detaildata[0].modelNo} maxLength="30" placeholder="모델명" />
                                        </CInputGroup>


                                        <br />
                                        <CFormGroup className="form-actions">
                                            <CButton type="button" onClick={toggle} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
                                            &nbsp; &nbsp; &nbsp; &nbsp;
                                            {/* <CButton id="dateviewbtn" style={{ display: "none" }} type="button" onClick={delmodal} size="bg" color="danger" style={{ width: "100px" }}>삭제</CButton> */}
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
