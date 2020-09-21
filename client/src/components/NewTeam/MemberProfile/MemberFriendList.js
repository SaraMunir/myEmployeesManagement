import React, {useState, useEffect, useContext  } from 'react'
import { UserContext } from './MemberProfile';
import { Link, useHistory } from "react-router-dom";

const userId = localStorage.id
const teamId = localStorage.teamId
const userType = localStorage.type
const theme = localStorage.theme;

function MemberFriendList(props) {
    let history = useHistory();

    const [ members, setMembers ] = useState([]);
    const [ membersFrndList, setMembersFrndList ] = useState([]);
    const { memberFriend } = useContext(UserContext);
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        let membersFrndList=[];
        fetchMembers.map(member=> 
            {
                memberFriend.map(friend=>{
                    if(friend.friendId == member._id){
                        membersFrndList.push(member)
                    }
                })
            }
        )
        console.log(memberFriend)
        console.log('membersFrndList: ', membersFrndList)
        setMembersFrndList(membersFrndList)
        setMembers(fetchMembers)
    }
    function directTo(name, id) {
        history.push(`/TeamDetail/${teamId}/MemberProfile/${name}/${id}/TimeLine`);
        document.location.reload(true);
    }
    useEffect(function(){
        loadMember()
    },[])
    return (
        <div className="row">
            {
            memberFriend.map(friend=>
                members.map(member=>
                    member._id == friend.friendId ? 
                    <div className="membThms">
                        <img src={member.profileImg} alt="membImage" className="sqrThmbNl cursor" onClick={()=>directTo(member.name, member._id)}/>
                        <p className="sqrThmbNlname">{member.name} </p>
                    </div>
                    : '' 
                    )
                )}
        </div> 
    )
}

export default MemberFriendList
