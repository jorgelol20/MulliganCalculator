import React, {Fragment} from "react";
import {Routes, Route} from 'react-router-dom';
import Main from "../pages/Main";
import Results from "../pages/Results";

const PageRoutes = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/results" element={<Results/>}/>
                <Route path="/*" element={<Main/>}/>
            </Routes>
        </Fragment>
    )
}
export default PageRoutes;