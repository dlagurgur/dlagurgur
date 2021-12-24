import axios from 'axios'
import { useState, useEffect } from 'react'
import { CSelect } from '@coreui/react'
import GV from '../globalSet'
import * as UTIL from 'src/util/Fnc'
import { useCookies } from 'react-cookie';
export const Vendorlist = (props) => {
    const [cookies] = useCookies(['token']);  //Auth    
    const [data, setData] = useState("");
    const [userinfo] = useState(UTIL.getUserInfo(cookies))
    // 페이지내 글로벌 변수 정의  START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::    
    const [pagesize, setPageSize] = useState(GV.vendorTablepagesize);
    // 페이지내 글로벌 변수 정의  END :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    useEffect(() => {
        axios.get(process.env.REACT_APP_APISERVER + "/api/pages/comapny", props.header.headers).then(result => {
            setData(result.data.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <CSelect custom name="select" id="vendorid" name="vendorid">
            <option value="0">Please select</option>
            {
                data.map((item, index) => {
                    <option value="0">{item.name_kr}</option>
                })
            }
        </CSelect>
    );
}

export const ManagerGrade = (props) => {
    const [cookies] = useCookies(['token']);  //Auth    
    const [userinfo] = useState(UTIL.getUserInfo(cookies))
    const [data, setData] = useState("");
    if (userinfo.grade == "0") {
        return (
            <CSelect custom name="select" value={props.grade} onChange={e => props.changeGrade(e)} id="grade" name="grade">
                <option value="3">Monitor</option>
                <option value="2">Vendor</option>
                <option value="0">Super</option>
            </CSelect>
        );
    } else {
        return (
            <CSelect custom name="select" value={props.grade} onChange={e => props.changeGrade(e)} id="grade" name="grade">
                <option value="3">Monitor</option>
                <option value="2">Vendor</option>
            </CSelect>
        );
    }
}


export const SetGradeTxt = (props) => {
    let gradetxt = "";
    switch (props.grade) {
        case "0":
            gradetxt = "Super";
            break;
        case "1":
            gradetxt = "Admin";
            break;
        case "2":
            gradetxt = "Vendor";
            break;
        case "3":
            gradetxt = "Monitor";
            break;
        default:
            gradetxt = "Monitor";
            break;
    }

    return (
        <div>{gradetxt}</div>
    )
}