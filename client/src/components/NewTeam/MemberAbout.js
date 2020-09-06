import React, {useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from './MemberProfile';
function MemberAbout(props) {
    const { memberDetail } = useContext(UserContext);
    return (
        <div className="myBorder">
            <div className="d-flex justify-content-between">
                <p className="subHeader col-3 text-left"><i class="fas fa-envelope"></i> Email:</p>
                <p className="col-9 text-left">{memberDetail.email}</p>
            </div>
            <div className="d-flex justify-content-between">
                <p className="subHeader col-3 text-left"><i class="fas fa-map-marked-alt"></i> Address:</p>
                <p className="col-9 text-left">{memberDetail.address ? memberDetail.address : "address not yet provided"} </p>
            </div>
            <div className="d-flex justify-content-between">
                <p className="subHeader col-3 text-left"><i class="fas  fa-phone-square"></i> Phone:</p>
                <p className="col-9 text-left">{memberDetail.phone ? memberDetail.phone : "phone number not yet provided"}</p>
            </div>
        </div>
    )
}

export default MemberAbout
