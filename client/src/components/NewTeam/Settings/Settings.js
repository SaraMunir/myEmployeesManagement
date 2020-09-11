import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
const adminId = localStorage.id
const theme = localStorage.theme;


function Settings() {
    const { teamId } = useParams();
    return (
        <div>
            <h3>Setup your Team</h3>
            <hr/>
            <div className={ theme === 'Dark' ? "myCardDark col-11 mx-auto text-left":"myCard col-11 mx-auto text-left"}>
                <div className="card-body">
                    <h4>House / Department</h4>
                    <hr/>
                    <p>Setup House / Department to assign to your members</p>
                    <div className="d-flex justify-content-end">
                        <Link to={`/TeamDetail/${teamId}/House`} className="try">
                            <div className="myBtnNew">
                                House
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={ theme === 'Dark' ? "myCardDark col-11 mx-auto text-left":"myCard col-11 mx-auto text-left"}>
                <div className="card-body">
                    <h4>Roles</h4>
                    <hr/>
                    <p>Setup roles to assign to your members</p>
                    <div className="d-flex justify-content-end">
                        <Link to={`/TeamDetail/${teamId}/Roles`} className="try">
                            <div className="myBtnNew">
                                Roles
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={ theme === 'Dark' ? "myCardDark col-11 mx-auto text-left":"myCard col-11 mx-auto text-left"}>
                <div className="card-body">
                    <h4>Tiers / Levels</h4>
                    <hr/>
                    <p> Add tiers / levels for co-ordinators / supervisors to oversee members activity and different tasks </p>
                    <div className="d-flex justify-content-end">
                        <Link to={`/TeamDetail/${teamId}/Tiers`} className="try">
                            <div className="myBtnNew">Tiers</div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={ theme === 'Dark' ? "myCardDark col-11 mx-auto text-left":"myCard col-11 mx-auto text-left"}>
                <div className="card-body">
                    <h4>Delete Team</h4>
                    <hr/>
                    <div className="d-flex justify-content-end">
                        <Link to={`/TeamDetail/${teamId}/Delete`} className="try">
                            <div className="myBtnNew">Delete</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
