import React, {useState, useEffect, useRef } from 'react';
import {Modal, Button} from 'react-bootstrap'
import { Link, useParams } from "react-router-dom";
import Loader from  "./Rolling-1s-200px.gif";

const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;

function Members() {
    const { teamId } = useParams();
    const [loading, setLoading] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [lgShow2, setLgShow2] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState({});
    const [ newMember, setNewMember ] = useState({ membName: "", membEmail: "", membRole: "", membSex: "",membPassword: "", teamId: `${teamId}`});
    const [ houses, setHouses ] = useState([]);
    const [ teamRoles, setTeamRoles ] = useState([])
    const [ member, setMember ] = useState([]);
    const [ memberFiltered, setMemberFiltered ] = useState([]);
    const [ originalMember, setOriginalMember ] = useState([]);
    const [ searchInput, setSearchInput ] = useState("");  
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ listStuff, setListStuff ] = useState( "pl-4 pr-4 text-center" );
    const [ filterType, setFilterType] = useState('')
    const [ view, setView ] = useState("Grid")
    const [ filterCategory, setFilterCategory ] = useState([])
    const [ clearFilterBtn, setClearFilterBtn ] = useState()
    const [ membAvatar, setMembAvatar ] = useState("empAvatar")
    const inputEmail = useRef();  
    const inputPassword = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target; 
        setNewMember( { ...newMember, [id]: value } );
        }
    function handleHouseSelect( e ){
        const { id, value } = e.target; 
        setSelectedHouse ({ [id]: value })
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
        setLoading(true)
        let checkEmailExist = false;
        member.map(memb=>
            {
                if(newMember.membEmail === memb.email){
                    checkEmailExist = true;
                    setLoading(false)
                }
            } )
        e.preventDefault();
        if (newMember.membEmail == ""){
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide the members Email!' } );
            setLoading(false)
            return;
        }
        if ( newMember.membPassword === "" || newMember.membPassword.length < 8 ){
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide the members password!' } );
            setLoading(false)
            return;
        }
        if ( checkEmailExist == true){
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Email address already exist, please provide a different email address!' } );
            setLoading(false)
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
        setLoading(false)
        loadMember()
    }
    async function loadMember(){
        setLoading(true)
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMember(fetchMembers)
        setOriginalMember(fetchMembers);
        setLoading(false)
    }
    async function loadTeamRoles(){
        setLoading(true)
        const fetchRoles = await fetch (`/api/allRoles/${teamId}`).then( res => res.json());
        console.log('fetched roles are: ', fetchRoles.teamRoles)
        setTeamRoles(fetchRoles.teamRoles)
        setLoading(false)
    }
    async function deleteMember(membId){
        setLoading(true)
        const apiDeleteMember= await fetch(`/api/deleteMember/${membId}`);
        loadMember()
        setLoading(false)
    }
    async function loadHouse(){
        setLoading(true)
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses)
        setLoading(false)
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
    function filterMembers(category, type){
        console.log('sorting category: ', category)
        console.log('sorting type: ', type)
        // setMember([])
        if(type == 'Role'){
            teamRoles.map((role)=>
                { 
                    if(role.roleName == category){
                        // console.log(`role.roleName: `, role.roleName)
                        // console.log(`category: `, category)
                        const newList = originalMember.filter(mem=> mem.role == category)
                        let cat ={
                            category: category,
                            type: type
                        }
                        console.log('newList: ',newList)
                        console.log('memberFiltered: ',memberFiltered)
                        setMemberFiltered(oldArray => [...oldArray, ...newList]);
                        setFilterCategory(oldArray => [...oldArray, cat])
                    }
                })}
        if(type == 'sex'){
            if(category === 'F'){
                const newList = originalMember.filter(mem=> mem.sex == "F")
                    let cat ={
                        category: "Female",
                        type: type
                    }
                    setMemberFiltered(oldArray => [...oldArray, ...newList]);
                    setFilterCategory(oldArray => [...oldArray, cat])
            }
            if(category === 'M'){
                const newList = originalMember.filter(mem=> mem.sex == "M")
                    let cat ={
                        category: "Male",
                        type: type
                    }
                    setMemberFiltered(oldArray => [...oldArray, ...newList]);
                    setFilterCategory(oldArray => [...oldArray, cat])
            }
            if(category === 'Other'){
                const newList = originalMember.filter(mem=> mem.sex == "Other")
                    let cat ={
                        category: "Other",
                        type: type
                    }
                    setMemberFiltered(oldArray => [...oldArray, ...newList]);
                    setFilterCategory(oldArray => [...oldArray, cat])
            }
        }
    }
    function removeFilter(category, type){
        console.log(category)
        if(type == 'Role'){  
        teamRoles.map((role)=>
            { 
                if(role.roleName === category){
                    console.log(`role.roleName: `, role.roleName)
                    console.log(`category: `, category)
                    const newList = memberFiltered.filter(mem=> mem.role !== category)
                    const newCatList = filterCategory.filter(cat=> cat.category !== category)
                    console.log('newList: ',newList)
                    console.log('memberFiltered: ',memberFiltered)
                    setMemberFiltered(oldArray => [...newList]);
                    setFilterCategory(oldArray => [...newCatList])
                }
            })
        }
        if(type == 'sex'){
            if(category === 'Female'){
                const newList = memberFiltered.filter(mem=> mem.sex !== 'F')
                const newCatList = filterCategory.filter(cat=> cat.category !== category)
                setMemberFiltered(oldArray => [...newList]);
                setFilterCategory(oldArray => [...newCatList])
            }
            if(category === 'Male'){
                const newList = memberFiltered.filter(mem=> mem.sex !== 'M')
                const newCatList = filterCategory.filter(cat=> cat.category !== category)
                setMemberFiltered(oldArray => [...newList]);
                setFilterCategory(oldArray => [...newCatList])
            }
            if(category === 'Other'){
                const newList = memberFiltered.filter(mem=> mem.sex !== 'Other')
                const newCatList = filterCategory.filter(cat=> cat.category !== category)
                setMemberFiltered(oldArray => [...newList]);
                setFilterCategory(oldArray => [...newCatList])
            }
        }
    }
    function clearFilter(){
        setMemberFiltered([])
        setFilterCategory([])
    }
    async function assignHouse(membId, id){
        console.log("selectedHouse: ", selectedHouse)
        console.log("membId: ", membId)
        setLoading(true)
        const apiResult = await fetch(`/api/memberDetailUpdate/${membId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedHouse)
            }).then( result => result.json());
        setSelectedHouse({});
        loadMember();
        closeMenu(id)
        setLoading(false)
    }
    function showMenu(id){
        const el = document.getElementById(id);
        if (el.className === 'houseWindow hide'){
            el.className = 'houseWindow';
        } else {
            el.className = 'houseWindow hide';
        }
    }
    function closeMenu(id){
        const el = document.getElementById(id);
        if (el.className == 'houseWindow'){
            el.className = 'houseWindow hide';
        }
    }
    useEffect(function(){
        loadMember()
        loadTeamRoles()
        loadHouse()
    },[])
    return (
        <div>
            <div className={loading === true ? "loaderWindow": "hide"}>
                <div className="loadingWnd">
                    <img className="loadingGif" src={Loader} alt="loadingWndow"/>
                </div>
            </div>
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
                                            <div className="listHoverItem" key={`r-${idx}`} onClick={()=>filterMembers(`${role.roleName}`, `Role`)}>{role.roleName}</div> 
                                        </div>
                                    )}
                                </div>
                            
                            </div>
                            <hr/>
                            <div className="text-left dropdown-item mx-auto listToHover">
                                <div className="list1"> <i class="fas fa-angle-left"></i> &nbsp; By Sex</div>
                                    <div className="listHoverDiv">
                                        <div>
                                            <div className="listHoverItem" onClick={()=>filterMembers(`F`, `sex`)}>Female</div> 
                                            <div className="listHoverItem" onClick={()=>filterMembers(`M`, `sex`)}>Male</div> 
                                            <div className="listHoverItem" onClick={()=>filterMembers(`Other`, `sex`)}>Other</div> 
                                        </div>
                                    </div>
                            </div>
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
            <div>
                <h5>{memberFiltered.length == 0  ? member.length : memberFiltered.length} results</h5>
            </div>
            <div className="d-flex col-11 mx-auto">
                { memberFiltered == '' ?  '' : filterCategory.map(cat=> <div className="filterName d-flex justify-content-between">{cat.category} <i class="fas fa-times filterX" onClick={()=>removeFilter(cat.category, cat.type)}></i></div>)}{ filterCategory.length >= 2 ? 
                    <div className="filterName" onClick={clearFilter}>Clear Filter</div>: '' }
            </div>
            <div class={view}>
                <div className="d-flex">
                </div>
                { memberFiltered.length == 0 ?
                member.map( (memb, idx) => {
                    switch (memb.sex){
                        case "F": 
                            return <div key={`member${idx}`}  class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="houseCont mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                    house.houseColor ? house._id == memb.house ? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i>
                                        <div className="hoverName2">
                                        {house.houseName}
                                        </div> 
                                    </div>
                                    : '' : <i class="fas fa-2x fa-bookmark"></i>
                                    )}
                                {userType == 'Admin'? 
                                <div className="hoverShow2">
                                    <i class="fas fa-user-times deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>
                                    <div className="hoverName2">
                                        Delete Member
                                    </div>
                                </div>
                                : ''}
                                
                                {userType == 'Admin'? 
                                <div className="hoverShow2">
                                    <div className="deleteBtn" onClick={()=>showMenu(`show_${idx}`)}>
                                        <i class="fas fa-home" ></i>
                                        <i class="fas fa-plus" style={{fontSize: '.7rem'}}></i>
                                    </div>
                                    <div className="hoverName2">
                                        Assign House
                                    </div>
                                </div>
                                : ''}
                                    <div className="houseWindow hide" id={`show_${idx}`}>
                                        <form className="col-10 mx-auto houseBox">
                                            <div class="form-group">
                                                <div className="d-flex justify-content-end">
                                                    <i class="far fa-2x fa-times-circle deleteBtn" onClick={()=>closeMenu(`show_${idx}`)} ></i>
                                                </div>
                                                <div className="row mx-aut0">
                                                    <div class="col-10  mx-auto">
                                                        <h4 className="pt-3 pb-3">Select House</h4>
                                                        <select 
                                                            id="house" class="form-control" value={selectedHouse.assignedHouse} 
                                                            onChange={handleHouseSelect} >
                                                                <option selected>Choose...</option>
                                                                {houses.map( (house, idx) => 
                                                                <option key={`house-${idx}`}  value={house._id}>{house.houseName}</option>
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="myBtnNew2 col-4 mx-auto" onClick={()=>assignHouse(memb._id, `show_${idx}`)}>Submit House</div>
                                        </form>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <img src={memb.profileImg ? memb.profileImg : "https://img2.pngio.com/avatar-female-person-profile-user-website-woman-icon-female-avatar-png-512_512.png"} alt="" class={membAvatar}/>
                                    <div className={listStuff}>
                                        <h5 class="card-title myTitle">{memb.name}</h5>
                                        <p class="card-text mySubTxt">{memb.role}</p>
                                    </div>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} ><div class="myBtnNew mx-auto" href="#" role="button">view Detail </div></Link>
                                </div>
                            </div>
                        case "M":
                            return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                    house.houseColor ? house._id == memb.house ? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i>
                                        <div className="hoverName2">
                                        {house.houseName}
                                        </div> 
                                    </div>
                                    : '' : <i class="fas fa-2x fa-bookmark"></i>
                                    )}
                                    {userType == 'Admin'? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-user-times deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>
                                        <div className="hoverName2">
                                            Delete Member
                                        </div>
                                    </div>
                                    : ''}
                                    {userType == 'Admin'? 
                                    <div className="hoverShow2">
                                        <div className="deleteBtn" onClick={()=>showMenu(`show_${idx}`)}>
                                            <i class="fas fa-home" ></i>
                                            <i class="fas fa-plus" style={{fontSize: '.7rem'}}></i>
                                        </div>
                                        <div className="hoverName2">
                                            Assign House
                                        </div>
                                    </div>
                                    : ''}
                                    <div className="houseWindow hide" id={`show_${idx}`}>
                                        <form className="col-10 mx-auto houseBox">
                                            <div class="form-group">
                                                <div className="d-flex justify-content-end">
                                                    <i class="far fa-2x fa-times-circle deleteBtn" onClick={()=>closeMenu(`show_${idx}`)} ></i>
                                                </div>
                                                <div className="row mx-aut0">
                                                    <div class="col-10  mx-auto">
                                                        <h4 className="pt-3 pb-3">Select House</h4>
                                                        <select 
                                                            id="house" class="form-control" value={selectedHouse.assignedHouse} 
                                                            onChange={handleHouseSelect} >
                                                                <option selected>Choose...</option>
                                                                {houses.map( (house, idx) => 
                                                                <option key={`house-${idx}`}  value={house._id}>{house.houseName}</option>
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="myBtnNew2 col-4 mx-auto" onClick={()=>assignHouse(memb._id, `show_${idx}`)}>Submit House</div>
                                        </form>
                                    </div>
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
                                    house.houseColor ? house._id == memb.house ? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i>
                                        <div className="hoverName2">
                                        {house.houseName}
                                        </div> 
                                    </div>
                                    : '' : <i class="fas fa-2x fa-bookmark"></i>
                                )}
                                {userType == 'Admin'? 
                                <div className="hoverShow2">
                                    <i class="fas fa-user-times deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>
                                    <div className="hoverName2">
                                        Delete Member
                                    </div>
                                </div>
                                : ''}
                                {userType == 'Admin'? 
                                <div className="hoverShow2">
                                    <div className="deleteBtn" onClick={()=>showMenu(`show_${idx}`)}>
                                        <i class="fas fa-home" ></i>
                                        <i class="fas fa-plus" style={{fontSize: '.7rem'}}></i>
                                    </div>
                                    <div className="hoverName2">
                                        Assign House
                                    </div>
                                </div>
                                : ''}
                                    <div className="houseWindow hide" id={`show_${idx}`}>
                                        <form className="col-10 mx-auto houseBox">
                                            <div class="form-group">
                                                <div className="d-flex justify-content-end">
                                                    <i class="far fa-2x fa-times-circle deleteBtn" onClick={()=>closeMenu(`show_${idx}`)} ></i>
                                                </div>
                                                <div className="row mx-aut0">
                                                    <div class="col-10  mx-auto">
                                                        <h4 className="pt-3 pb-3">Select House</h4>
                                                        <select 
                                                            id="house" class="form-control" value={selectedHouse.assignedHouse} 
                                                            onChange={handleHouseSelect} >
                                                                <option selected>Choose...</option>
                                                                {houses.map( (house, idx) => 
                                                                <option key={`house-${idx}`}  value={house._id}>{house.houseName}</option>
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="myBtnNew2 col-4 mx-auto" onClick={()=>assignHouse(memb._id, `show_${idx}`)}>Submit House</div>
                                        </form>
                                    </div>
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
                }) : 
                memberFiltered.map( (memb, idx) => {
                    switch (memb.sex){
                        case "F": 
                            return <div key={`member${idx}`}  class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                    house.houseColor ? house._id == memb.house ? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i>
                                        <div className="hoverName2">
                                        {house.houseName}
                                        </div> 
                                    </div>
                                    : '' : <i class="fas fa-2x fa-bookmark"></i>
                                )}
                                {userType == 'Admin'? 
                                <div className="hoverShow2">
                                    <i class="fas fa-user-times deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>
                                    <div className="hoverName2">
                                        Delete Member
                                    </div>
                                </div>
                                : ''}
                                {userType == 'Admin'? 
                                <div className="hoverShow2">
                                    <div className="deleteBtn" onClick={()=>showMenu(`show_${idx}`)}>
                                        <i class="fas fa-home" ></i>
                                        <i class="fas fa-plus" style={{fontSize: '.7rem'}}></i>
                                    </div>
                                    <div className="hoverName2">
                                        Assign House
                                    </div>
                                </div>
                                : ''}
                                    <div className="houseWindow hide" id={`show_${idx}`}>
                                        <form className="col-10 mx-auto houseBox">
                                            <div class="form-group">
                                                <div className="d-flex justify-content-end">
                                                    <i class="far fa-2x fa-times-circle deleteBtn" onClick={()=>closeMenu(`show_${idx}`)} ></i>
                                                </div>
                                                <div className="row mx-aut0">
                                                    <div class="col-10  mx-auto">
                                                        <h4 className="pt-3 pb-3">Select House</h4>
                                                        <select 
                                                            id="house" class="form-control" value={selectedHouse.assignedHouse} 
                                                            onChange={handleHouseSelect} >
                                                                <option selected>Choose...</option>
                                                                {houses.map( (house, idx) => 
                                                                <option key={`house-${idx}`}  value={house._id}>{house.houseName}</option>
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="myBtnNew2 col-4 mx-auto" onClick={()=>assignHouse(memb._id, `show_${idx}`)}>Submit House</div>
                                        </form>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <img src={memb.profileImg ? memb.profileImg : "https://img2.pngio.com/avatar-female-person-profile-user-website-woman-icon-female-avatar-png-512_512.png"} alt="" class={membAvatar}/>
                                    <div className={listStuff}>
                                        <h5 class="card-title myTitle">{memb.name}</h5>
                                        <p class="card-text mySubTxt">{memb.role}</p>
                                    </div>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/TimeLine`} >
                                        <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        case "M":
                            return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                    house.houseColor ? house._id == memb.house ? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i>
                                        <div className="hoverName2">
                                        {house.houseName}
                                        </div> 
                                    </div>
                                    : '' : <i class="fas fa-2x fa-bookmark"></i>
                                )}
                                    {userType == 'Admin'? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-user-times deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>
                                        <div className="hoverName2">
                                            Delete Member
                                        </div>
                                    </div>
                                    : ''}
                                    {userType == 'Admin'? 
                                    <div className="hoverShow2">
                                        <div className="deleteBtn" onClick={()=>showMenu(`show_${idx}`)}>
                                            <i class="fas fa-home" ></i>
                                            <i class="fas fa-plus" style={{fontSize: '.7rem'}}></i>
                                        </div>
                                        <div className="hoverName2">
                                            Assign House
                                        </div>
                                    </div>
                                    : ''}
                                    <div className="houseWindow hide" id={`show_${idx}`}>
                                        <form className="col-10 mx-auto houseBox">
                                            <div class="form-group">
                                                <div className="d-flex justify-content-end">
                                                    <i class="far fa-2x fa-times-circle deleteBtn" onClick={()=>closeMenu(`show_${idx}`)} ></i>
                                                </div>
                                                <div className="row mx-aut0">
                                                    <div class="col-10  mx-auto">
                                                        <h4 className="pt-3 pb-3">Select House</h4>
                                                        <select 
                                                            id="house" class="form-control" value={selectedHouse.assignedHouse} 
                                                            onChange={handleHouseSelect} >
                                                                <option selected>Choose...</option>
                                                                {houses.map( (house, idx) => 
                                                                <option key={`house-${idx}`}  value={house._id}>{house.houseName}</option>
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="myBtnNew2 col-4 mx-auto" onClick={()=>assignHouse(memb._id, `show_${idx}`)}>Submit House</div>
                                        </form>
                                    </div>
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
                                house.houseColor ? house._id == memb.house ? 
                                    <div className="hoverShow2">
                                        <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i>
                                        <div className="hoverName2">
                                        {house.houseName}
                                        </div> 
                                    </div>
                                    : '' : <i class="fas fa-2x fa-bookmark"></i>
                            )}
                                {userType == 'Admin'? 
                                <div className="hoverShow2">
                                    <i class="fas fa-user-times deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>
                                    <div className="hoverName2">
                                        Delete Member
                                    </div>
                                </div>
                                : ''}
                                    {userType == 'Admin'? 
                                    <div className="hoverShow2">
                                        <div className="deleteBtn" onClick={()=>showMenu(`show_${idx}`)}>
                                            <i class="fas fa-home" ></i>
                                            <i class="fas fa-plus" style={{fontSize: '.7rem'}}></i>
                                        </div>
                                        <div className="hoverName2">
                                            Assign House
                                        </div>
                                    </div>
                                    : ''}
                                    <div className="houseWindow hide" id={`show_${idx}`}>
                                        <form className="col-10 mx-auto houseBox">
                                            <div class="form-group">
                                                <div className="d-flex justify-content-end">
                                                    <i class="far fa-2x fa-times-circle deleteBtn" onClick={()=>closeMenu(`show_${idx}`)} ></i>
                                                </div>
                                                <div className="row mx-aut0">
                                                    <div class="col-10  mx-auto">
                                                        <h4 className="pt-3 pb-3">Select House</h4>
                                                        <select 
                                                            id="house" class="form-control" value={selectedHouse.assignedHouse} 
                                                            onChange={handleHouseSelect} >
                                                                <option selected>Choose...</option>
                                                                {houses.map( (house, idx) => 
                                                                <option key={`house-${idx}`}  value={house._id}>{house.houseName}</option>
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="myBtnNew2 col-4 mx-auto" onClick={()=>assignHouse(memb._id, `show_${idx}`)}>Submit House</div>
                                        </form>
                                    </div>
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
                }
            </div>
        </div>
    )
}

export default Members
