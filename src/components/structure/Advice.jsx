import React, { Fragment } from "react";
import './Advice.css';
const Advice = ({text,type}) => {
    return(
        <Fragment>
            <p className={type}><strong>¡AVISO!</strong>{text}</p>
        </Fragment>
    );   
}
export default Advice;