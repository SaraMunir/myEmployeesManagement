import React, {useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from './MemberProfile';
function MemberAbout(props) {
    const { memberDetail } = useContext(UserContext);

    return (
        <div className="myBorder">
            <div className="d-flex justify-content-between">
                <p className="mySubTxt col-3 text-left">Email:</p>
                <p className="col-9 text-left">{memberDetail.email}</p>
            </div>
            <div className="d-flex justify-content-between">
                <p className="col-3 text-left">Address:</p>
                <p className="col-9 text-left">some addresss  Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
            </div>
            
        </div>
    )
}

export default MemberAbout
