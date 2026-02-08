import React, { Fragment } from "react";
import './Advice.css';
const Advice = ({text,type}) => {
    return(
        <Fragment>
            <div className="advice">
                <p className={type}><strong>¡AVISO! </strong>{text}</p>
            </div>
        </Fragment>
    );   
}
export default Advice;