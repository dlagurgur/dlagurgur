import React from 'react';
import '../App.css';
import { useCookies } from 'react-cookie';


function Logout() {
   const [cookies, setCookie,removeCookie] = useCookies(['token']);
    removeCookie('TocToken',  {maxAge: 0});
    removeCookie('TocName',  {maxAge: 0});
    document.location.href='/login';
  return (
    <>
      <div className="wrapper">
        <Weather></Weather>
        <main>
        
        </main>

        { /* 푸터 Component */}
        <Footer></Footer>

      </div>
    </>
  );
}


export default Logout;
