import React, {useState, useEffect, useContext  } from 'react'
import { UserContext } from './MemberProfile';
import { Link } from "react-router-dom";

const userId = localStorage.id
const teamId = localStorage.teamId
const userType = localStorage.type
const theme = localStorage.theme;

function MemberFriendList(props) {
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
    useEffect(function(){
        loadMember()
    },[])
    return (
        <div className="row">
            {
            memberFriend.map(friend=>
                // friend.friendId
                members.map(member=>
                    member._id == friend.friendId ? 
                    <div className="membThms">
                        <Link to={`/TeamDetail/${teamId}/MemberProfile/${member.name}/${member._id}`} ><img src={member.profileImg} alt="membImage" className="sqrThmbNl"/></Link>
                        <p className="sqrThmbNlname">{member.name} </p>
                    </div>
                    : '' 
                    )
                )}
        </div> 
    )
}

export default MemberFriendList
