import React, {useState} from 'react'
import { Link, useLocation, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import {Modal} from 'react-bootstrap'

const adminId = localStorage.id
const theme = localStorage.theme;


function Settings() {
    let history = useHistory();

    const { teamId } = useParams();
    const [lgShow, setLgShow] = useState(false);
    async function deleteTeam(){
        const apiDeleteTeam= await fetch(`/api/deleteTeam/${teamId}`);
        history.push(`/NewTeamsPage`);
        document.location.reload(true);
    }
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
                        <div className="myBtnNew2" onClick={() => setLgShow(true)}><i class="fas fa-trash-alt"></i> Delete </div>
                        <Modal
                    size="lg"
                    show={lgShow}
                    onHide={() => setLgShow(false)}
                    aria-labelledby="example-modal-sizes-title-lg">
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg"> Member
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card">
                                <h4>Are you sure you would like to delete this </h4>
                                <div className="d-flex">
                                    <div className="myBtnNew" onClick={() => setLgShow(false)}>Cancel</div>
                                    <div className="myBtnNew" onClick={deleteTeam}>Confirm Delete</div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
