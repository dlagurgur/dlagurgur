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
import moment from 'moment';

const defaultValue = [{ _id: "", vendorId: "", line_num: "", line_name: "" }];
const Lineinfo = () => {
	// 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	const fields1 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소(차고지)', _classes: 'Tablefirst' }, { key: '카드번호', _classes: 'Tablefirst' }, { key: '차량번호', _classes: 'Tablefirst' }, { key: '카드 유효 기간', _classes: 'Tablefirst' }, { key: '등록일', _classes: 'Tablefirst' }, { key: '상태', _classes: 'Tablefirst' }]
	const fields3 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소(차고지)', _classes: 'Tablefirst' }, { key: '카드번호', _classes: 'Tablefirst' }, { key: '차량번호', _classes: 'Tablefirst' }, { key: '등록일', _classes: 'Tablefirst' }]
	if (isMobile) { fields1 = [{ key: '소속충전소', _classes: 'Tablefirst' }, { key: '노선번호', _classes: 'Tablefirst' }, { key: '운행도시', _classes: 'Tablefirst' }] }
	const fields2 = [{ key: '운수사', _classes: 'Tablefirst' }, { key: '충전소(차고지)', _classes: 'Tablefirst' }, { key: '카드번호', _classes: 'Tablefirst' }]
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
	const [pages, setPages] = useState(5);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [tableFilterValue, setTableFilterValue] = useState("");
	const [sorterValue, setSorterValue] = useState();
	const [countpage, setCountPage] = useState(25)
	const [userinfo] = useState(UTIL.getUserInfo(cookies))
	const [modal, setModal1] = useState(false);
	const [ExpireDateTime, setExpireDateTime] = useState("");

	// 라이브 페이징을 위한 정의  END


	useEffect(() => {
		getList()

	}, []);

	const getList = () => {
		if (userinfo.grade === "0") {
			let listdata = { status: 1 }  // 리스트 출력 기본 세팅값 정의 
			axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card", configHeader).then(result => {
				setItems(result.data.data.docs.slice(0, 15));
				setPages(result.data.data.totalPages);
				setLoading(false);
			}).catch(err => {
				setModal(UTIL.api401chk(err));
			});
		} else {
			change4();
			change3();
		}

	}

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
					getList12()
				} else {
					setCountPage(countpage + 10)
					change20();
				}
			} else {
				setCountPage(countpage + 10)
				change4();
				change20();
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


	const getList12 = () => {
		let listdata = { status: 1 }  // 리스트 출력 기본 세팅값 정의 
		axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card", configHeader).then(result => {
			setItems(result.data.data.docs.slice(0, countpage));
			setPages(result.data.data.totalPages);
			setLoading(false);
		}).catch(err => {
			setModal(UTIL.api401chk(err));
		});
	}

	// 사용자 리스트 호출 함수 

	//d운수사 리스트
	useEffect(() => {
		axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
			setVendorData(result.data.data.docs)
		}).catch(err => {

			setModal(UTIL.api401chk(err));
		})
	}, [])


	//카드 상세정보 호출 함수
	const getDetail = (_id) => {
		$("#insert").hide()
		$("#detail").show()
		$("#frmadd")[0].reset();
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		let listdata = { _id: _id }
		axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/" + _id, configHeader).then(result => {
			var sdate = new Date();
			let expireDateTime = result.data.data[0].expireDateTime
			sdate = moment(expireDateTime).utc().format('YYYY-MM-DD');
			setExpireDateTime(sdate)
			setDetailData(result.data.data);
			setVendorIdvalue(result.data.data[0].companyId);
			setCsIdvalue(result.data.data[0].csId)
			setGradevalue(result.data.data[0].csId)
			change(result.data.data[0].companyId);
			axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/history/" + result.data.data[0].vehicleId, configHeader).then(result => {
				setHistoryData(result.data.data.docs);
			}).catch(err => {
				setModal(UTIL.api401chk(err));
			});
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
		if (userinfo.grade === "0") {
			setCsIdvalue("")
		}
		setModal(false);
		setFields(fields2);
		let csId1 = $('#schform [name="csId"]').val();
		if (csId1) {
			UTIL.getBusinfo(configHeader, csId1, "");
		}

		if (userinfo.grade === "3") {
			change4();
			let csId = $('#frmadd [name="csId1"]').val();
			UTIL.getBusinfo(configHeader, csId, "");
		}
		UTIL.writeani('open')
	}

	const insertModal = (_id) => {
		$("#detail").hide()
		$("#insert").show();
		$("#dateviewbtn").show();
		setModal(false);
		setFields(fields2);
		$("#frmadd")[0].reset();

		axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/" + _id, configHeader).then(result => {
			var sdate = new Date();
			let expireDateTime = result.data.data[0].expireDateTime
			sdate = moment(expireDateTime).utc().format('YYYY-MM-DD');
			setExpireDateTime(sdate)
			setDetailData(result.data.data);
			setVendorIdvalue(result.data.data[0].companyId)
			setCsIdvalue(result.data.data[0].csId)
			change(result.data.data[0].companyId);
			UTIL.getBusinfo(configHeader, result.data.data[0].csId, result.data.data[0].vehicleId, "");
			if (userinfo.grade === "3") {
				change4();
			}

			axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/history/" + result.data.data[0].vehicleId, configHeader).then(result => {
				setHistoryData(result.data.data.docs);
			}).catch(err => {
				setModal(UTIL.api401chk(err));
			});
			setFields(fields2);
			UTIL.writeani('open')
		}).catch(err => {
			setModal(UTIL.api401chk(err));
		});
	}

	// 소속업체 선택시 소속 충전소 정보 호출하기
	const change13 = (e) => {
		setVendorIdvalue(e.target.value)
		axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
			setCsData1(result.data.data)

		}).catch(err => {
			setModal(UTIL.api401chk(err));
		})
		//

	}

	// 소속업체 선택시 소속 충전소 정보 호출하기
	const change = (value) => {
		axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + value, configHeader).then(result => {
			setCsData1(result.data.data)
		}).catch(err => {
			setModal(UTIL.api401chk(err));
		})
	}

	const change2 = (e) => {
		setCsIdvalue(e.target.value)
		UTIL.getBusinfo(configHeader, e.target.value, "");

	}


	const change4 = (e) => {
		if (userinfo.grade === "0") {
			setVendorIdvalue(e.target.value)
			axios.get(process.env.REACT_APP_APISERVER + "/api/pages_cp/chargingstations/compmayid/" + e.target.value, configHeader).then(result => {
				setCsData(result.data.data)
				change3(e)
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

	const handleClick = async () => {
		let txt = "";
		let url = "/api/pages/card";

		if ($('#frmadd [name="id"]').val()) {
			txt = "수정";
			url = "/api/pages/card/" + $('#frmadd [name="id"]').val();
		} else {
			txt = "등록";
			url = "/api/pages/card";
		}

		let status = $('#frmadd [name="status1"]').val();
		let vehicleId = $('#frmadd [name="vehicleId1"]').val();
		let companyId = $('#frmadd [name="companyId1"]').val();
		let csId = $('#frmadd [name="csId1"]').val();
		let idTag = $('#frmadd [name="idTag1"]').val();
		let expireDateTime = $('#frmadd [name="expireDateTime"]').val();

		let sendinfcreate = {}

		if (vehicleId) {
			vehicleId = $('#frmadd [name="vehicleId1"]').val();
		} else {
			vehicleId = ""
		}

		sendinfcreate = {
			companyId: companyId,   // 벤더아이디
			csId: csId,   // 벤더아이디
			idTag: idTag,      // 노선 번호
			vehicleId: vehicleId,   // 노선 명
			status: status,
			expireDateTime: expireDateTime //카드 유효기간
		}

		if (companyId == "0") {
			alert("운수사 정보를 입력해주세요")
			toggle()
			return false
		} else if (csId == "0") {
			alert("충전소 정보를 입력해주세요")
			toggle()
			return false
		} else if (idTag == "") {
			alert("카드번호를 입력해주세요")
			toggle()
			return false
		} else {
			if (txt === "수정") {
				axios.put(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {
					if (result.data.status === 1) {
						if (userinfo.grade === "0") {
							let companyId12 = $('#schform [name="companyId"]').val();
							if (companyId12 == 0) {
								getList();
								setFields(fields1);
								UTIL.writeani('close')
								toggle();
							} else {
								setFields(fields1);
								UTIL.writeani('close')
								toggle();
								change15();
							}
						} else {
							change3();
							setFields(fields1);
							UTIL.writeani('close')
							toggle();
						}
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
			} else {
				axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/count/" + idTag, configHeader).then(result => {
					if (result.data.data === 2) {
						alert("사용중인 카드 번호 입니다")
						toggle();
						return false
					} else {
						axios.post(process.env.REACT_APP_APISERVER + url, sendinfcreate, configHeader).then(result => {

							if (result.data.status === 1) {
								if (userinfo.grade === "0") {
									let companyId12 = $('#schform [name="companyId"]').val();
									if (companyId12 == 0) {
										getList();
										setFields(fields1);
										UTIL.writeani('close')
										toggle();
									} else {
										setFields(fields1);
										UTIL.writeani('close')
										toggle();
										change15();
									}
								} else {
									change3();
									setFields(fields1);
									UTIL.writeani('close')
									toggle();
								}
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
				});
			}
		}
	}
	const delClick = async () => {
		axios.delete(process.env.REACT_APP_APISERVER + "/api/pages/card/" + $('#frmadd [name="id"]').val(), configHeader).then(result => {
			if (result.data.status === 1) {

				getList();
				setFields(fields1);
				$("#frmadd input").val("");
				$("#dateview").fadeOut();
				$("#dateviewbtn").fadeOut();
				UTIL.writeani('close')
				toggle();
			} else {

				if (result.data.status === 9) {
					$("#txtmsg").text(JSON.stringify(result.data.errmsg[0].msg))
					$("#btn_modal_save").hide();
					//setErrmsg(result.data.errmsg[0].msg)
				} else {
					$("#txtmsg").text("등록실패")
					$("#btn_modal_save").hide();
				}

			}
		}).catch(err => {
			setModal(UTIL.api401chk(err));
		})
	}

	const delmodal = () => {
		let txt = "삭제";
		setMode('del');
		setModal('카드 정보를 ' + txt + '하시겠습니까?')
		setModal1(!modal);
	}

	const closemodal = () => {
		setModal(false);
		if (userinfo.grade != "0") {
			change4();
		}
	}

	const setTableClose = () => {
		setModal(false);
		setDetailData(defaultValue)

		UTIL.writeani('close')
		setFields(fields1);
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


		axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/" + csId + "/" + companyId, configHeader).then(result => {
			setItems(result.data.data.docs);
			setLoading(false);
		}).catch(err => {
			setModal(UTIL.api401chk(err));
		})
	}


	const toggle = () => {
		let txt = "";
		setMode('save'); $("#btn_modal_save").show(); $("#txtmsg").html("저장하시겠습니까?");
		if ($('#frmadd [name="id"]').val()) { txt = "수정"; } else { txt = "등록"; }
		setModal('카드 정보를 ' + txt + '하시겠습니까?')
		setModal1(!modal);
	}

	const change20 = (e) => {
		let companyId = $('#schform [name="companyId"]').val();
		let csId = $('#schform [name="csId"]').val();
		axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/" + csId + "/" + companyId, configHeader).then(result => {
			setItems(result.data.data.docs.slice(0, countpage));
			setLoading(false);
		}).catch(err => {
			setModal(UTIL.api401chk(err));
		})
	}

	const change3 = (e) => {
		if (userinfo.grade === "0") {
			setCsIdvalue(e.target.value)
		}

		let companyId = $('#schform [name="companyId"]').val();
		let csId = $('#schform [name="csId"]').val();
		UTIL.writeani('close')
		axios.get(process.env.REACT_APP_APISERVER + "/api/pages/card/" + csId + "/" + companyId, configHeader).then(result => {
			setItems(result.data.data.docs.slice(0, 15));
			setLoading(false);
		}).catch(err => {
			setModal(UTIL.api401chk(err));
		})
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
					{mode === "del" && <CButton color="primary" onClick={delClick} >삭제 </CButton>}
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
								카드 리스트
								<div style={{ paddingBottom: "5px", float: "right" }}>
									<CButton block color="info" onClick={setTableOpen}>카드 등록</CButton>
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
								}
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
										'운수사':
											(item) => (
												<td>
													{
														item.companyname.map((item, index) => {
															return (
																<CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.companyName}</CBadge>
															)
														})
													}
												</td>
											),
										'충전소(차고지)':
											(item) => (
												<td>
													{
														item.csname.map((item, index) => {
															return (
																<CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.csName}</CBadge>
															)
														})
													}
												</td>
											),
										'카드번호':
											(item) => (
												<td>{item.idTag}</td>

											),
										'차량번호':
											(item) => (
												<td>
													{!item.vehicleId && <CBadge className="mr-1" size="large" color="primary" style={{ padding: "5px", fontSize: "13px" }}>등록된 차량 없음</CBadge>}
													{item.vehicleId && <CBadge className="mr-1" size="large" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.vehicleId}</CBadge>}
												</td>
											),
										'등록일':
											(item) => (
												<td><Moment local format="YYYY-MM-DD  HH:mm">{item.createdAt}</Moment></td>

											),
										'카드 유효 기간':
											(item) => (
												<td><Moment local format="YYYY-MM-DD">{item.expireDateTime}</Moment></td>

											),
										'상태':
											(item) => (
												<td>
													{item.status === 1 && <CBadge className="mr-1" color="success" style={{ padding: "5px", fontSize: "13px" }}>사용중</CBadge>}
													{item.status === 2 && <CBadge className="mr-1" color="danger" style={{ padding: "5px", fontSize: "13px" }}>분실</CBadge>}
												</td>
											)
									}}
								/>
							</CCardBody>
						</CCard>


						<CCard id="writefrm" style={{ width: "45%", position: "relative", float: "left", display: "none" }}>
							<div id="detail" style={{ display: "none" }}>
								<CCardHeader>
									카드 상세 정보
								</CCardHeader>
								<CCardBody>
									<input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
									<CFormGroup>
										<CInputGroup>
											<CInputGroupPrepend>
												<CInputGroupText>운수사</CInputGroupText>
											</CInputGroupPrepend>
											<CSelect custom name="select" id="companyId" value={detaildata[0].companyId} onChange={e => change(e)} name="companyId" disabled="disabled">
												<option value="0" disabled="disabled"> ::: 선택하세요 :::</option>
												{
													vendordata.map((item, index) => {
														var a = detaildata[0].companyId === item.companyId ? ' selected' : ''
														return (
															<option value={item.companyId}>{item.companyName}</option>
														)
													})
												}
											</CSelect>
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											<CInputGroupPrepend>
												<CInputGroupText> 충전소</CInputGroupText>
											</CInputGroupPrepend>
											<CSelect custom name="csId" id="csId" value={csIdvalue} onChange={e => change2(e)} disabled="disabled">
												<option value="0" disabled="disabled"> ::: 선택하세요 :::</option>
												{
													csdata1.map((item, index) => {
														return (
															<option value={item.csId}>[ {item.companyId} ] - {item.csName}</option>
														)
													})
												}
											</CSelect>
										</CInputGroup>
									</CFormGroup>


									<CFormGroup>
										<CInputGroup>
											<CInputGroupPrepend>
												<CInputGroupText>카드번호</CInputGroupText>
											</CInputGroupPrepend>
											<CInput type="text" id="idTag" name="idTag" defaultValue={detaildata[0].idTag} readOnly />
											&nbsp;&nbsp;&nbsp;&nbsp;
											<CInputGroupPrepend>
												<CInputGroupText>차량번호</CInputGroupText>
											</CInputGroupPrepend>
											<CInput type="text" id="vehicleId" name="vehicleId" defaultValue={detaildata[0].vehicleId} readOnly />
										</CInputGroup>
									</CFormGroup>


									<CFormGroup>
										<CInputGroup>
											<CInputGroupPrepend>
												<CInputGroupText> 상태</CInputGroupText>
											</CInputGroupPrepend>
											<CSelect custom id="status" name="status" value={detaildata[0].status} disabled="disabled">
												<option value="1" disabled="disabled"> 등록완료 </option>
												<option value="0" disabled="disabled"> 삭제 </option>
												<option value="2" disabled="disabled"> 등록대기 </option>
											</CSelect>
										</CInputGroup>
									</CFormGroup>

									<CFormGroup>
										<CInputGroup>
											<CInputGroupPrepend>
												<CInputGroupText>등록일</CInputGroupText>
											</CInputGroupPrepend>
											<Moment local format="YYYY-MM-DD">{detaildata[0].createdAt}</Moment>

										</CInputGroup>
									</CFormGroup>

									<CFormGroup>
										<CInputGroup>
											<CInputGroupPrepend>
												<CInputGroupText>카드 유효 기간</CInputGroupText>
											</CInputGroupPrepend>
											<Moment local format="YYYY-MM-DD">{ExpireDateTime}</Moment>
										</CInputGroup>
									</CFormGroup>




									<CFormGroup className="form-actions">
										<CButton type="button" onClick={() => insertModal(detaildata[0]._id)} size="bg" color="success" style={{ width: "100px" }}> 수정</CButton>
										<CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
									</CFormGroup>
								</CCardBody>



								<CCardHeader>
									카드 등록 기록
								</CCardHeader>
								<CCardBody>
									<CDataTable
										items={HistoryData}
										fields={fields3}
										striped
										onTableFilterChange={setTableFilterValue}
										onPaginationChange={setItemsPerPage}
										scopedSlots={{
											'운수사':
												(item) => (
													<td >
														<CBadge className="mr-1" color="secondary" style={{ padding: "5px", fontSize: "13px" }}>{item.companyId}</CBadge>
													</td>
												),
											'충전소(차고지)':
												(item) => (
													<td>
														<CBadge className="mr-1" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.csId}</CBadge>
													</td>
												),
											'카드번호':
												(item) => (
													<td>{item.idTag}</td>

												),
											'차량번호':
												(item) => (
													<td>
														{!item.vehicleId && <CBadge className="mr-1" size="large" color="primary" style={{ padding: "5px", fontSize: "13px" }}>등록된 차량 없음</CBadge>}
														{item.vehicleId && <CBadge className="mr-1" size="large" color="primary" style={{ padding: "5px", fontSize: "13px" }}>{item.vehicleId}</CBadge>}
													</td>
												),
											'등록일':
												(item) => (
													<td><Moment local format="YYYY-MM-DD  HH:mm">{item.createdAt}</Moment></td>
												)
										}}
									/>
								</CCardBody>
							</div>

							<div id="insert" style={{ display: "none" }}>
								<CCardHeader>
									카드 정보 입력
								</CCardHeader>
								<CCardBody>
									<CForm action="" name="frmadd" id="frmadd" method="post">
										<input type="hidden" name="id" id="id" defaultValue={detaildata[0]._id} />
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
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
													<CInputGroupPrepend>
														<CInputGroupText> *충전소</CInputGroupText>
													</CInputGroupPrepend>
													<CSelect custom name="csId1" id="csId" value={csIdvalue} onChange={e => change2(e)} disabled={detaildata[0].csId}>
														<option value="0" disabled={detaildata[0].csId}> ::: 선택하세요 :::</option>
														{
															csdata1.map((item, index) => {
																return (
																	<option value={item.csId}>[ {item.companyId} ] - {item.csName}</option>
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
												<CSelect custom name="select" id="companyId" value={userinfo.vendorid} onChange={e => change4(e)} name="companyId1" disabled="disabled">
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
												<CSelect custom name="csId1" id="csId" value={userinfo.csid} onChange={e => change4(e)} disabled="disabled">
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
													<CInputGroupText>*카드번호</CInputGroupText>
												</CInputGroupPrepend>
												{detaildata[0].status == null && <CInput type="text" id="idTag1" name="idTag1" defaultValue={detaildata[0].idTag} />}
												{detaildata[0].status === 0 && <CInput type="text" id="idTag1" name="idTag1" defaultValue={detaildata[0].idTag} readOnly />}
												{detaildata[0].status === 1 && <CInput type="text" id="idTag1" name="idTag1" defaultValue={detaildata[0].idTag} readOnly />}
												{detaildata[0].status === 2 && <CInput type="text" id="idTag1" name="idTag1" defaultValue={detaildata[0].idTag} />}
												&nbsp;&nbsp;&nbsp;&nbsp;
												<CInputGroupPrepend>
													<CInputGroupText>차량번호</CInputGroupText>
												</CInputGroupPrepend>
												<div id="buscsidselect" style={{ display: "flex", width: "250px" }} ></div>
											</CInputGroup>
										</CFormGroup>

										<CFormGroup>
											<CInputGroup>
												<CInputGroupPrepend>
													<CInputGroupText> *상태정보 </CInputGroupText>
												</CInputGroupPrepend>
												<CSelect custom id="status1" name="status1" defaultvalue={detaildata[0].status}>
													<option value="1"> 정상 </option>
													<option value="0"> 삭제 </option>
													<option value="2"> 분실 </option>
												</CSelect>
											</CInputGroup>
										</CFormGroup>


										<CFormGroup>
											<CInputGroup>
												<CInputGroupPrepend>
													<CInputGroupText>카드 유효 기간</CInputGroupText>
												</CInputGroupPrepend>
												<CInput type="date" id="expireDateTime" name="expireDateTime" defaultValue={ExpireDateTime} />
											</CInputGroup>
										</CFormGroup>
										<CFormGroup className="form-actions">
											<CButton type="button" onClick={toggle} size="bg" color="success" style={{ width: "100px" }}>저장</CButton>
											&nbsp;&nbsp;&nbsp;&nbsp;
											<CButton id="dateviewbtn" style={{ display: "none" }} type="button" onClick={delmodal} size="bg" color="danger" style={{ width: "100px" }}>삭제</CButton>
											<CButton type="button" onClick={setTableClose} size="bg" color="success" style={{ float: "right", width: "100px" }}>닫기</CButton>
										</CFormGroup>
									</CForm>
								</CCardBody>
							</div>
						</CCard>
					</CRow>
				</CCol>
			</CRow>
		</>
	)
}

export default Lineinfo