import React, {useState, useEffect} from 'react';
import { Link, useParams, Redirect } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

// import MyCalendar from "./Calendar/MyCalendar"
import OnHoverScrollContainer from "../scroll/CustomScrollDiv";
// import Birthdays from "./TeamDashboard/Birthdays.js"
import TeamNavbar from "./TeamDashboard/TeamNavbar"
import HomePage from "./TeamDashboard/HomePage/HomePage"
import DiscussionBoard from "./TeamDashboard/Discussions/DiscussionBoard"
import EventsPage from './TeamDashboard/Events/EventsPage';
import DiscussionPage from './TeamDashboard/Discussions/DiscussionsPage';
import EventDetail from './TeamDashboard/Events/EventDetail';
const userType = localStorage.type
const theme = localStorage.theme;
const userId = localStorage.id;

function TeamDashboard() {
    const { teamId } = useParams();
    const [teamDetail, setTeamDetail]= useState( {});
    const [teamAdmin, setTeamAdmin]= useState('');
    const [members, setMember] = useState([]);
    // const [membersBirth, setMembersBirth] = useState([]);
    const [closestBirth, setClosestBirth] = useState([]);
    const [upcomingBirthday, setUpcomingBirthday] = useState([]);
    const [todayBirth, setTodayBirth] = useState([]);
    const [houses, setHouses] = useState([]);

    async function loadTeamDetail(){
        const fetchTeamDetail = await fetch (`/api/teamDetails/${teamId}`).then( res => res.json());
        console.log('fetched team detail is: ', fetchTeamDetail)
        setTeamDetail(fetchTeamDetail);
        setTeamAdmin(fetchTeamDetail.teamAdmin)

    }
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMember(fetchMembers)
        const membBirthday=[];
        const membCurrentDateBirth=[];
        const upcomingBirthday=[];
        var d = new Date();
        var thisMonth = (d.getMonth() + 1);
        var today = d.getDate();
        fetchMembers.map((member)=>{
            if(member.birthday){
                let birthDay = member.birthday.split("-");
                let birthMonth = birthDay[1]
                let birthDate = birthDay[2]
                if (birthMonth == thisMonth){
                    membBirthday.push(member);
                    if(birthDate ==  today){
                        membCurrentDateBirth.push(member)
                    } else if (birthDate >  today){
                        upcomingBirthday.push(member)
                    }
                    }
                }
            });
            membBirthday.sort(function(a, b){
                let birthDay1 = a.birthday.split("-");
                let birthDay2 = b.birthday.split("-");
                return (birthDay1[2] > birthDay2[2] ? 1 : -1 )} );
            upcomingBirthday.sort(function(a, b){
                let birthDay1 = a.birthday.split("-");
                let birthDay2 = b.birthday.split("-");
                return (birthDay1[2] > birthDay2[2] ? 1 : -1 )} );
            console.log('members after sorting: ', membBirthday);
            // setMembersBirth(membBirthday);
            setUpcomingBirthday(upcomingBirthday);
            setClosestBirth(membBirthday)
            setTodayBirth(membCurrentDateBirth);
        }
    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses);
    }
    const object ={
        theme: theme,
        OnHoverScrollContainer: OnHoverScrollContainer,
        todayBirth: todayBirth,
        upcomingBirthday: upcomingBirthday
    }
    useEffect(function(){
        // loadTeamDetail()
        // loadMember()
        // loadHouse()
    },[])
    return (
        <div>
            { userId ? '' : <Redirect to={`/HomePage`}/>}
            <Router>
                <TeamNavbar teamId={teamId} />
                <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/HomePage`]} component={HomePage}/>
                <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/DiscussionBoard`]} component={DiscussionBoard}/>
                {/* /TeamDetail/${teamId}/TeamDashboard/DiscussionBoard/DiscussionPage/${discussion._id} */}
                <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/DiscussionBoard/DiscussionPage/:discussionId`]} component={DiscussionPage} teamAdmin={teamAdmin}/>
                <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/EventsPage`]} component={EventsPage}/>
                {/* /TeamDetail/${teamId}/TeamDashboard/EventsPage/Event/${event._id} */}
                <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/EventsPage/Event/:eventId`]} component={EventDetail}/>
            </Router>

        </div>
    )
}

export default TeamDashboard

