import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from '@coreui/react'


const Modals = (props) => {

  const [modal, setModal] = useState(true)
  const [large, setLarge] = useState(false)
  const [small, setSmall] = useState(false)
  const [primary, setPrimary] = useState(false)
  const [success, setSuccess] = useState(false)
  const [warning, setWarning] = useState(false)
  const [danger, setDanger] = useState(false)
  const [info, setInfo] = useState(false)
  const [ermsg, setErmsg] = useState("Error !!")
  useEffect(() => {
    if (props.data.mode === true) {
      setWarning(!warning);
    } else {
      setWarning(warning);
    }
    setErmsg("<div style='padding-top:20px;'><span>" + props.data.msg + "</span></div>")
  }, [props]);

  const setClose = () => {
    props.fnc(false);
    setWarning(!warning);
  }

  return (
    <CModal
      show={warning}
      onClose={() => setWarning(!warning)}
      color={props.data.color}
    >
      <CModalHeader closeButton>
        <CModalTitle>TOC System POPUP</CModalTitle>
      </CModalHeader>
      <CModalBody id="txtmsg" style={{ textAlign: 'center', paddingTop: "30px", paddingBottom: "30px" }} dangerouslySetInnerHTML={{ __html: ermsg }}>
      </CModalBody>
      <CModalFooter>
        {props.mode === "save" && <CButton id="btn_modal_save" color="warning" onClick={() => props.handleClick()}>저장</CButton>}
        {props.mode === "del" && <CButton id="btn_modal_del" color="warning" onClick={() => props.delClick()}>삭제</CButton>}
        <CButton color="secondary" onClick={() => setClose()}>닫기</CButton>
      </CModalFooter>
    </CModal>

  )
}

export default Modals