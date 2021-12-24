import React, { useState, useEffect, useRef } from 'react'
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
  CPagination,
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
import MODAL from '../modals/Modals';
import GV from '../../globalSet'
import { isMobile } from 'react-device-detect';
import Moment from 'react-moment'

const defaultValue = [{ _id: "", vendorId: "", line_num: "", line_name: "" }];
const Chargerinfo = () => {

  // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  var fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '충전기ID', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '충전건개수', _classes: 'Tablefirst' }, { key: '모델명', _classes: 'Tablefirst' }, { key: '충전기 제조사', _classes: 'Tablefirst' }]
  if (isMobile) { fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '아이디', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '충전건개수', _classes: 'Tablefirst' }, { key: '충전기 제조사', _classes: 'Tablefirst' }] }
  var fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소', _classes: 'Tablefirst' }, { key: '충전기ID', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
  if (isMobile) { fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '아이디', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }, { key: '충전건개수', _classes: 'Tablefirst' }, { key: '충전기 제조사', _classes: 'Tablefirst' }] }
  const [cookies] = useCookies(['token']);  //Auth    
  const configHeader = { headers: { Authorization: `Bearer ${cookies.TocToken}` } } // axios 전송을 위한 헤더값 세팅
  const [warning, setModal] = useState("");    // 모달 팝업용
  const [pagesize, setPageSize] = useState(GV.chargerTablepagesize);
  const [fields, setFields] = useState(fields1)
  const [mode, setMode] = useState("alert");
  const [cpanyName, setCompanyName] = useState([]);
  const [modelName, setModelName] = useState([]);
  const socketUrl = process.env.WSSERVER;   // 웹소켓 서버 연결 설정
  const firmfields = [{ key: '펌웨어버전', _classes: 'Tablefirst' }, { key: '버전업데이트날짜', _classes: 'Tablefirst' }]
  const firmStatusfields = [{ key: '통신코드', _classes: 'Tablefirst' }, { key: '상태정보', _classes: 'Tablefirst' }, { key: '정보저장일', _classes: 'Tablefirst' }]
  const uploadFields = [{ key: '업로드파일명', _classes: 'Tablefirst' }, { key: '펌웨어버전', _classes: 'Tablefirst' }, { key: '파일등록일', _classes: 'Tablefirst' }, { key: '모델명', _classes: 'Tablefirst' }, { key: '버튼', _classes: 'Tablefirst' }]
  const failurefields = [{ key: '신고자', _classes: 'Tablefirst' }, { key: '발생 날짜', _classes: 'Tablefirst' }, { key: '증상', _classes: 'Tablefirst' }, { key: '조치사항', _classes: 'Tablefirst' }, , { key: '처리 날짜', _classes: 'Tablefirst' }]
  // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const moment = require('moment');
  const [detaildata, setDetailData] = useState(defaultValue);
  const [vendordata, setVendorData] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);

  const [manufacturerValue, setManufacturervalue] = useState("");
  const [modelNameValue, setModelNamevalue] = useState("");   // 사용자 추가시 벤더아이디 설정
  const [vendorIdvalue, setVendorIdvalue] = useState("");   // 사용자 추가시 벤더아이디 설정
  // 라이브 페이징을 위한 정의  START
  const [items, setItems] = useState([]);
  const [failure, setFailure] = useState([]);
  const [csdata1, setCsData1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csdata, setCsData] = useState([]);  // 소속업체 정의
  const [configData, setconfigData] = useState([]);  // 소속업체 
  const [connectorData, setconnectorData] = useState([]);  // 소속업체 정의
  const configfields = [{ key: 'Key', _classes: 'Tablefirst' }, { key: 'Value', _classes: 'Tablefirst' }, { key: '수정 삭제', _classes: 'Tablefirst' },]
  const [csIdvalue, setCsIdvalue] = useState("");
  const [firmdata, setFirmData] = useState([]);  // 소속업체 정의
  const [uploadFile, setUploadFile] = useState();
  const [selectedFile, setSelectedFile] = useState("");
  const [firmstatusdata, setFirmstatusdata] = useState("");   // 펌웨어 상태정보 리스트 출력용
  const [configset, setConfigSet] = useState([]);   //충전기 configuration
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  const [modal, setModal1] = useState(false);
  const [modal20, setModal20] = useState(false);
  const [modal12, setModal12] = useState(false);
  const [modal13, setModal13] = useState(false);
  const [configKey, setConfigKey] = useState("");
  const [configValue, setConfigValue] = useState("");
  const [countpage, setCountPage] = useState(25)


  useEffect(() => {
    if (userinfo.grade != "0") {
      ChargerStationList();
      chargerSelect();
    } else {
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + "0" + "/" + "0", configHeader).then(result => {
        if (result) {
          setItems(result.data.data.docs.slice(0, 15));
        }
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });
    }
  }, []);

  //무한 스크롤
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();
    if (scrollTop + clientHeight >= scrollHeight) {
      if (userinfo.grade === "0") {
        if (companyId === "0" && csId === "0") {
          setCountPage(countpage + 10)
          scrollList()
        } else {
          setCountPage(countpage + 10)
          scrollListSelect();
        }
      } else {
        setCountPage(countpage + 10)
        ChargerStationList();
        scrollListSelect();
      }
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


  // 사용자 리스트 호출 함수 
  const scrollList = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + "0" + "/" + "0", configHeader).then(result => {
      if (result) {
        setItems(result.data.data.docs.slice(0, countpage));
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  // 사용자 리스트 호출 함수 
  const getList = () => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + "0" + "/" + "0", configHeader).then(result => {
      if (result) {
        setItems(result.data.data.docs.slice(0, 15));

      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  //d운수사 리스트
  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
      setVendorData(result.data.data.docs)
    }).catch(err => {
      setModal(UTIL.api401chk(err))
    })
  }, [])


  //제조 업체 리스트
  useEffect(() => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/manufacturer", configHeader).then(result => {
      setManufacturer(result.data.data.docs);
    }).catch(err => {

    });
  }, [])



  // 운수사 상세정보 호출 함수
  const getDetail = (_id, csid, cpid) => {
    $("#insert").hide()
    $("#detail").show()
    $("#frmadd")[0].reset();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + _id, configHeader, configHeader).then(result => {
      if (result) {
        setconfigData([])
        setDetailData(result.data.data);
        setVendorIdvalue(result.data.data[0].companyId)
        csid = result.data.data[0].csId
        cpid = result.data.data[0].cpId
        setconfigData(result.data.data[0].configset)
        setFields(fields2);
        UTIL.writeani('open')

        // 상세정보 호출시 입력화면에 쓰기 및 애니메이션 처리  ---------


        // 펌웨어 이력 정보 호출하기  START  --------------------------------------------------------------------
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/firmware/" + csid + "-" + cpid, configHeader).then(resultfirm => {
          if (resultfirm) {

            setFirmData(resultfirm.data.data)
          }
        });
        getfirmwarelist(cpid)
        getFailurelist(cpid)
      } else {
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  const getfirmwarelist = (cpid) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/firmware/list/" + cpid, configHeader).then(resultfirm => {
      if (resultfirm) {
        setUploadFile(resultfirm.data.data)
      }
    });
  }


  const getFailurelist = (cpid) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/failurehistory/" + cpid + "/" + "0", configHeader).then(resultfirm => {
      if (resultfirm) {
        setFailure(resultfirm.data.data.docs)
      }
    });
  }


  //충전기 고장 기록 저장
  const insertFailure = async () => {
    let reporterdata = $('#failure [name="reporter"]').val();
    let symptomdata = $('#failure [name="symptom"]').val();
    let actiondata = $('#failure [name="action"]').val();
    let processingdata = $('#failure [name="processing"]').val();

    let failuredata = {
      companyId: detaildata[0].companyId,
      csId: detaildata[0].csId,
      cpId: detaildata[0].cpId,
      reporter: reporterdata,
      symptom: symptomdata,
      action: actiondata,
      processing: processingdata

    }

    axios.post(process.env.REACT_APP_APISERVER + "/api/pages_charger/failurehistory", failuredata, configHeader).then(result => {
      if (result.data.status === 1) {
        closemodal1()
        getFailurelist(detaildata[0].cpId)
      } else {
        if (result.data.status === 9) {
          closemodal1()
          getFailurelist(detaildata[0].cpId)
        } else {
          $("#txtmsg").text("등록실패")
          $("#btn_modal_save").hide();
        }

      }
    }).catch(err => {
      //setModal(UTIL.api401chk(err));
      $("#txtmsg").text("권한이 없습니다.[충전기정보]")
      $("#btn_modal_save").hide();
    })

  }




  const handleClick = async () => {
    let price = $('#price').val();
    let electric_pressure = $('#price option:selected').attr("value2")
    let price_kind = $('#price option:selected').attr("value3")
    let frmstrcsId = $('#frmadd [name="csId1"]').val();
    let frmstrcompanyId = $('#frmadd [name="companyId1"]').val();
    let frmstrcpId = $('#frmadd [name="cpId"]').val();
    let cppassword = $('#frmadd [name="cppassword"]').val();
    let frmstrconnectorNo = $('#frmadd [name="connectorNo"]').val();
    let frmstrmodelNo = $('#frmadd [name="modelNo"]').val();
    let frmstrmanufacturer = $('#frmadd [name="manufacturer"]').val();
    let frmstrdeleted = $('#frmadd [name="status"]').val();
    let frmstrfirmwareVersion = $('#frmadd [name="firmwareVersion"]').val();

    if (frmstrconnectorNo == 1) {
      setconnectorData(connectorData.push({ value: 1, status: "Operative" }))
    } else if (frmstrconnectorNo == 2) {
      setconnectorData(connectorData.push({ value: 1, status: "Operative" }, { value: 2, status: "Operative" }))
    } else if (frmstrconnectorNo == 3) {
      setconnectorData(connectorData.push({ value: 1, status: "Operative" }, { value: 2, status: "Operative" }, { value: 3, status: "Operative" }))
    } else if (frmstrconnectorNo == 4) {
      setconnectorData(connectorData.push({ value: 1, status: "Operative" }, { value: 2, status: "Operative" }, { value: 3, status: "Operative" }, { value: 4, status: "Operative" }))
    }

    let connectorId = connectorData

    let sendinfcreate = {
      companyId: frmstrcompanyId,
      cpId: frmstrcpId,
      csId: frmstrcsId,
      cppassword: cppassword,
      connectorNo: frmstrconnectorNo,
      connectorId: connectorId,
      modelNo: frmstrmodelNo,
      manufacturer: frmstrmanufacturer,
      firmwareVersion: frmstrfirmwareVersion,
      status: frmstrdeleted,
      pagesize: GV.chargerTablepagesize,
      // electonicfee_kind: price,
      // electric_pressure: electric_pressure,
      // price_kind: price_kind
    }

    let txt = ""
    let url = "/api/pages_charger/charger";

    if (frmstrcompanyId == "0") {
      alert("운수사 정보를 입력해주세요")
      toggle20()
      return false
    } else if (frmstrcsId == "0") {
      alert("충전소 정보를 입력해주세요")
      toggle20()
      return false
    } else if (frmstrcpId == "") {
      alert("충전기 ID 을 입력해주세요")
      toggle20()
      return false
    } else if (!frmstrconnectorNo) {
      alert("충전건 개수를 입력해주세요")
      toggle20()
      return false
    } else if (frmstrconnectorNo > 4) {
      alert("충전건 개수는 최대4개까지 등록가능합니다.")
      toggle20()
      return false
    } else if (cppassword == "") {
      alert("충전기 비밀번호를 입력해주세요")
      toggle20()
      return false
    } else {

      if ($('#frmadd [name="id"]').val()) {
        txt = "수정";
        url = "/api/pages_charger/charger/" + $('#frmadd [name="id"]').val();
        axios.put(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
          if (result.data.status === 1) {
            if (userinfo.grade === "0") {
              let companyId12 = $('#schform [name="companyId"]').val();
              setconnectorData([])
              if (companyId12 == 0) {
                setconnectorData([])
                getList();
                setFields(fields1);
                UTIL.writeani('close')
                toggle20()
              } else {
                setconnectorData([])
                setFields(fields1);
                UTIL.writeani('close')
                toggle20();
                change15();
              }
            } else {
              setconnectorData([])
              chargerSelect();
              UTIL.writeani('close')
              setFields(fields1);
              toggle20();
            }
          } else {
            if (result.data.status === 9) {
              setconnectorData([])
              if (userinfo.grade != "0") {
                ChargerStationList();
                chargerSelect();
                setFields(fields1);
              }
              $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
              $("#btn_modal_save").hide();
              UTIL.writeani('close')
              setFields(fields1);
            } else {
              $("#txtmsg").text("등록실패")
              $("#btn_modal_save").hide();
            }

          }
        }).catch(err => {
          $("#txtmsg").text("권한이 없습니다.[충전기정보]")
          $("#btn_modal_save").hide();
        })
      } else {
        txt = "등록";
        url = "/api/pages_charger/charger";
        axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {

          if (result.data.status === 1) {
            if (userinfo.grade === "0") {
              let companyId12 = $('#schform [name="companyId"]').val();
              setconnectorData([])
              if (companyId12 == 0) {
                getList();
                setFields(fields1);
                UTIL.writeani('close')
                setconnectorData([])
                toggle20()
              } else {
                setFields(fields1);
                UTIL.writeani('close')
                setconnectorData([])
                toggle20();
                change15();
              }
            } else {
              chargerSelect();
              UTIL.writeani('close')
              setFields(fields1);
              toggle20();
            }
          } else {
            if (result.data.status === 9) {
              if (userinfo.grade != "0") {
                ChargerStationList();
                chargerSelect();
                setconnectorData([])
                setFields(fields1);
              }
              $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
              $("#btn_modal_save").hide();
              UTIL.writeani('close')
              setFields(fields1);
            } else {
              $("#txtmsg").text("등록실패")
              $("#btn_modal_save").hide();
            }
          }
        }).catch(err => {
          $("#txtmsg").text("권한이 없습니다.[충전기정보]")
          $("#btn_modal_save").hide();
        })
      }
    }
  }

  const delClick = async () => {
    let frmstrcsId = $('#frmadd [name="csId1"]').val();

    axios.delete(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + $('#frmadd [name="id"]').val() + "/" + frmstrcsId, configHeader).then(result => {

      if (result.data.status === 1) {
        getList();
        $("#frmadd input").val("");
        $("#dateview").fadeOut();
        $("#dateviewbtn").fadeOut();
        setFields(fields1);
        UTIL.writeani('close')
        toggle20()
      } else {
        if (result.data.status === 9) {
          $("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
          $("#btn_modal_save").hide();
          setFields(fields1);
          UTIL.writeani('close')
          toggle20()
        } else {
          $("#txtmsg").text("등록실패")
          $("#btn_modal_save").hide();
          setFields(fields1);
          UTIL.writeani('close')
          toggle20()
        }
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const change15 = () => {
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();

    if (companyId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (csId === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + companyId + "/" + csId, configHeader).then(result => {
      setItems(result.data.data.docs);
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  const openmodal = () => {
    let txt = "";
    setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
    if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
    setModal('충전기 정보를 ' + txt + '하시겠습니까?')
    setModal20(!modal20);

  }

  const delmodal = () => {
    let txt = "삭제";
    setMode('del');
    setModal('충전기 정보를 ' + txt + '하시겠습니까?')
    setModal20(!modal20);
  }

  const closemodal = () => {
    setModal(false);
  }

  const closemodal1 = () => {
    setModal1(false);
  }


  // 입력폼 표시 애니메이션 처리
  const setTableOpen = () => {
    $("#detail").hide()
    $("#insert").show();
    $("#status1").hide()
    $("#dateviewbtn").fadeOut();
    setModal(false);
    $("#frmadd")[0].reset();
    setDetailData(defaultValue)
    setFields(fields2);
    UTIL.writeani('open')

  }


  const insertModal = (_id) => {
    $("#detail").hide()
    $("#insert").show();
    $("#status1").show()
    setModal(false);
    setFields(fields2);
    $("#frmadd")[0].reset();
    change10();
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + _id, configHeader).then(result => {
      setModelNamevalue(result.data.data[0].modelNo)
      setManufacturervalue(result.data.data[0].manufacturer)
      changeModelInsert(result.data.data[0].manufacturer)
      setDetailData(result.data.data);
      setVendorIdvalue(result.data.data[0].companyId)
      setCsIdvalue(result.data.data[0].csId)
      UTIL.writeani('open')
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  // 입력폼 닫기 애니메이션 처리
  const setTableClose = () => {
    setModal(false);
    setDetailData(defaultValue)
    UTIL.writeani('close')
    if (userinfo.grade != "0") {
      ChargerStationList();
    }
    setFields(fields1);

  }

  // 충전기 설정값 가져오기
  const ChargerGetCpConfig = (pid) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargergetconfig/select/" + pid, configHeader).then(result => {
      if (result) {
        alert("충전기 설정 정보 가져오기 성공")
        setconfigData(result.data.data[0].configset)
      } else {
        alert("충전기 설정을 가져오지 못했습니다")
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  const ChargerMqtt = (pid) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/charger/mqtt/list/" + pid, configHeader).then(result => {
      if (result.data.message == "Operation success") {
        ChargerGetCpConfig(pid)
      } else {
        setInterval(ChargerMqtt(pid), 10000)
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }

  // 충전기 설정값 가져오기
  const GetCpConfig = (pid, getkey) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargerconfig/select/" + pid + "/" + getkey, configHeader).then(result => {
      console.log("RESULT", result)
      if (result.data.data == "OK") {
        ChargerMqtt(pid)
      } else {
        alert("충전기 설정을 가져오지 못했습니다1111")
      }
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    });
  }


  // 충전기 설정값 설정하기
  const SetCpConfig = (pid, getkey) => {
    if (configData.length > 0) {
      let listdata = { pid: pid, configdata: configData, companyId: detaildata[0].companyId, csId: detaildata[0].csId, cpId: detaildata[0].cpId }  // 충전기 설정값 설정하기
      axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/chargerconfig", listdata, configHeader).then(result => {
        if (result) {
          alert("설정을 변경했습니다.")
        }
      }).catch(err => {
        setModal(UTIL.api401chk(err));
      });
    } else {
      setModal({ mode: true, msg: '설정된 충전기 정보가 없습니다.', color: "danger" });
    }
  }


  const goWs = () => {
    let socket = new WebSocket(process.env.WSSERVER + "/ocpp/PMGROW-ADM-102");
    socket.onopen = function () {
      ("connection server");
      sendMsg()
    };

    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);

    };

    const sendMsg = () => {
      socket.send(
        JSON.stringify({
          admintype: "adminsend",
          clientid: "CSTL-P480-100",
          msg: [3, 12123132, "GetConfiguration", { "key": ["currentlimit"] }]
        })
      );
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log("[close] 커넥션 종료됨");
      } else {
        console.log("[close] 커넥션 error");
      }
    };
  }

  const change13 = (e) => {
    setVendorIdvalue(e.target.value)
    let listdata = { status: 1, pagesize: pagesize, companyId: e.target.value }  // 리스트 출력 기본 세팅값 정의
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
      setCsData1(result.data.data)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  // 소속업체 선택시 소속 충전소 정보 호출하기
  const change10 = (e) => {
    let listdata = { status: 1, pagesize: pagesize, companyId: vendorIdvalue }  // 리스트 출력 기본 세팅값 정의
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + vendorIdvalue, configHeader).then(result => {
      setCsData1(result.data.data)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }

  //벤더,모니터 권한 유저 충전소 select
  const ChargerStationList = (e) => {
    if (userinfo.grade === "0") {
      setVendorIdvalue(e.target.value)
      axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
        setCsData(result.data.data)
        chargerSelect(e)

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


  const changeModel = (e) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/chargerModel/" + e.target.value, configHeader).then(result => {
      setModelName(result.data.data.docs)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }


  const changeModelInsert = (e) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/chargerModel/" + e, configHeader).then(result => {
      setModelName(result.data.data.docs)
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }



  const toggle = () => {
    $("#failure")[0].reset();
    setModal1(!modal);
  }



  const toggle20 = () => {
    setModal20(!modal20);
  }


  const toggle1 = () => {
    $("#config")[0].reset();
    setModal12(!modal12);
  }


  //csId 값 저장
  const change2 = (e) => {
    setCsIdvalue(e.target.value)
  }

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  //s3 파일 업로드하기 위한 전처리
  const handleFileClick = async () => {
    setMode(false);
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

    let purchaseDay = year + '' + month + '' + day + '' + hour + '' + min + '' + sec
    let file = selectedFile;
    if (file) {
      var arSplitFileName = file.name.split(".");   // 파일명을 다시 "." 로 나누면 파일이름과 확장자로 나뉜다
      var sFileName = arSplitFileName[0];         // 파일이름
      var sFileExtension = arSplitFileName.reverse()[0];     // 확장자
      var fv = $("#newfirmwareVersion").val();


      if (fv === "") {
        setModal(UTIL.modalopen('신규로 업로드 되는 펌웨어의 버전을 입력하세요', 'danger'))
        //alert('신규로 업로드 되는 펌웨어의 버전을 입력하세요');
      } else {
        $("#s3btn").text("업로드 진행중")
        var newFileName = $("#s3csid").val() + "-" + $("#s3cpid").val() + "-V-" + fv + "." + sFileExtension;
        let listdata = { companyId: $("#s3companyid").val(), csId: $("#s3csid").val(), cpId: $("#s3cpid").val(), modelNo: $("#modelNo").val(), manufacturer: $("#manufacturer").val(), firmwareVersion: fv, filename: newFileName }  // 리스트 출력 기본 세팅값 정의 
        axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/firmware/insert", listdata, configHeader).then(result => {
          if (result.data.status > 1) {
            setModal(UTIL.modalopen(result.data.message, 'danger'))
            $("#s3btn").text("파일업로드하기")
          } else {
            var listdata = { filekey: newFileName }
            axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/S3uploadurl", listdata, configHeader).then(async result => {
              if (result.data.status === 1) {
                payload(result.data.message, file, newFileName)
              } else {
                $("#s3btn").text("업로드 실패")
                //setModal(UTIL.modalopen('업로드실패', 'danger'))
                alert('업로드 실패')
                setTimeout($("#s3btn").text("파일업로드하기"), 10000)
              }
            }).catch(err => {
              setModal(UTIL.api401chk(err));
            })
          }
        }).catch(err => {
          setModal(UTIL.api401chk(err));
        })
      }
    } else {
      setModal(UTIL.modalopen('업로드할 파일을 선택하세요', 'danger'))
    }
  }


  //S3 업로드
  const payload = async (url, file, newFileName) => {
    $("#s3btn").text("파일업로드하기")
    await fetch(url, {
      method: "PUT", body: file, headers: {
        "Content-Type": file.type
      }
    }).then(res => {
      alert('업로드 성공')
      getfirmwarelist(detaildata[0].cpId)
    })
      .catch(error => {
        console.log(error)
        var listdata = { filekey: newFileName }
        axios.delete(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/firmware/delete/" + newFileName).then(async result => {
          //setModal(UTIL.modalopen('업로드 실패', 'danger'))    
        }).catch(err => {
          //setModal(UTIL.modalopen('업로드 실패', 'danger'))   
        })
        alert('업로드 실패')
      });

  }


  // 충전기 펌웨어 업데이터 명령하기 --------------------------------------------------------------------------------------------
  const exeUpdate = (filename) => {
    var listdata = { filekey: filename, pid: detaildata[0].pid }
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/getdownloadurl", listdata, configHeader).then(result => {
      console.log("Result", result)
      if (result) {
        setInterval(getFirmwareStatusList, 5000)
      } else {
        alert(filename + '펌웨어의 다운로드 URL 생성 실패')
      }
    });

  };

  //펌웨어 다운로드 상태 확인
  const getFirmwareStatusList = () => {
    var pid = $("#s3csid").val() + "-" + $("#s3cpid").val();
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_ccnf/firmware/status/" + pid, configHeader).then(result => {
      setFirmstatusdata(result.data.data)
    }).catch(err => {

    })
    //
  }


  //충전기 검색 기능
  const chargerSelect = (e) => {
    if (userinfo.grade === "0") {
      setCsIdvalue(e.target.value)
    }

    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();

    if (companyId === "") {
      alert('원활할 데이터 검색을 위해 충전소를 반드시 선택해주세요');
      return;
    }

    if (csId === "") {
      alert('원활할 데이터 검색을 위해 검색 시작일과 종료일을 반드시 선택해주세요');
      return;
    }
    UTIL.writeani('close')

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + companyId + "/" + csId, configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, 15));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }


  //설정 정보 삭제
  const configDeleted = (key) => {
    setconfigData(configData.filter(configData => configData.key !== key));
  }

  //충전기 설정 정보 업데이트
  const configUpdate = () => {
    let key = $('#configUpdate [name="key"]').val();
    let value = $('#configUpdate [name="value"]').val();
    setconfigData(configData.map(
      configData => key === configData.key
        ? { key: key, value: value } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
        : configData // 기존의 값을 그대로 유지
    ))
    toggle2()
  }


  //충전기 설정 정보 저장
  const configInsert = () => {
    let key = $('#config [name="key"]').val();
    let value = $('#config [name="value"]').val();
    var chk = true
    if (configData.length === 0) {
      setconfigData(configData.concat({ key: key, value: value }))
    } else {
      configData.map((item, index) => {
        if (item.key === key) {
          chk = false
        }
      })
      if (chk === false) {
        alert("이미 존재하는 key 값 입니다")
        return false
      } else {
        setconfigData(configData.concat({ key: key, value: value }))
      }
    }
    toggle1()
  }



  const toggle2 = (key, value) => {
    setConfigKey(key)
    setConfigValue(value)
    setModal13(!modal13);
  }



  //검색한 상태에서 무흔 스크롤
  const scrollListSelect = (e) => {
    let companyId = $('#schform [name="companyId"]').val();
    let csId = $('#schform [name="csId"]').val();

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages_charger/charger/" + companyId + "/" + csId, configHeader).then(result => {
      setItems(result.data.data.docs.slice(0, countpage));
      setLoading(false);
    }).catch(err => {
      setModal(UTIL.api401chk(err));
    })
  }



  return (
    <>
      <CModal
        show={modal20}
        onClose={toggle20}
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
          {mode === "del" && <CButton color="primary" onClick={delClick} >삭제 </CButton>}
          <CButton
            color="secondary"
            onClick={toggle20}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol>
          <MODAL data={warning} fnc={closemodal} mode={mode} handleClick={handleClick} delClick={delClick}></MODAL>
          <CRow>

            <CCard id="listtable2" style={{ width: "100%", position: "relative" }}>
              <CCardHeader>
                충전기 리스트
                <div style={{ paddingBottom: "5px", float: "right" }}>
                  <CButton block color="info" onClick={setTableOpen}>충전기 등록</CButton>
                </div>


              </CCardHeader>
              <CCardBody>
                {userinfo.grade === "0" &&
                  <form name="schform" id="schform" metghod="post">
                    <div style={{ paddingBottom: "5px", float: "left" }}>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="companyId" defaultValue={vendorIdvalue} onChange={e => ChargerStationList(e)} name="companyId" >
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
                        <CSelect custom name="csId" id="csId" defaultValue={csIdvalue} onChange={e => chargerSelect(e)}>
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
                        <CSelect custom name="csId" id="csId" defaultValue={csIdvalue} onChange={e => chargerSelect(e)}>
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
                }


                <CDataTable
                  items={items}
                  fields={fields}
                  striped
                  sorter
                  pagination
                  itemsPerPage={pagesize}
                  clickableRows
                  onRowClick={(item) => getDetail(item._id, item.csId, item.cpId)}
                  scopedSlots={{
                    '운수사':
                      (item) => (
                        <td>
                          {
                            item.companyname.map((item, index) => {
                              return (
                                <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.companyName}</CBadge>
                              )
                            })
                          }
                        </td>
                      ),
                    '충전소':
                      (item) => (
                        <td>
                          {
                            item.csname.map((item, index) => {
                              return (
                                <CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.csName}</CBadge>
                              )
                            })
                          }
                        </td>
                      ),
                    '충전기ID':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" style={{ padding: "5px", fontSize: "13px" }}>{item.cpId}</CBadge>
                        </td>
                      ),
                    '상태':
                      (item) => (
                        <td>
                          {item.status === "Disconnected" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>접속 끊김</CBadge>}
                          {item.status === "Available" && <CBadge className="mr-1" color="success" style={{ padding: "5px", fontSize: "13px" }}>대기중</CBadge>}
                          {item.status === "Preparing" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전대기중</CBadge>}
                          {item.status === "Charging" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전중</CBadge>}
                          {item.status === "Finishing" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>고장</CBadge>}
                          {item.status === "SuspendedEVSE" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>허용하지 않는 상태</CBadge>}
                          {item.status === "SuspendedEV" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전 전력 못받음</CBadge>}
                          {item.status === "Reserved" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전예약 명령 이미 있음</CBadge>}
                          {item.status === "Unavailable" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>커넥터 사용할수 없음</CBadge>}
                          {item.status === "Faulted" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>오류로 충전이 불가능</CBadge>}
                          {item.status === "Stop" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>사용안함</CBadge>}
                          {item.status === "Delete" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>삭제</CBadge>}

                        </td>
                      ),
                    '충전건개수':
                      (item) => (
                        <td>
                          <CBadge className="mr-1" color="danger" style={{ padding: "5px", fontSize: "13px" }}>{item.connectorNo}개</CBadge>
                        </td>
                      ),
                    '모델명':
                      (item) => (
                        <td>{item.modelNo}</td>
                      ),
                    '충전기 제조사':
                      (item) => (
                        <td>{item.manufacturer}</td>
                      ),
                  }}
                />

              </CCardBody>
            </CCard>





            <CCard id="writefrm" style={{ display: "none", width: "45%", position: "relative" }}>
              <div id="insert" style={{ display: "none" }}>
                <CCardHeader style={{ backgroundColor: "green", color: "#fff", fontWeight: "bold" }}>
                  충전기 정보 입력
                </CCardHeader>
                <CCardBody>
                  <CForm action="" name="frmadd" id="frmadd" method="post">
                    <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                    {cpanyName === null && <input type="hidden" name="cpanyName" id="cpanyName" defaultValue={detaildata[0].companyName} />}
                    {cpanyName != null && <input type="hidden" name="cpanyName" id="cpanyName" value={cpanyName} />}
                    {userinfo.grade === "0" &&
                      <CFormGroup>
                        <CInputGroup>
                          <CInputGroupPrepend>
                            <CInputGroupText> *운수사</CInputGroupText>
                          </CInputGroupPrepend>
                          <CSelect custom name="select" id="companyId" value={detaildata[0].companyId} onChange={e => change13(e)} name="companyId1" disabled={detaildata[0].companyId}>
                            <option value="0" disabled={detaildata[0].companyId}> ::: 선택하세요 :::</option>
                            {
                              vendordata.map((item, index) => {
                                var a = detaildata[0].companyId === item.companyId ? ' selected' : ''
                                return (
                                  <option value={item.companyId}>{item.companyName}</option>
                                )
                              })
                            }
                          </CSelect>
                          &nbsp; &nbsp; &nbsp;
                          <CInputGroupPrepend>
                            <CInputGroupText> *충전소</CInputGroupText>
                          </CInputGroupPrepend>
                          <CSelect custom name="csId1" id="csId" value={csIdvalue} onChange={e => change2(e)} disabled={detaildata[0].csId}>
                            <option value="0" disabled={detaildata[0].csId}>::: 선택하세요::: </option>
                            {
                              csdata1.map((item, index) => {
                                return (
                                  <option value={item.csId}>[{item.companyId}]- {item.csName}</option>
                                )
                              })
                            }
                          </CSelect>
                        </CInputGroup>
                      </CFormGroup>
                    }


                    {userinfo.grade === "2" &&
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> *운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="companyId" value={userinfo.vendorid} onChange={e => ChargerStationList(e)} name="companyId1" disabled="disabled">
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
                        <CInputGroupPrepend>
                          <CInputGroupText> *충전소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="csId1" id="csId" value={csIdvalue} onChange={e => change2(e)}>
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


                    }

                    {userinfo.grade === "3" &&

                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> *운수사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="companyId" value={userinfo.vendorid} name="companyId1" disabled="disabled">
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
                        <CInputGroupPrepend>
                          <CInputGroupText> *충전소</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="csId1" id="csId" value={userinfo.csid} disabled="disabled">
                          <option value="0" disabled="disabled"> ::: 선택하세요 :::</option>
                          {
                            csdata.map((item, index) => {
                              return (
                                <option value={item.csId}>[ {item.companyId} ] - {item.csName}</option>
                              )
                            })
                          }
                        </CSelect>
                      </CInputGroup>

                    }

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> *충전기ID</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" readOnly={detaildata[0].cpId} id="cpId" name="cpId" defaultValue={detaildata[0].cpId} placeholder="" />
                        &nbsp; &nbsp; &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>*충전건 개수</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="number" id="connectorNo" name="connectorNo" maxLength="4" defaultValue={detaildata[0].connectorNo} placeholder="" />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>제조사</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="manufacturer" id="manufacturer" value={manufacturerValue} onChange={e => changeModel(e)} name="manufacturer">
                          <option value="0" >::: 선택하세요 :::</option>
                          {
                            manufacturer.map((item, index) => {
                              return (
                                <option value={item.manufacturerName}>{item.manufacturerName}</option>
                              )
                            })
                          }
                        </CSelect>
                        &nbsp; &nbsp; &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText> 모델명</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="modelNo" id="modelNo" value={modelNameValue} >
                          <option value="0" >::: 선택하세요 :::</option>
                          {
                            modelName.map((item, index) => {
                              return (
                                <option value={item.modelNo}>{item.modelNo}</option>
                              )
                            })
                          }
                        </CSelect>
                      </CInputGroup>
                    </CFormGroup>

                    {/* <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 충전기 단가 선택</CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect custom name="select" id="price" name="price" >
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
                    </CFormGroup> */}

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>*비밀번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="cppassword" name="cppassword" defaultValue={detaildata[0].cppassword} placeholder="" />
                      </CInputGroup>
                    </CFormGroup>

                    <div id="status1" style={{ display: "none" }}>
                      <CFormGroup>
                        <CInputGroup>
                          <CInputGroupPrepend>
                            <CInputGroupText>충전기 상태</CInputGroupText>
                          </CInputGroupPrepend>
                          <CSelect custom name="deleted" id="deleted" name="status">
                            <option value="Available"> 대기중 </option>
                            <option value="Stop"> 사용안함 </option>
                            <option value="Delete"> 삭제 </option>
                          </CSelect>


                        </CInputGroup>
                      </CFormGroup>
                    </div>

                    <CFormGroup className="form-actions">
                      <CButton type="button" onClick={openmodal} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
                      <CButton id="dateviewbtn" style={{ display: "none" }} type="button" onClick={delmodal} size="bg" color="danger" style={{ width: "100px", marginLeft: "10px" }}>삭제</CButton>
                      <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                    </CFormGroup>
                  </CForm>
                </CCardBody>

              </div>


              <div id="detail" style={{ display: "none" }}>
                <CCardHeader style={{ fontWeight: "bold" }}>
                  충전기 상세 정보
                </CCardHeader>
                <CCardBody>

                  <input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
                  {cpanyName === null && <input type="hidden" name="cpanyName" id="cpanyName" defaultValue={detaildata[0].companyName} />}
                  {cpanyName != null && <input type="hidden" name="cpanyName" id="cpanyName" value={cpanyName} />}


                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 운수사</CInputGroupText>
                      </CInputGroupPrepend>

                      <CInput type="text" id="cpId" name="cpId" defaultValue={detaildata[0].companyId} placeholder="" />
                      &nbsp; &nbsp; &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 충전소</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="cpId" name="cpId" defaultValue={detaildata[0].csId} placeholder="" />
                    </CInputGroup>
                  </CFormGroup>





                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 충전기ID</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="cpId" name="cpId" defaultValue={detaildata[0].cpId} placeholder="" />
                      &nbsp; &nbsp; &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 충전건 개수</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="number" id="connectorNo" name="connectorNo" Readonly defaultValue={detaildata[0].connectorNo} placeholder="" />
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText> 모델명</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" id="modelNo" name="modelNo" Readonly maxLength="30" defaultValue={detaildata[0].modelNo} placeholder="" />
                      &nbsp; &nbsp; &nbsp;
                      <CInputGroupPrepend>
                        <CInputGroupText> 제조사</CInputGroupText>
                      </CInputGroupPrepend>

                      <CInput type="text" id="manufacturer" name="manufacturer" Readonly maxLength="50" defaultValue={detaildata[0].manufacturer} placeholder="" />
                    </CInputGroup>
                  </CFormGroup>



                  {/* 
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>충전기 단가</CInputGroupText>
                      </CInputGroupPrepend>
                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 0 && detaildata[0].price_kind === 1 && <CInput type="text" defaultValue="선택1저압" placeholder="" />}
                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 0 && detaildata[0].price_kind === 2 && <CInput type="text" defaultValue="선택2저압" placeholder="" />}
                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 0 && detaildata[0].price_kind === 3 && <CInput type="text" defaultValue="선택3저압" placeholder="" />}
                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 0 && detaildata[0].price_kind === 4 && <CInput type="text" defaultValue="선택4저압" placeholder="" />}

                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 1 && detaildata[0].price_kind === 1 && <CInput type="text" defaultValue="선택1고압" placeholder="" />}
                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 1 && detaildata[0].price_kind === 2 && <CInput type="text" defaultValue="선택2고압" placeholder="" />}
                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 1 && detaildata[0].price_kind === 3 && <CInput type="text" defaultValue="선택3고압" placeholder="" />}
                      {detaildata[0].electonicfee_kind === 1 && detaildata[0].electric_pressure === 1 && detaildata[0].price_kind === 4 && <CInput type="text" defaultValue="선택4고압" placeholder="" />}

                    </CInputGroup>
                  </CFormGroup> */}




                </CCardBody>
                {/* 펌웨어 이력*/}

                <CCard id="listtable10">

                  <CCardHeader style={{ fontWeight: "bold" }}>
                    충전기 접속 정보
                  </CCardHeader>
                  <CCardBody>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>접속용ID</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="cpId" name="cpId" defaultValue={detaildata[0].pid} placeholder="" />
                        &nbsp; &nbsp; &nbsp;
                        <CInputGroupPrepend>
                          <CInputGroupText>비밀번호</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="cppassword" name="cppassword" defaultValue={detaildata[0].cppassword} placeholder="" />
                      </CInputGroup>
                    </CFormGroup>

                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 충전기현재상태</CInputGroupText>
                        </CInputGroupPrepend>
                        {detaildata[0].status === "Disconnected" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>접속 끊김</CBadge>}
                        {detaildata[0].status === "Available" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>대기중</CBadge>}
                        {detaildata[0].status === "Preparing" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전대기중</CBadge>}
                        {detaildata[0].status === "Charging" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전중</CBadge>}
                        {detaildata[0].status === "Finishing" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>고장</CBadge>}
                        {detaildata[0].status === "SuspendedEVSE" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>허용하지 않는 상태</CBadge>}
                        {detaildata[0].status === "SuspendedEV" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전 전력 못받음</CBadge>}
                        {detaildata[0].status === "Reserved" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>충전예약 명령 이미 있음</CBadge>}
                        {detaildata[0].status === "Unavailable" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>커넥터 사용할수 없음</CBadge>}
                        {detaildata[0].status === "Faulted" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>오류로 충전이 불가능</CBadge>}
                        {detaildata[0].status === "Stop" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>사용안함</CBadge>}
                        {detaildata[0].status === "Delete" && <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>삭제</CBadge>}
                      </CInputGroup>
                    </CFormGroup>
                    <CFormGroup className="form-actions">
                      <CButton type="button" onClick={() => insertModal(detaildata[0]._id)} size="bg" color="success" style={{ width: "100px" }}>수정</CButton>
                      <CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
                    </CFormGroup>

                  </CCardBody>

                </CCard>
                <br></br>
                <br></br>

                <CCard id="cofingdata" name="cofingdata">

                  <CCardHeader style={{ fontWeight: "bold" }}>
                    충전기 설정
                    <div style={{ float: "right" }}>
                      {configset.currentlimit === undefined ? <CButton type="button" onClick={() => GetCpConfig(detaildata[0].pid, 'currentlimit')} id="btn_getcfg" size="bg" color="danger" style={{ width: "170px" }}>현재설정값 가져오기</CButton> : <CInput type="text" id="currentlimit" name="currentlimit" defaultValue={configset.currentlimit} maxLength="5" placeholder="ex)100, 101, 102" />}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <CButton type="button" onClick={() => SetCpConfig(detaildata[0].pid, JSON.stringify(detaildata[0].configset))} id="btn_getcfg" size="bg" color="danger" style={{ width: "170px" }}>설정값 변경하기</CButton>
                    </div>

                  </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      items={configData}
                      fields={configfields}
                      scopedSlots={{

                        'Key':
                          (item) => (
                            <td>
                              <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.key}</CBadge>
                            </td>
                          ),
                        'Value':
                          (item) => (
                            <td>
                              {item.value}
                            </td>
                          ),
                        '수정 삭제':
                          (item) => (
                            <td>
                              <CButton type="button" onClick={() => toggle2(item.key, item.value)} size="sm" color="danger" >수정</CButton>
                              &nbsp;&nbsp;&nbsp;
                              <CButton type="button" onClick={() => configDeleted(item.key)} size="sm" color="danger">삭제</CButton>
                            </td>
                          ),

                      }}
                    />

                    <div style={{ float: "right" }}>
                      <CButton type="button" onClick={toggle1} id="btn_getcfg" size="bg" color="danger" style={{ width: "170px" }}>추가</CButton>
                    </div>
                  </CCardBody>

                </CCard>
                <br></br>
                <CCard id="listtable4">
                  <CCardHeader style={{ fontWeight: "bold" }}>
                    FIRMWARE 업데이트 이력

                  </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      items={firmdata}
                      fields={firmfields}
                      scopedSlots={{

                        '펌웨어버전':
                          (item) => (
                            <td>
                              <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.firmwareVersion}</CBadge>
                            </td>
                          ),
                        '버전업데이트날짜':
                          (item) => (
                            <td><Moment local format="YYYY-MM-DD  HH:mm">{item.localtime}</Moment></td>
                          ),

                      }}
                    />
                  </CCardBody>
                </CCard>

                <br></br>

                <CCard id="listtable3">
                  <CCardHeader style={{ fontWeight: "bold" }}>
                    Firmware 파일업로드

                  </CCardHeader>
                  <CCardBody>

                    <iframe src="" name="frmiframe" style={{ width: "0px", height: "0px", border: "0px" }}></iframe>
                    {/* <CForm id="upfrm" name="upfrm" target="frmiframe" method="post"> */}
                    <input type="hidden" name="s3companyid" id="s3companyid" defaultValue={detaildata[0].companyId} />
                    <input type="hidden" name="s3csid" id="s3csid" defaultValue={detaildata[0].csId} />
                    <input type="hidden" name="s3cpid" id="s3cpid" defaultValue={detaildata[0].cpId} />
                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText> 신규 펌웨어 버전</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="newfirmwareVersion" name="newfirmwareVersion" Readonly maxLength="50" placeholder="" />
                        &nbsp;
                        <CInput type="file" size="bg" style={{ width: "155px" }} onChange={handleFileInput} />
                        <CButton type="button" onClick={handleFileClick} size="bg" color="success" id="s3btn" style={{ width: "130px" }}>파일업로드하기</CButton>
                      </CInputGroup>
                    </CFormGroup>

                    <CDataTable
                      items={uploadFile}
                      fields={uploadFields}
                      scopedSlots={{

                        '업로드파일명':
                          (item) => (
                            <td>{item.filename}</td>
                          ),
                        '펌웨어버전':
                          (item) => (
                            <td>
                              <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.firmwareVersion}</CBadge>
                            </td>
                          ),
                        '파일등록일':
                          (item) => (
                            <td><Moment local format="YYYY-MM-DD  HH:mm">{item.localtime}</Moment></td>
                          ),
                        '모델명':
                          (item) => (
                            <td>{item.modelNo}</td>
                          ),
                        '버튼':
                          (item) => (
                            <td> <CButton type="button" onClick={() => exeUpdate(item.filename)} size="sm" color="danger" id="s3btn" style={{ width: "100px" }}>업데이트시작</CButton></td>
                          )

                      }}
                    />
                    {/* </CForm> */}
                  </CCardBody>
                </CCard>

                <br></br>
                {/* 펌웨어  진행 상태이력*/}
                <CCard id="listtable5" >
                  <CCardHeader style={{ fontWeight: "bold" }}>
                    FIRMWARE 진행 상태 이력

                  </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      items={firmstatusdata}
                      fields={firmStatusfields}
                      scopedSlots={{

                        '통신코드':
                          (item) => (
                            <td>
                              <CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.pid}</CBadge>
                            </td>
                          ),
                        '상태정보':
                          (item) => (
                            <td>{item.status}</td>
                          ),
                        '정보저장일':
                          (item) => (
                            <td><Moment local format="YYYY-MM-DD  HH:mm">{item.localtime}</Moment></td>
                          ),

                      }}
                    />
                  </CCardBody>
                </CCard>
                <br></br>

                <CCard id="listtable5" >
                  <CCardHeader style={{ fontWeight: "bold" }}>
                    고장 이력
                    <div style={{ float: "right" }}>
                      <CButton type="button" onClick={toggle} size="sm" color="danger" id="s3btn" style={{ width: "100px" }}>고장이력 등록</CButton>
                    </div>

                  </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      items={failure}
                      fields={failurefields}
                      scopedSlots={{

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
                            <td><Moment local format="YYYY-MM-DD  HH:mm">{item.processing}</Moment></td>
                          ),

                      }}
                    />
                  </CCardBody>

                </CCard>
              </div>
            </CCard>

          </CRow>

        </CCol>
      </CRow >

      <CModal
        show={modal13}
        onClose={toggle2}
      >
        <CModalHeader closeButton>충전기 설정 정보 수정</CModalHeader>
        <CModalBody>
          <CForm action="" name="configUpdate" id="configUpdate" method="post">
            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>Key</CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="text" id="key" name="key" defaultValue={configKey} readOnly />
              </CInputGroup>
            </CFormGroup>

            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>Value</CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="text" id="value" name="value" defaultValue={configValue} />
              </CInputGroup>
            </CFormGroup>
          </CForm>

        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={configUpdate} >수정 </CButton>{' '}
          <CButton
            color="secondary"
            onClick={toggle2}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>




      <CModal
        show={modal12}
        onClose={toggle1}
      >
        <CModalHeader closeButton>충전기 설정 정보 저장</CModalHeader>
        <CModalBody>
          <CForm action="" name="config" id="config" method="post">
            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>Key</CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="text" id="key" name="key" />
              </CInputGroup>
            </CFormGroup>

            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>Value</CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="text" id="value" name="value" />
              </CInputGroup>
            </CFormGroup>
          </CForm>

        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={configInsert} >저장 </CButton>{' '}
          <CButton
            color="secondary"
            onClick={toggle1}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>


      <CModal
        show={modal}
        onClose={toggle}
      >
        <CModalHeader closeButton>고장 이력 등록</CModalHeader>
        <CModalBody>
          <CForm action="" name="failure" id="failure" method="post">
            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText> 신고자 </CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="text" id="reporter" name="reporter" placeholder="신고자" defaultValue={detaildata[0].reporter} />
              </CInputGroup>
            </CFormGroup>

            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>증상</CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="text" id="symptom" name="symptom" defaultValue={detaildata[0].symptom} />
              </CInputGroup>
            </CFormGroup>

            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText> 조치 사항</CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="text" id="action" name="action" defaultValue={detaildata[0].action} placeholder="조치 사항" />
              </CInputGroup>
            </CFormGroup>

            <CFormGroup>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>처리 날짜</CInputGroupText>
                </CInputGroupPrepend>
                <CInput type="date" id="processing" name="processing" defaultValue={detaildata[0].processing} />
              </CInputGroup>
            </CFormGroup>


          </CForm>

        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={insertFailure} >저장 </CButton>{' '}
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Chargerinfo