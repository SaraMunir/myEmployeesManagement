import React, {useState, useEffect } from 'react';
import {useHistory  } from "react-router-dom";
const userId = localStorage.id
const teamId = localStorage.teamId
const theme = localStorage.theme

function UserFriendList() {
    const [ memberFreindReq, setMemberFreindReq ]= useState([]);
    const [ memberFreindList, setMemberFreindList ]= useState([]);
    const [ members, setMembers ] = useState([]);
    let history = useHistory();
    async function loadMemberProfile(){
        const getEmpDetail = await fetch (`/api/memberProfile/${userId}`).then( res => res.json());
        console.log('in friend list tab fetched Members friends detail is: ', getEmpDetail)
        setMemberFreindReq(getEmpDetail.friendRequests);
        setMemberFreindList(getEmpDetail.friendList);
    }
    async function loadMembers(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMembers(fetchMembers)
    }
    async function acceptFrnd(friendId){
        const friendData={
            friendId: friendId,
            userId: userId,
        }
        const apiResult = await fetch(`/api/acceptfriend/${userId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(friendData)
            }).then( result => result.json());
            console.log('friend added: ', apiResult.message)
        loadMemberProfile();
    }
    async function unFrnd(friendId){
        const friendData={
            friendId: friendId,
            userId: userId,
        }
        const apiResult = await fetch(`/api/unFriend/${userId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(friendData)
            }).then( result => result.json());
            console.log('friend added: ', apiResult.message)
        loadMemberProfile();
    }
    async function declineFrnd(friendId){
        const friendData={
            friendId: friendId,
            userId: userId,
        }
        const apiResult = await fetch(`/api/declinefriend/${userId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(friendData)
            }).then( result => result.json());
            console.log('friend added: ', apiResult.message)
        loadMemberProfile();
    }
    function directTo(name, id) {
        history.push(`/TeamDetail/${teamId}/MemberProfile/${name}/${id}/TimeLine`);
        document.location.reload(true);
    }
    useEffect(function(){
        loadMemberProfile();
        loadMembers()
    },[])
    return (
        <div className="row">
            <div className={ theme === 'Dark' ? "col-lg-4 myCardDark friendRequests mx-auto" : "col-lg-4 myCard friendRequests mx-auto" }>
                <h4>Friend Requests</h4>
                <hr/>
                <div className={ theme === 'Dark'? "myContainerDark" : "myContainer"}>
                    {memberFreindReq.length>0 ? <div>{memberFreindReq.length} friend request</div> : <div>no requests</div>}
                    {memberFreindReq ? memberFreindReq.map(friend=>
                        members.map(memb=>
                            memb._id == friend.memberId ? 
                            <div className={ theme === 'Dark'? "d-flex boxDark" : "d-flex boxLight"}>
                                <img className="houseMmb mx-auto mt-2" src={memb.profileImg? memb.profileImg: '' } alt=""/>
                                <div className="col-11 justify-content-around">
                                    <h6 className="col-10 text-left pl-4">{memb.name}</h6>
                                    <div className="d-flex col-8">
                                        <div className="myBtnNew3 col-6" onClick={()=>acceptFrnd(memb._id)}>Accept</div>
                                        <div className="myBtnNew3 col-6" onClick={()=>declineFrnd(memb._id)}>Decline</div>
                                    </div>
                                </div>
                            </div>
                            : ''
                            )
                        )
                    : <p>No requests</p>
                    }
                </div>
            </div>
            <div  className={ theme === 'Dark' ? "col-lg-7 myCardDark friendRequests mx-auto" : "col-lg-7 myCard friendRequests mx-auto"}>
                <h4>Friend List</h4>
                <hr/>
                <div className={ theme === 'Dark'? "myContainerDark" : "myContainer"}>
                    {memberFreindList.length>0 ? <div>{memberFreindList.length} friends</div> : <div>You have not added any Friends</div>}
                    {memberFreindList ? memberFreindList.map(friend=>
                        members.map(memb=>
                            memb._id == friend.friendId ? 
                            // "d-flex boxDark"
                            <div className={ theme === 'Dark'? "d-flex boxDark" : "d-flex boxLight"}>
                                <img className="frndThmnl mx-auto mt-2 hvrLink" src={memb.profileImg? memb.profileImg: '' } alt="membImage" onClick={()=>directTo(memb.name, memb._id)}/>
                                <div className="col-11 justify-content-around">
                                    <h6 className="hvrLink frndLnk col-10 text-left pl-4" onClick={()=>directTo(memb.name, memb._id)}>{memb.name}</h6>
                                    <div className="d-flex col-8">
                                        <div className="myBtnNew3 col-6" onClick={()=>unFrnd(memb._id)}>UnFriend</div>
                                    </div>
                                </div>
                            </div>
                            : ''
                            )
                        )
                    : <p>No Friends</p>
                    }
                </div>

            </div>

        </div>
    )
}

export default UserFriendList
