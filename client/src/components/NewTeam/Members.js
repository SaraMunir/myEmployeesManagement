import React, {useState, useEffect, useRef } from 'react';
import {Modal, Button} from 'react-bootstrap'
import { Link, useParams } from "react-router-dom";

const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;

function Members() {
    const { teamId } = useParams();
    const [lgShow, setLgShow] = useState(false);
    const [ newMember, setNewMember ] = useState({ membName: "", membEmail: "", membRole: "", membSex: "",membPassword: "", teamId: `${teamId}`});
    const [ houses, setHouses ] = useState([]);
    const [ teamRoles, setTeamRoles ] = useState([])
    const [ member, setMember ] = useState([]);
    // const [ memberFiltered, setMemberFiltered ] = useState([]);
    const [ originalMember, setOriginalMember ] = useState([]);
    const [ searchInput, setSearchInput ] = useState("");  
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ listStuff, setListStuff ] = useState( "pl-4 pr-4 text-center" );
    const [ filterType, setFilterType] = useState('')
    const [ view, setView ] = useState("Grid")
    const [ filterCategory, setFilterCategory ] = useState([])
    const [ membAvatar, setMembAvatar ] = useState("empAvatar")
    // const [ checkEmailExist, setCheckEmailExist ]= useState(false);
    
    const inputEmail = useRef();  
    const inputPassword = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target; 
        setNewMember( { ...newMember, [id]: value } );
        }
    function handleSearchInputChange(e){
        const newInput2 = e.target.value;
        const newInput = newInput2.toLowerCase();
        setSearchInput(newInput);
        if( newInput.length >0){
            const newList = member.filter(mem=> 
                mem.name.toLowerCase().indexOf(newInput)==0)
            setMember( newList);
        }
        else {
            loadMember()
            setMember( member );
        }
    }
    async function submitMember(e){
        let checkEmailExist = false;
        member.map(memb=>
            {
                if(newMember.membEmail == memb.email){
                    checkEmailExist = true;
                }
            } )
        console.log('checkEmail: ', checkEmailExist)
        e.preventDefault();
        console.log('newMember', newMember);
        if (newMember.membEmail == ""){
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide the members Email!' } );
            return;
        }
        if ( newMember.membPassword === "" || newMember.membPassword.length < 8 ){
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide the members password!' } );
            return;
        }
        if ( checkEmailExist == true){
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Email address already exist, please provide a different email address!' } );
            return;
        }
        const apiResult = await fetch('/api/postMember', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMember)
            }).then( result=>result.json());
        setNewMember({ membName: "", membEmail: "", membRole: "", membSex: "", teamId: `${teamId}`})
        setLgShow(false);
        loadMember()
    }
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMember(fetchMembers)
        setOriginalMember(fetchMembers)
    }
    async function loadTeamRoles(){
        const fetchRoles = await fetch (`/api/allRoles/${teamId}`).then( res => res.json());
        console.log('fetched roles are: ', fetchRoles.teamRoles)
        setTeamRoles(fetchRoles.teamRoles)
    }
    async function deleteMember(membId){
        // console.log('member id : ', employeeId)
        const apiDeleteMember= await fetch(`/api/deleteMember/${membId}`);
        loadMember()
    }
    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses)
    }
    function SetView(typeView){
        if(typeView=='List'){
            setView('List');
            setMembAvatar('listEmpAvatar')
            setListStuff('pl-4 pr-4 col-7 text-left')
        }
        if(typeView=='Grid'){
            setView('Grid')
            setMembAvatar('empAvatar')
            setListStuff('pl-4 pr-4 text-center')
        }
    }
    function sortMembers(catgeory){
        console.log('sorting catgeory: ', catgeory)
        if(catgeory == 'Name'){
            
            const sortedList = [...member].sort(function(a, b){
            let name1 = a.name.trim().toLowerCase();
            let name2 = b.name.trim().toLowerCase();
            return (name1 > name2 ? 1 : -1 )});
            console.log(sortedList)
            setMember(sortedList);
        } else
        if(catgeory == 'Role'){
        const sortedList = [...member].sort(function(a, b){
            let role1 = a.role;
            let role2 = b.role;
            return (role1 > role2 ? 1 : -1 )});
            setMember(sortedList);
        } else
        if(catgeory == 'House'){
        const sortedList = [...member].sort(function(a, b){
            let house1 = a.house;
            let house2 = b.house;
            return (house1 > house2 ? 1 : -1 )});
            setMember(sortedList);
        } else
        if(catgeory == 'Sex'){
        const sortedList = [...member].sort(function(a, b){
            let sex1 = a.sex;
            let sex2 = b.sex;
            return (sex1 > sex2 ? 1 : -1 )});
            setMember(sortedList);
        }
    }
    function filterMembers(catgeory){
        console.log('sorting catgeory: ', catgeory)
        console.log('sorting catgeory: ', originalMember)
        // setMember();
        // teamRoles.map((role)=>
        //     { 
        //         if(role.roleName == catgeory){
        //             console.log(`role.roleName: `, role.roleName)
        //             console.log(`catgeory: `, catgeory)
        //             const newList = originalMember.filter(mem=> mem.role == catgeory)
        //             console.log('newList: ',newList)
        //             console.log('memberFiltered: ',memberFiltered)
        //             setMemberFiltered(oldArray => [...oldArray, ...newList]);
        //             setFilterCategory(oldArray => [...oldArray, catgeory])
        //         }
        //     })
    }
    useEffect(function(){
        loadMember()
        loadTeamRoles()
        loadHouse()
    },[])

    return (
        <div>
            <h3 >Team Members</h3>
            <hr/>
            <div class="d-flex justify-content-between col-11 mx-auto">
                <form class="d-flex pl-4 col-5">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search Employees" aria-label="Search"
                    onChange={handleSearchInputChange}
                    value={searchInput}
                    />
                </form>
                <div className="som">
                    {userType == 'Admin' ? <div className="myBtnNew2" onClick={() => setLgShow(true)}><i class="fas fa-user-plus"></i> Add Member</div>: ""}
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
                            <form>
                                <div class="form-group">
                                <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">{alertMessage.message}</div>
                                    <label for="membName">Member Name</label>
                                    <input type="text" class="form-control" 
                                    id="membName" aria-describedby="taskHelp" onChange={handleInputChange} 
                                    value={newMember.membName}/>
                                    <div class="form-group">
                                        <label for="membEmail">Provide Members Email</label>
                                        <input
                                        value={newMember.membEmail} 
                                        onChange={handleInputChange} 
                                        ref={inputPassword}
                                        id="membEmail"
                                        ref={inputEmail} 
                                        type="email" class="form-control" placeholder="Member Email"/>
                                    </div>
                                    <div class="form-group">
                                        <label for="membPassword">Provide Members Temporary Password</label>
                                        <input
                                        value={newMember.membPassword} 
                                        onChange={handleInputChange} 
                                        ref={inputPassword}
                                        id="membPassword" 
                                        type="password" class="form-control" placeholder="membPassword"/>
                                    </div>
                                    <div className="row mx-aut0">
                                        <div class="col-md-4">
                                        <label for="membRole">Select Role</label>
                                        <select 
                                        id="membRole" class="form-control" value={newMember.membRole} 
                                        onChange={handleInputChange} >
                                            <option selected>Choose...</option>
                                            {teamRoles.map( role => 
                                            <option key={`r-${role}`}  value={role.roleName}>{role.roleName}</option>
                                            )}
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                        <label for="membSex">Select Sex</label>
                                        <select 
                                        id="membSex" class="form-control" value={newMember.membSex} 
                                        onChange={handleInputChange} >
                                            <option selected>Choose...</option>
                                            <option value='F'>Female</option>
                                            <option value='M'>Male</option>
                                            <option value='Other'>Other</option>
                                        </select>
                                    </div> 
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary" onClick={submitMember}>Submit</button>
                            </form>
                        </Modal.Body>
                    </Modal> 
                </div>
                <div className="listGrid d-flex">
                    <div className="Filtering btn-group">
                        <a class="myBtnNew2 dropdown-toggle" href="#" role="button" id="dropDownFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-filter"></i>
                        Filter
                        </a>
                        <div class="dropdown-menu" aria-labelledby="dropDownFilter">
                            <div  className="text-left dropdown-item mx-auto listToHover">
                                <div className="list1"> <i class="fas fa-angle-left"></i> &nbsp; By Roles</div>
                                <div className="listHoverDiv">
                                    {teamRoles.map( (role,idx) => 
                                        <div>
                                            <div className="listHoverItem" key={`r-${idx}`} onClick={()=>filterMembers(`${role.roleName}`)}>{role.roleName}</div> 
                                        </div>
                                    )}
                                </div>
                            
                            </div>
                            <hr/>
                            <div  className="text-left dropdown-item mx-auto" onClick={()=>filterMembers('Sex')}>By Sex</div>
                        </div>
                    </div>
                    <div class="Sorting btn-group">
                        <div type="button" class="myBtnNew2 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-sort-amount-up-alt"></i>Sort
                        </div>
                        <div class="dropdown-menu">
                            <div  className="text-left dropdown-item mx-auto" onClick={()=>sortMembers('Name')}>By Name</div>
                            <hr/>
                            <div  className="text-left dropdown-item mx-auto" onClick={()=>sortMembers('Role')}> By Role</div>
                            <hr/>
                            <div  className="text-left dropdown-item mx-auto" onClick={()=>sortMembers('House')}>By House</div>
                            <hr/>
                            <div  className="text-left dropdown-item mx-auto" onClick={()=>sortMembers('Sex')} >By Sex </div>
                        </div>
                    </div>
                    { view == 'Grid' ?
                    <div className="myBtnNew2" onClick={()=>SetView('List')}>
                        <i class="fas fa-list"></i>
                    </div> :
                    <div className="myBtnNew2" onClick={()=>SetView('Grid')}>
                        <i class="fas fa-th"></i>
                    </div>
                    }
                </div>
            </div>
            <div className="d-flex">
                {filterCategory? filterCategory.map(cat=> <div className="filterName">{cat}</div>): ''}
            </div>
            <div class={view}>
                <div className="d-flex">
                </div>
                {
                member.map( (memb, idx) => {
                    switch (memb.sex){
                        case "F": 
                            return <div key={`member${idx}`}  class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : ''
                                )}
                                {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                                </div>
                                <div class="card-body">
                                    <img src={memb.profileImg ? memb.profileImg : "https://img2.pngio.com/avatar-female-person-profile-user-website-woman-icon-female-avatar-png-512_512.png"} alt="" class={membAvatar}/>
                                    <div className={listStuff}>
                                        <h5 class="card-title myTitle">{memb.name}</h5>
                                        <p class="card-text mySubTxt">{memb.role}</p>
                                    </div>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                        <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        case "M":
                            return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                    house.houseColor ? house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : '' : <i class="fas fa-2x fa-bookmark"></i>
                                    )}
                                    {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                                </div>
                                <div class="card-body">
                                    <img src={ memb.profileImg ? memb.profileImg : "https://www.epicentrofestival.com/wp-content/uploads/2020/01/epicentrofestival-avatar-avatar-5j0hepy7wd-720x811.jpg" } alt="" class={membAvatar}/>
                                    <div className={listStuff}>
                                        <h5 class="card-title myTitle">{memb.name}</h5>
                                        <p class="card-text mySubTxt">{memb.role}</p>
                                    </div>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} ><div class="myBtnNew mx-auto" href="#" role="button">view Detail </div></Link>
                                </div>
                            </div>
                        default:   return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                        <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                            {houses.map(house=>
                                house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : ''
                                )} {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                        </div>
                        <div class="card-body">
                            <img src={memb.profileImg ? memb.profileImg : "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png" } alt="" class={membAvatar}/>
                            <div className={listStuff}>
                                <h5 class="card-title myTitle">{memb.name}</h5>
                                <p class="card-text mySubTxt">{memb.role}</p>

                            </div>
                            <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                            </Link>
                        </div>
                    </div>;
                    }
                })}
                
                {/* {!memberFiltered ? 
                <h4 class="mt-5 mx-auto">You have not added any team mates yet</h4>
                :
                memberFiltered.map( (memb, idx) => {
                    switch (memb.sex){
                        case "F": 
                            return <div key={`member${idx}`}  class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : ''
                                )}
                                {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                                </div>
                                <div class="card-body">
                                    <img src={memb.profileImg ? memb.profileImg : "https://img2.pngio.com/avatar-female-person-profile-user-website-woman-icon-female-avatar-png-512_512.png"} alt="" class={membAvatar}/>
                                    <div className={listStuff}>
                                        <h5 class="card-title myTitle">{memb.name}</h5>
                                        <p class="card-text mySubTxt">{memb.role}</p>
                                    </div>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                        <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        case "M":
                            return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                    house.houseColor ? house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : '' : <i class="fas fa-2x fa-bookmark"></i>
                                    )}
                                    {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                                </div>
                                <div class="card-body">
                                    <img src={ memb.profileImg ? memb.profileImg : "https://www.epicentrofestival.com/wp-content/uploads/2020/01/epicentrofestival-avatar-avatar-5j0hepy7wd-720x811.jpg" } alt="" class={membAvatar}/>
                                    <div className={listStuff}>
                                        <h5 class="card-title myTitle">{memb.name}</h5>
                                        <p class="card-text mySubTxt">{memb.role}</p>
                                    </div>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} ><div class="myBtnNew mx-auto" href="#" role="button">view Detail </div></Link>
                                </div>
                            </div>
                        default:   return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                        <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                            {houses.map(house=>
                                house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : ''
                                )} {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                        </div>
                        <div class="card-body">
                            <img src={memb.profileImg ? memb.profileImg : "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png" } alt="" class={membAvatar}/>
                            <div className={listStuff}>
                                <h5 class="card-title myTitle">{memb.name}</h5>
                                <p class="card-text mySubTxt">{memb.role}</p>

                            </div>
                            <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                            </Link>
                        </div>
                    </div>;
                    }
                })
                } */}
            </div>
        </div>
    )
}

export default Members
