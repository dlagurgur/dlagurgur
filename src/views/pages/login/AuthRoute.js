import React from "react"
import { Route, Redirect } from "react-router-dom"
import * as UTIL from '../../../util/Fnc'
import { useCookies } from 'react-cookie';
import CryptoJS from "crypto-js"
function AuthRoute({ authenticated, component: Component, admininfo, render, ...rest }) {

  const [cookies] = useCookies(['token']);

  if (Object.keys(admininfo).length > 0) {
    //. window.location="/logout";
    var userid = CryptoJS.AES.decrypt(admininfo.TocData1, process.env.REACT_APP_ENCRYPT_KEY);
    userid = JSON.parse(userid.toString(CryptoJS.enc.Utf8));
    var username = CryptoJS.AES.decrypt(admininfo.TocData2, process.env.REACT_APP_ENCRYPT_KEY);
    username = JSON.parse(username.toString(CryptoJS.enc.Utf8));
    var vendorId = CryptoJS.AES.decrypt(admininfo.TocData4, process.env.REACT_APP_ENCRYPT_KEY);
    vendorId = JSON.parse(vendorId.toString(CryptoJS.enc.Utf8));
    var grade = CryptoJS.AES.decrypt(admininfo.TocData3, process.env.REACT_APP_ENCRYPT_KEY);
    grade = JSON.parse(grade.toString(CryptoJS.enc.Utf8));
  } else {

  }


  if (grade === "3") {
    if (userid === "costel") {
      //rest.location.pathname = "/get/logview";
      if (rest.location.pathname === "/get/logview" || rest.location.pathname === "/set/chargerinfo" || rest.location.pathname === "/logout" || rest.location.pathname === "/dashboard" || rest.location.pathname === "/login") {
        return (
          <Route {...rest} render={(props) => authenticated ? (render ? (render(props)) : (<Component {...props} />)) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
          }
          />
        )
      } else {
        window.location = "/get/logview";
      }
    } else {
      if (rest.location.pathname === "/logout" || rest.location.pathname === "/set/report" || rest.location.pathname === "/login" || rest.location.pathname === "/set/lineinfo" || rest.location.pathname === "/set/businfo" ||
        rest.location.pathname === "/set/chargerinfo" || rest.location.pathname === "/set/cardinfo"
        || rest.location.pathname === "/set/manager" || rest.location.pathname === "/set/loginhistory" || rest.location.pathname === "/set/logview" || rest.location.pathname === "/dashboard" || rest.location.pathname === "set/report"
      ) {
        return (
          <Route {...rest} render={(props) => authenticated ? (render ? (render(props)) : (<Component {...props} />)) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
          }
          />
        )
      } else {
        window.location = "/dashboard";
      }
    }

  }


  //슈퍼어드민일경우 
  if (grade === "0") {

    return (
      <Route {...rest} render={(props) => authenticated ? (render ? (render(props)) : (<Component {...props} />)) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
      }
      />
    )

  }

  // admin일경우
  if (grade === "1") {
    if (rest.location.pathname === "/set/manager" || rest.location.pathname === "/logout" || rest.location.pathname === "/login") {
      window.location = "/get/logview";
    } else {
      return (
        <Route {...rest} render={(props) => authenticated ? (render ? (render(props)) : (<Component {...props} />)) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
        }
        />
      )
    }
  }

  //vendor일경우
  if (grade === "2") {
    if (rest.location.pathname === "/logout" || rest.location.pathname === "/login" || rest.location.pathname === "/set/lineinfo" || rest.location.pathname === "/set/businfo" || rest.location.pathname === "/set/chargingstation"
      || rest.location.pathname === "/set/chargerinfo" || rest.location.pathname === "/set/vendor" || rest.location.pathname === "/set/cardinfo"
      || rest.location.pathname === "/set/manager" || rest.location.pathname === "/set/loginhistory" || rest.location.pathname === "/set/logview" || rest.location.pathname === "/dashboard" || rest.location.pathname === "/set/report" || rest.location.pathname === "/get/loginhistory"
      || rest.location.pathname === "/set/price" || rest.location.pathname === "/set/manufacturer" || rest.location.pathname === "/set/chargermodel") {
      return (
        <Route {...rest} render={(props) => authenticated ? (render ? (render(props)) : (<Component {...props} />)) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
        }
        />
      )
    } else {
      window.location = "/set/lineinfo";
    }
  } else {

  }


  //vendor일경우
  if (grade === undefined) {

    return (
      <Route {...rest} render={(props) => authenticated ? (render ? (render(props)) : (<Component {...props} />)) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
      }
      />
    )

  }

}

export default AuthRoute