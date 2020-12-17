import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import LogOut from './components/LogOut';
import Dashboard from './components/AdminDashboard';
import MemberLogIn from './components/MembLogIn'
// import MemberDashboard from './components/NewTeam/TeamDashboard'
import UserProfile from './components/LoggedMember/UserProfile'
//starting fressh from below: 
import NewTeamsPage from './components/NewTeam/Teams'
import TeamDetail from './components/NewTeam/TeamDetail'
// import AnimationTrial from './components/Animation'

function App() {
  const theme = localStorage.theme;
  return (
    // App darkBackGrnd
    <div className={theme === 'Dark' ? "container-fluild App darkBackGrnd" : "container-fluild App"}>
      <Router>
        <Navbar />
        <Route exact path={["/","/HomePage"]} component={HomePage}/>
        <Route exact path="/ProfilePage" component={ProfilePage}/>
        <Route exact path="/LogIn" component={LogIn}/>
        <Route exact path="/MemberLogIn" component={MemberLogIn}/>
        <Route exact path="/SignUp" component={SignUp}/>
        <Route exact path="/logout" component={LogOut}/> 
        <Route exact path="/Dashboard" component={Dashboard}/>
        <Route path="/UserProfile" component={UserProfile}/>
        <Route exact path="/NewTeamsPage" component={NewTeamsPage}/>
        <Route path="/TeamDetail/:teamId" component={TeamDetail} />
        {/* <Route path={["/AnimationTrial"]} component={AnimationTrial} /> */}
      </Router>
    </div>
  );
}

export default App;
