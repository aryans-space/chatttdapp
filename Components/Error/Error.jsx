import React from 'react'

//internal import

import Style from './Error.module.css';

const Error = ({error}) => {
  return (
    <div className={Style.Error}>
      <div className={Style.Error_box}>
        <h1>Please Fix THis ERROR & Reload browser</h1>
        {error}

      </div>
      
    </div>
  )
}

export default Error
