import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment';
import axios from "axios";
import GV from '../globalSet'
import $ from 'jquery';
import { isMobile } from 'react-device-detect';
import CryptoJS from "crypto-js"

export function financial(x, y) {
    return Number.parseFloat(x).toFixed(y);
}

// UTC to Local
export function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
}

//공백 제거
export function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}

//배열을 Json 타입으로 변환
export function arrayToJson(array) {
    return Object.assign({}, array);
}

// 서버 통신시 토큰이 없거나 exprire  일경우 로그인 페이지로 이동하기
export function axiosErrchk(errstatus) {
    if (errstatus === 300 || errstatus === 401) {
        alert('토큰이 해제되었습니다. 재로그인을 해주세요');
        //document.location.href='/logout';
    } else {
        //alert('서버와 통신에 문제가 있습니다.');
        // document.location.href='/logout';
        console.log(errstatus);
    }
}


export function isEmpty(str) {
    if (str === undefined || str === null || str === "" || str === "{}")
        return false;
    else
        return true;
}


//공백 제거
export function downexcel(data, filename) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fn) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fn + fileExtension);
    }

    if (filename === 'undefined-undefined') {
        var sdate = new Date();
        sdate.setMonth(sdate.getMonth() - 2);
        sdate = moment(sdate).utc().format('YYYY-MM-DD HH:mm:ss');

        var edate = new Date();
        edate.setMonth(edate.getMonth());
        edate = moment(edate).utc().format('YYYY-MM-DD HH:mm:ss');
        filename = sdate.substring(0, 10) + "-" + edate.substring(0, 10);
    }

    exportToCSV(data, filename);
}

export const errStatusChk = (str) => {
    if (str.response) {
        switch (str.response.status) {
            case "500":
                alert(str.response.data.message);
            case "400":
                alert(str.response.data.message);
            case "300":
                alert('로그인 정보가 만료되었습니다.');
            case "401":
                alert('인증에 실패 하였습니다.');
            default:
                alert('오류로 인하여 실패 하였습니다.');
        }
    } else {
        alert('오류로 인하여 실패 하였습니다.');
    }
}

export const getDay = (Ymd) => {
    var weekName = new Array('일', '월', '화', '수', '목', '금', '토');
    var year = Ymd.substring(0, 4);
    var month = Ymd.substring(5, 7);
    var day = Ymd.substring(8, 10);
    var week = new Date(year, month - 1, day, 0, 0, 0, 0);
    week = weekName[week.getDay()];
    return week;
}

export const datachange = (data, sdate, edate) => {
    //console.log(data.data.data)
    // 빈날짜 채워넣기 Start
    let rtndata = data;

    let startDate = sdate;
    let endDate = edate;

    if (startDate === "" || startDate === undefined) {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 2);
        startDate.setDate(startDate.getDate() + 1);
        startDate = moment(startDate).utc().format('YYYY-MM-DD');
    }

    if (endDate === "" || endDate === undefined) {
        endDate = new Date();
        endDate.setMonth(endDate.getMonth());
        endDate = moment(endDate).utc().format('YYYY-MM-DD');
    }


    let datec = "";
    let i = 0;

    while (endDate >= startDate) {
        if (i > 300) {
            break;
        }
        let men = rtndata.filter(function (person) {
            return person.DATE === startDate
        });

        if (men.length === 0) {
            rtndata.push({ '_id': 'NONE', '운행거리': 0, "일방전량": 0, "일충전량": 0, "전비": 0, "총방전량": 0, "총충전량": 0, "총주행거리": 0, DATE: formatDate(startDate) });
        }

        // console.log(startDate);
        let vardate = new Date(startDate);
        datec = vardate.setDate(vardate.getDate() + 1);
        startDate = moment(datec).utc().format('YYYY-MM-DD')

        i++;
    }

    const result = rtndata.sort(rackSort);
    return result;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

export const rackSort = (a, b) => { if (a.topic == b.topic) { return 0 } return a.topic < b.topic ? 1 : -1; }


// json 데이터 의 특정 키 의 값을 모두 더하는 함수 
export const jsonsum = (obj) => {
    let sum = 0;
    for (var el in obj) {
        if (obj.hasOwnProperty(el)) {
            sum += parseFloat(obj[el]);
        }
    }

    return sum;
}

// 모달 팝업 정의 
export const modalopen = (msg, color) => {
    return { mode: true, msg: msg, color: color }
}

// api return 401 에러 처리 함수 
export const api401chk = (err) => {

    try {

        if (err.response.status === 401) {
            //setModal(UTIL.modalopen('로그인 세션이 만료되었습니다.', 'danger'))
            alert('로그인 세션이 만료되었습니다.로그인 페이지로 이동합니다.')
            document.location.href = '/logout';
            //return {mode:true, msg : '로그인 세션이 만료되었습니다.', color:"info", type:"logout"}
        } else {
            //return (UTIL.modalopen('상세정보 호출 실패<br>'+JSON.stringify(err)+'', 'danger'))
            return { mode: true, msg: 'ERROR !!<br>' + JSON.stringify(err.message) + '', color: "danger" }
        }
    } catch (err) {
        return { mode: true, msg: 'ERROR !!<br>' + JSON.stringify(err.message) + '', color: "danger" }
    }

}

// 입력및 상세보기시 PC & 모바일 화면에 따른 애니메이션 처리
export const writeani = (mode) => {
    if (mode === "open") {
        if (isMobile) {
            //$("#writefrm").show();
            // 쓰기폼 fadeIn  애니메이션
            $("#writefrm").css("left", "relative").css("width", "100%")
            $("#listtable2").animate({ left: "-500px" }, 300, function () {
                $("#listtable2").toggle();
                $("#writefrm").fadeIn();
            })

        } else {
            $("#writefrm").animate({ width: "52%" }, 300, function () {
                $("#writefrm").animate({ left: "30px" }, 100)
            })
            $("#listtable2").animate({ width: "45%" }, 300, function () {
                $("#writefrm").fadeIn();
            })
        }
    } else {
        if (isMobile) {

            $("#writefrm").css("position", "relative").css("width", "100%")
            $("#listtable2").toggle();
            $("#writefrm").fadeOut(200, function () {
                $("#listtable2").animate({ left: "0px" }, 300, function () {
                    $("#dateview").fadeOut();
                })
            })
        } else {

            $("#writefrm").hide();
            $("#listtable2").animate({ width: "98%" }, 300, function () { });
        }
    }
}




// 입력및 상세보기시 PC & 모바일 화면에 따른 애니메이션 처리
export const writeanics = (mode) => {
    if (mode === "open") {

        $("#writefrm").css("left", "relative").css("width", "100%")
        $("#listtable2").animate({ left: "-500px" }, 300, function () {
            $("#listtable2").toggle();
            $("#writefrm").fadeIn();
        })

    } else {

        //$("#writefrm").show();
        $("#writefrm").css("position", "relative").css("width", "100%")
        $("#listtable2").toggle();
        $("#writefrm").fadeOut(200, function () {
            $("#listtable2").animate({ left: "0px" }, 300, function () {
                $("#dateview").fadeOut();
            })
        })

    }
}

export const getCompany = (configHeader) => {
    var comapny = []

    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", configHeader).then(result => {
        comapny.push(result.data.data.docs)

    })

    return comapny
}




export const getBusinfo = (configHeader, csId, vehicleId, linenum) => {
    let listdata = { csId: csId, vehicleId: vehicleId }  // 리스트 출력 기본 세팅값 정의
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages/buscsidselect", listdata, configHeader).then(result => {
        var html = ""
        if (result) {
            if (result) {
                html = '';
                result.data.data.docs.map((item, index) => {
                    html = html + '<option value="' + item.vehicleId + '">' + item.vehicleId + '</option>'

                })
                html = html + '<option value="">등록한 버스 없음</option>'
                let htmlresult = "<select class='custom-select' name='vehicleId1' id='vehicleId1'>" + html + "</select>"

                $("#buscsidselect").html(htmlresult);
            }
        } else {

        }

    }).catch(err => {
        return "err"
    });
}

export const getCardinfo = (configHeader, csId, idTag, linenum) => {
    let listdata = { csId: csId, idTag: idTag }  // 리스트 출력 기본 세팅값 정의
    axios.post(process.env.REACT_APP_APISERVER + "/api/pages/cardcsidselect", listdata, configHeader).then(result => {
        var html = ""
        if (result) {
            if (result) {
                html = '';
                result.data.data.docs.map((item, index) => {
                    html = html + '<option value="' + item.idTag + '">' + item.idTag + '</option>'
                })
                html = html + '<option value="">등록한 카드 없음</option>'
                let htmlresult = "<select class='custom-select' name='idTag1' id='idTag1'>" + html + "</select>"

                $("#cardlist").html(htmlresult);
            }
        } else {

        }

    }).catch(err => {
        return "err"
    });
}




export const getLineinfono = (configHeader, routeno, linenum) => {
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/routeno/" + routeno + "/" + "0", configHeader).then(result => {
        var start = ""
        var end = ""
        var city = ""
        if (result) {
            start = result.data.data[0].startnodenm
            end = result.data.data[0].endnodenm
            city = result.data.data[0].cityname
            let starthtml = '<input class="form-control" type = "text" value= "' + start + '" readOnly/>'
            let endhtml = '<input class="form-control" type = "text"  value= "' + end + '" readOnly/>'
            let cityhtml = '<input class="form-control" type = "text" value= "' + city + '" readOnly/>'
            $("#starthtml").html(starthtml);
            $("#endhtml").html(endhtml);
            $("#cityhtml").html(cityhtml);

        } else {

        }
        //return "<div>aa</div>"
    }).catch(err => {
        return "err"
    });
}


export const getLineinfo = (configHeader, vendorId, linenum) => {
    let listdata = { status: 1, pagesize: GV.vendorTablepagesize, csId: vendorId }  // 리스트 출력 기본 세팅값 정의 
    axios.get(process.env.REACT_APP_APISERVER + "/api/pages/line/routeno/" + "0" + "/" + vendorId, configHeader).then(result => {
        var html = ""
        var start = ""
        var end = ""
        var city = ""
        if (result) {
            if (result.data.status === 1) {
                html = '';
                result.data.data.map((item, index) => {
                    if (linenum === item.routeno) {
                        html = html + '<option value="' + item.routeno + '" selected>' + item.routeno + '</option>'
                        start = item.startnodenm
                        end = item.endnodenm
                        city = item.cityname

                    } else {
                        html = html + '<option value="' + item.routeno + '">' + item.routeno + '</option>'
                        start = item.startnodenm
                        end = item.endnodenm
                        city = item.cityname

                    }
                })
                let htmlresult = "<select class='custom-select' name='routeno' id='routeno'>" + html + "</select>"
                let starthtml = '<input class="form-control" type = "text" value= "' + start + '" readOnly/>'
                let endhtml = '<input class="form-control" type = "text"  value= "' + end + '" readOnly/>'
                let cityhtml = '<input class="form-control" type = "text" value= "' + city + '" readOnly/>'
                $("#lineinfosel").html(htmlresult);
                $("#starthtml").html(starthtml);
                $("#endhtml").html(endhtml);
                $("#cityhtml").html(cityhtml);
            }
        } else {

        }
        //return "<div>aa</div>"
    }).catch(err => {
        return "err"
    });
}

export const getUserInfo = (data) => {
    if (data.TocToken) {
        let userid = CryptoJS.AES.decrypt(data.TocData1, process.env.REACT_APP_ENCRYPT_KEY);
        userid = JSON.parse(userid.toString(CryptoJS.enc.Utf8));
        let username = CryptoJS.AES.decrypt(data.TocData2, process.env.REACT_APP_ENCRYPT_KEY);
        username = JSON.parse(username.toString(CryptoJS.enc.Utf8));
        let vendorId = CryptoJS.AES.decrypt(data.TocData4, process.env.REACT_APP_ENCRYPT_KEY);
        vendorId = JSON.parse(vendorId.toString(CryptoJS.enc.Utf8));
        let grade = CryptoJS.AES.decrypt(data.TocData3, process.env.REACT_APP_ENCRYPT_KEY);
        grade = JSON.parse(grade.toString(CryptoJS.enc.Utf8));
        let csid = CryptoJS.AES.decrypt(data.TocData5, process.env.REACT_APP_ENCRYPT_KEY);
        csid = JSON.parse(csid.toString(CryptoJS.enc.Utf8));

        const admininfo = {
            userid: userid,
            username: username,
            vendorid: vendorId,
            grade: grade,
            csid: csid
        }

        return admininfo;
    }
}
