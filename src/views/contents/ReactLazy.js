import React, {useEffect, useState} from 'react';
import { render } from 'react-dom';
import {
  LazyLog,
  LazyStream,
  LazyList,
  ScrollFollow,
  Line,
  LineContent,
  LineNumber,
  LinePart,
  Loading,
  Spinner
} from 'react-lazylog';

const LogView = () => {
  const url = 'http://172.17.221.242:3020/DESKTOP-GLN7IAP-websocket-2021-05-21.log';
  const style = { height: 300, width: 902 };
  return (
    <>
    <div style={{ height: 500, width: 902 }}>
        <ScrollFollow
          startFollowing={true}
          render={({ follow, onScroll }) => (
            <LazyLog url="http://172.17.221.242:3020/DESKTOP-GLN7IAP-websocket-2021-05-21.log" stream={true} follow={follow} onScroll={onScroll} />
          )}
        />
    </div>
      
    </>
  );
  // return (
  //       <>
  //         <LazyLog url="http://172.17.221.242:3020/DESKTOP-GLN7IAP-websocket-2021-05-21.log" />
  //       </>
  //     )
}

export default LogView