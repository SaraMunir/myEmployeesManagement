import React, {useState, useContext, useEffect, useRef } from 'react';
import {Modal, Button} from 'react-bootstrap'
import { Link, useParams } from "react-router-dom";
import { relative } from 'path';

function House() {
    const userId = localStorage.id
    const { teamId } = useParams();
    const [lgShow, setLgShow] = useState(false);
    const [ newHouse, setNewHouse ] = useState({ 
        houseName: "", 
        about: "", 
        housePin: "",
        houseColor: "#b0de78",
        teamId: `${teamId}`, 
        houseLeader:{}});
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [houses, setHouses] = useState([]);
    const [members, setMembers] = useState([]);
    const [showMembers, setShowMembers] = useState([]);
    const [ searchInput, setSearchInput] = useState("");  



    function handleInputChange( e ){
        const { id, value } = e.target; 
        setNewHouse( { ...newHouse, [id]: value } );
        }
    function setleader(name, id){
        setNewHouse( { ...newHouse, houseLeader: {
            Name: name,
            memberId: id,
        } } );
        setShowMembers([]);
        setSearchInput(name);
    }
    async function submitHouse(e){
        e.preventDefault();
        console.log('newHouse: ', newHouse)
        const apiResult = await fetch('/api/postHouse', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newHouse)
            }).then( result=>result.json());
        setNewHouse({ houseName: "", about: "", housePin: "", teamId: `${teamId}`, houseLeader:{}});
        setSearchInput("");
        setLgShow(false);
        loadHouse()
    }
    function handleSearchInputChange(e){
        const newInput2 = e.target.value;
        const newInput = newInput2.toLowerCase();
        setSearchInput(newInput);
        if( newInput.length >0){
            const newList = members.filter(mem=> 
                mem.name.toLowerCase().indexOf(newInput)==0)
            setShowMembers( newList);
        }   
        else {
            loadMember()
            setShowMembers([]);
        }
    }
    
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMembers(fetchMembers)
    }
    
    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses)
    }
    async function deleteHouse(houseId){
        // console.log('member id : ', employeeId)
        const apiDeleteMember= await fetch(`/api/deleteHouse/${houseId}`);
        loadHouse()
        
    }
    // const wrapperRef = useRef(null);
    // useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    alert("You clicked outside of me!");
                }
            }
    
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    useEffect(function(){
        loadHouse()
        loadMember()
    },[])

    return (
        <div class="brd1">
            <div className="createHouseSection">
                <div className="myBtnNew mx-auto"  onClick={() => setLgShow(true)}>Add House</div>
                <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">House
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div class="form-group">
                                <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">{alertMessage.message}</div>
                                <div className="form-group">
                                    <label for="houseName">House Name</label>
                                    <input type="text" class="form-control" 
                                    id="houseName" aria-describedby="taskHelp" onChange={handleInputChange} 
                                    value={newHouse.houseName}/>
                                </div>
                                <div class="form-group">
                                    <label for="about">About</label>
                                    <input type="text" class="form-control" 
                                    id="about" aria-describedby="taskHelp" onChange={handleInputChange} 
                                    value={newHouse.about}/>
                                </div>
                                <div className="form-group">
                                    <label for="color">Select House Color</label>
                                    <input type="color"  class="form-control" id="houseColor" onChange={handleInputChange}
                                    value={newHouse.houseColor} />
                                </div>

                                <div class="form-group">
                                    <label for="housePin">Provide House Pin code</label>
                                    <input
                                    value={newHouse.housePin} 
                                    onChange={handleInputChange} 
                                    id="housePin"  minlength="4" maxLength="5"
                                    type="password" class="form-control" placeholder="Provide Pin" />
                                </div>
                                <div class="form-group">
                                    <label for="houseLeader">Select House Leader</label>
                                    <input class="form-control mr-sm-2"
                                    id="leaderName" type="search" placeholder="Search Employees" aria-label="Search"
                                    onChange={handleSearchInputChange}
                                    value={searchInput}
                                    />
                                    <ul class="list-group">
                                        {showMembers.map(member=>
                                            showMembers ?
                                            // () => setLgShow(false)
                                            <li class="list-group-item" onClick={() => setleader(member.name, member._id)}>
                                                <img class="imgThmbnail" src={member.profileImg} alt=""/>
                                                {member.name}</li> : ''
                                        )}


                                    </ul>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary" onClick={submitHouse}>Submit</button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="allHouses mx-auto">
                <div className="card mx-auto col-4">
                    <div className="card-body">
                        <h3>Team Name</h3>
                    </div>
                </div>
                <div className="row mx-auto">
                    {houses.map((house,idx)=>
                        
                        {
                            function showMenu(id){
                                const el = document.getElementById(id);
                                if (el.className === 'housDropDwn hide'){
                                    el.className = 'housDropDwn';
                                } else {
                                    el.className = 'housDropDwn hide';
                                }
                            }
                            return (
                            <div className="houseCard mx-auto" style={{background: house.houseColor ? house.houseColor: "pink", position: relative}}
                            >
                                <div className="text-right dropDnParnt"  onClick={()=>showMenu(`show_${idx}`)}>
                                    <i class="fas fa-chevron-down dropDwnIcon"></i>
                                    <div className="housDropDwn hide" id={`show_${idx}`} >
                                        <div className="dropDwnItem">
                                            delete
                                        </div>
                                        <div className="dropDwnItem">
                                            edit
                                        </div>
                                    </div>
                                </div>
                                <h6>{house.houseName}</h6>
                            </div>
                        )
                    }
                        ) }
                </div>

            </div>
        </div>
    )
}

export default House
