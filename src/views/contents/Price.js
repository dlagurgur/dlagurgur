import React, { useState, useEffect } from 'react'
import {
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

const fields1 = [{ key: '시간', _classes: 'Tablefirst' }, { key: '1월', _classes: 'Tablefirst' }, { key: '2월', _classes: 'Tablefirst' }, { key: '3월', _classes: 'Tablefirst' },
{ key: '4월', _classes: 'Tablefirst' }, { key: '5월', _classes: 'Tablefirst' }, { key: '6월', _classes: 'Tablefirst' }, { key: '7월', _classes: 'Tablefirst' },
{ key: '8월', _classes: 'Tablefirst' }, { key: '9월', _classes: 'Tablefirst' }, { key: '10월', _classes: 'Tablefirst' }, { key: '11월', _classes: 'Tablefirst' }, { key: '12월', _classes: 'Tablefirst' }]

const Vendor = () => {
    // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const [cookies] = useCookies(['token']);  //Auth    
    const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
    const [warning, setModal] = useState("");    // 모달 팝업용
    const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
    const [fields, setFields] = useState(fields1)
    const [mode, setMode] = useState("alert");
    const [data, setData] = useState([])
    const [countdata, setCountdata] = useState("0");
    const [modal, setModal1] = useState(false);
    useEffect(() => {
        getList();
    }, []);

    // 운수사 리스트 호출 함수 
    const getList = () => {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/selectChargePrice/" + 1 + "/" + 0 + "/" + 1, configHeader).then(result => {
            setData(result.data.data);
        }).catch(err => {
            setModal(UTIL.api401chk(err));
        });
    }

    const handleClick = async () => {
        let txt = "";
        let url = "/api/pages_report/updateChargePrice"
        txt = "수정";

        let param = []
        data.map((item, index) => {

            if (item.month_01 != $('#month_01' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 1,
                    price: $('#month_01' + index).val()
                }
                )
            }
            if (item.month_02 != $('#month_02' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 2,
                    price: $('#month_02' + index).val()
                }
                )
            }
            if (item.month_03 != $('#month_03' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 3,
                    price: $('#month_03' + index).val()
                }
                )
            }
            if (item.month_04 != $('#month_04' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 4,
                    price: $('#month_04' + index).val()
                }
                )
            }
            if (item.month_05 != $('#month_05' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 5,
                    price: $('#month_05' + index).val()
                }
                )
            }
            if (item.month_06 != $('#month_06' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 6,
                    price: $('#month_06' + index).val()
                }
                )
            } if (item.month_07 != $('#month_07' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 7,
                    price: $('#month_07' + index).val()
                }
                )
            } if (item.month_08 != $('#month_08' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 8,
                    price: $('#month_08' + index).val()
                }
                )
            } if (item.month_09 != $('#month_09' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 9,
                    price: $('#month_09' + index).val()
                }
                )
            } if (item.month_10 != $('#month_10' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 10,
                    price: $('#month_10' + index).val()
                }
                )
            } if (item.month_11 != $('#month_11' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 11,
                    price: $('#month_11' + index).val()
                }
                )
            } if (item.month_12 != $('#month_12' + index).val()) {
                param.push({
                    hour: item.hour,
                    electric_pressure: item.electric_pressure,
                    electonicfee_kind: item.electonicfee_kind,
                    price_kind: item.price_kind,
                    month: 12,
                    price: $('#month_12' + index).val()
                }
                )
            }

        })
        axios.put(process.env.REACT_APP_APISERVER + url, { param: param }, configHeader).then(result => {
            if (result.data.status === 1) {
                setCountdata("0")
                if ($('#price option:selected').attr("value3") === "10") {
                    getList();
                } else {
                    change3()
                }
                toggle();
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


    const change3 = (e) => {
        setCountdata("0")
        let price = $('#price').val();
        let electric_pressure = $('#price option:selected').attr("value2")
        let price_kind = $('#price option:selected').attr("value3")
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_report/selectChargePrice/" + price + "/" + electric_pressure + "/" + price_kind, configHeader).then(result => {
            setData(result.data.data);
        }).catch(err => {
            setModal(UTIL.api401chk(err));
        })
    }


    const setcount = () => {
        setCountdata("1")
    }

    const setcount1 = () => {
        setCountdata("0")
    }

    const toggle = () => {
        setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
        setModal('단가 정보를 ' + "수정" + '하시겠습니까?')
        setModal1(!modal);
    }
    return (
        <>

            <CRow>
                <CCol xs="12" lg="12">
                    <CRow>

                        <CCard id="listtable2" style={{ width: "100%", position: "relative" }}>
                            <CCardHeader>
                                충전기 단가관리


                                <div style={{ paddingBottom: "1px", float: "right" }}>
                                    <CButton block color="info" onClick={setcount1}>취소</CButton>

                                </div>

                                {countdata === "1" &&
                                    <div style={{ paddingBottom: "1px", float: "right", marginRight: "15px" }}>
                                        <CButton block color="info" onClick={toggle}>세부단가 저장</CButton>

                                    </div>
                                }

                                <div style={{ paddingBottom: "1px", float: "right", marginRight: "15px" }}>
                                    <CButton block color="info" onClick={setcount}>세부단가 수정</CButton>

                                </div>



                            </CCardHeader>
                            <CCardBody tyle={{ textAlign: "center" }} id="pricetable">
                                <form name="schform" id="schform" metghod="post">
                                    <div style={{ paddingBottom: "5px", float: "left" }}>
                                        <CInputGroup>
                                            <CInputGroupPrepend>
                                                <CInputGroupText> 충전기 단가 선택</CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CSelect custom name="select" id="price" onChange={e => change3(e)} name="price" >
                                                <option value="1" value2="0" value3="10"> 단가선택 </option>
                                                <option value="1" value2="0" value3="1" > 선택1저압 </option>
                                                <option value="1" value2="0" value3="2"> 선택2저압 </option>
                                                <option value="1" value2="0" value3="3" > 선택3저압 </option>
                                                <option value="1" value2="0" value3="4" > 선택4저압</option>
                                                <option  > -----------</option>
                                                <option value="1" value2="1" value3="1" > 선택1고압</option>
                                                <option value="1" value2="1" value3="2" > 선택2고압</option>
                                                <option value="1" value2="1" value3="3" > 선택3고압</option>
                                                <option value="1" value2="1" value3="4" > 선택4고압</option>
                                            </CSelect>


                                        </CInputGroup>
                                    </div>
                                </form>
                                <CDataTable
                                    items={data}
                                    fields={fields}
                                    striped
                                    sorter
                                    pagination
                                    itemsPerPage={pagesize}
                                    clickableRows

                                    // onRowClick={(item) => insertModal(item.electric_pressure, item.price_kind, item.hour)}
                                    scopedSlots={{
                                        '시간':
                                            (item, index) => (
                                                <td>

                                                    {item.hour}시
                                                </td>
                                            ), '1월':
                                            (item, index) => (
                                                <td>
                                                    {countdata === "0" && item.month_01}
                                                    {countdata === "1" && <CInput type="text" id={"month_01" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_01} />}

                                                </td>
                                            ), '2월':
                                            (item, index) => (
                                                <td >
                                                    {countdata === "0" && item.month_02}
                                                    {countdata === "1" && <CInput type="text" id={"month_02" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_02} />}
                                                </td>
                                            ), '3월':
                                            (item, index) => (
                                                <td >
                                                    {countdata === "0" && item.month_03}
                                                    {countdata === "1" && <CInput type="text" id={"month_03" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_03} />}
                                                </td>
                                            ), '4월':
                                            (item, index) => (
                                                <td>
                                                    {countdata === "0" && item.month_04}
                                                    {countdata === "1" && <CInput type="text" id={"month_04" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_04} />}
                                                </td>
                                            ), '5월':
                                            (item, index) => (
                                                <td >
                                                    {countdata === "0" && item.month_05}
                                                    {countdata === "1" && <CInput type="text" id={"month_05" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_05} />}
                                                </td>
                                            ), '6월':
                                            (item, index) => (
                                                <td>
                                                    {countdata === "0" && item.month_06}
                                                    {countdata === "1" && <CInput type="text" id={"month_06" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_06} />}
                                                </td>
                                            ), '7월':
                                            (item, index) => (
                                                <td>
                                                    {countdata === "0" && item.month_07}
                                                    {countdata === "1" && <CInput type="text" id={"month_07" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_07} />}
                                                </td>
                                            ), '8월':
                                            (item, index) => (
                                                <td>
                                                    {countdata === "0" && item.month_08}
                                                    {countdata === "1" && <CInput type="text" id={"month_08" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_08} />}
                                                </td>
                                            ), '9월':
                                            (item, index) => (
                                                <td>

                                                    {countdata === "0" && item.month_09}
                                                    {countdata === "1" && <CInput type="text" id={"month_09" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_09} />}
                                                </td>
                                            ), '10월':
                                            (item, index) => (
                                                <td>
                                                    {countdata === "0" && item.month_10}
                                                    {countdata === "1" && <CInput type="text" id={"month_10" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_10} />}
                                                </td>
                                            ), '11월':
                                            (item, index) => (
                                                <td >
                                                    {countdata === "0" && item.month_11}
                                                    {countdata === "1" && <CInput type="text" id={"month_11" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_11} />}
                                                </td>
                                            ), '12월':
                                            (item, index) => (
                                                <td>
                                                    {countdata === "0" && item.month_12}
                                                    {countdata === "1" && <CInput type="text" id={"month_12" + index} style={{ width: "60px", height: "30px", fontSize: "13px" }} name="hour" maxLength="6" defaultValue={item.month_12} />}
                                                </td>
                                            )
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </CRow>
                </CCol>
            </CRow >

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
        </>
    )
}

export default Vendor