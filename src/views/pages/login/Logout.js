import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from "axios";
import * as UTIL from 'src/util/Fnc'
import CryptoJS from "crypto-js"

const Logout = async () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [userinfo] = useState(UTIL.getUserInfo(cookies))
  const res = "ip"
  if (!cookies.TocToken) {
    window.location.href = '/login'
  } else {
    axios.post(process.env.REACT_APP_APISERVER + "/api/auth/logout/", { userCode: cookies.TocToken, companyId: userinfo.vendorid, csId: userinfo.csid, username: userinfo.username, userIp: res })

    removeCookie('TocToken', { maxAge: 0 });
    removeCookie('TocData1', { maxAge: 0 });
    removeCookie('TocData2', { maxAge: 0 });
    removeCookie('TocData3', { maxAge: 0 });
    removeCookie('TocData4', { maxAge: 0 });
    removeCookie('TocData5', { maxAge: 0 });

    window.location.href = '/login';
  }
  return (
    <>

    </>
  );
}


export default Logout;
