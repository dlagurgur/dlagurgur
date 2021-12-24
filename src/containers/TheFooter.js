import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <>
      <CFooter fixed={false}>
        {/* <div>
          <a href="https://pmgrow.co.kr" target="_blank" rel="noopener noreferrer">Pmgrow</a>
          <span className="ml-1">&copy; 2020 Bass Team.</span>
        </div>
        <div className="mfs-auto">
          <span className="mr-1">Powered by</span>
          <a href="https://pmgrow.co.kr" target="_blank" rel="noopener noreferrer">Pmgrow</a>
        </div> */}
      </CFooter>
    </>
  )
}

export default React.memo(TheFooter)
