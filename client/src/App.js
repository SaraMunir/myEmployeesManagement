import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import MyTeam from './components/MyTeam';
import LogOut from './components/LogOut';
import Dashboard from './components/Dashboard';
import TeamPage from './components/TeamPage/TeamPage';
import Employees from './components/TeamPage/Employees';
import MembProfile from './components/TeamPage/MembProfile';
import MemberLogIn from './components/MembLogIn'

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Route exact path={["/","/HomePage"]} component={HomePage}/>
        <Route exact path={["/ProfilePage"]} component={ProfilePage}/>
        <Route exact path={["/LogIn"]} component={LogIn}/>
        <Route exact path={["/MemberLogIn"]} component={MemberLogIn}/>
        <Route exact path={["/SignUp"]} component={SignUp}/>
        <Route exact path={["/MyTeam"]} component={MyTeam}/>
        <Route exact path={["/logout"]} component={LogOut}/>
        <Route exact path={["/Dashboard"]} component={Dashboard}/>
        <Route path={["/TeamPage/:teamId"]} component={TeamPage} />
        {/* <Route path={["/TeamPage/MembProfile/:teamId/:membId"]} component={MembProfile}/> */}
      </Router>
    </div>
  );
}

export default App;
