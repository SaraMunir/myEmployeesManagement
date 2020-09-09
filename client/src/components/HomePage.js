import React from 'react'
import heroImg from './assets/2522219.jpg';
import { Link, useLocation } from "react-router-dom";
import { Redirect } from 'react-router-dom';

const userId = localStorage.id
// const userType = localStorage.type
function HomePage() {
    return (
        <div class="container mx-auto row hero">
            {/* { userId ? <Redirect to='/NewTeamsPage' /> : <Redirect to='/HomePages } */}
            <div class="col-5 mx-auto brd1">
                <img src={heroImg} alt=""/>
            </div> 
            {!userId ? <div class="brd2 d-flex mx-auto">
                <div class="col-5 mx-auto brd1 mt-5 teamLead">
                    <h1 class="display-4 mt-5">Team Leader Log In</h1>
                    <p class="lead">Are you leader who is the best in leading a team of wonderful and brilliant people. Lets get started</p>
                    <div className="d-flex col mx-auto justify-content-between">
                        <Link to="/LogIn">
                            <div class="btn myBtn" href="#" role="button">Log In</div>
                        </Link>
                        <Link to="/SignUp">
                            <div class="btn myBtn" href="#" role="button">Sign Up</div>
                        </Link>
                    </div>
                </div>
                <div class="col-5 mx-auto brd1 mt-5 teamMemb">
                    <h1 class="display-4 mt-5">Team Member Log In</h1>
                    <p class="lead">Are you team player? lets get started</p>
                    <div className="d-flex col-10 mx-auto justify-content-between">
                        <Link to="/MemberLogIn" className="mx-auto">
                            <div class="btn myBtn mx-auto" href="#" role="button">Log In</div>
                        </Link>
                    </div>
                </div>
            </div> : ''}
        </div>
    )
}

export default HomePage
