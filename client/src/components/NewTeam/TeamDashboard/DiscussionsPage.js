import React , {useState, useEffect, useRef}  from 'react'
import { Link, useLocation, useParams } from "react-router-dom";

function DiscussionsPage() {
    const { teamId } = useParams();
    const { discussionId } = useParams();
    const userId = localStorage.id;

    const [ members, setMembers ] = useState([]);
    const [ adminDetail, setAdminDetail ]= useState({});
    const [allMembers, setAllMembers]=useState([]);
    const [discutionPOst, setDiscutionPOst]=useState({});
    let allMembs=[]

    async function loadDiscussionPost(){
        const fetchDiscussion = await fetch (`/api/discussionPost/${discussionId}`).then( res => res.json());
        console.log('fetchDiscussion post: ', fetchDiscussion)
        setDiscutionPOst(fetchDiscussion);
    };
    async function loadMembers(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        allMembs = fetchMembers;
        setMembers(fetchMembers)
        // setAllMembers(...allMembers, ...fetchMembers)
    }
    async function loadAdminProfile(){
        const getAdmnDetail = await fetch (`/api/adminProfile/${userId}`).then( res => res.json());
        setAdminDetail(getAdmnDetail);
        allMembs.push(getAdmnDetail);
        setAllMembers(allMembs)
    }
    useEffect(function(){
        loadDiscussionPost();
        loadMembers();
        loadAdminProfile();
    },[])
    return (
        <div>
            <h3>
            
            {discutionPOst.discussionTitle}

            </h3>
        </div>
    )
}

export default DiscussionsPage
