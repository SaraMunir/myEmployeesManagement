import React from 'react'
import heroImg from './assets/corporate-portrait-office-workers-employees/5471.jpg';
import { Link, useLocation } from "react-router-dom";
import { Redirect } from 'react-router-dom';
const userType = localStorage.type
const userId = localStorage.id
// const userType = localStorage.type
function HomePage() {
    return (
        <div class="container mx-auto row hero">
            { userId && userType=='Admin' ? <Redirect to='/NewTeamsPage'/> : '' }
            { userId && userType=='Member' ? <Redirect to='/MemberProfile'/> : ''}
            <div class="col-10 mx-auto">
                <img src={heroImg} alt=""style={{height: "40vh", width: "100%", objectFit:"cover"}}/>
            </div> 
            { userId ? '' : <div class="d-flex mx-auto">
                <div class="col-5 mx-auto loginSect">
                    <h4 class="mt-5">Team Leader Log In</h4>
                    <p class="lead">Are you leader who is the best in leading a team of wonderful and brilliant people. Lets get started</p>
                    <div className="d-flex col mx-auto justify-content-between">
                        <Link to="/LogIn">
                            <div class="myBtnNew" href="#" role="button">Log In</div>
                        </Link>
                        <Link to="/SignUp">
                            <div class="myBtnNew" href="#" role="button">Sign Up</div>
                        </Link>
                    </div>
                </div>
                <div class="col-5 mx-auto loginSect">
                    <h4 class="mt-5">Team Member Log In</h4>
                    <p class="lead">Are you team player? lets get started</p>
                    <div className="d-flex col-10 mx-auto justify-content-between">
                        <Link to="/MemberLogIn" className="mx-auto">
                            <div class="myBtnNew mx-auto" href="#" role="button">Log In</div>
                        </Link>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default HomePage
