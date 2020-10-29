import React from 'react'
import heroImg from './assets/young-people-taking-selfie_23-2148462713.png';
import { Link, useLocation } from "react-router-dom";
import { Redirect } from 'react-router-dom';
const userType = localStorage.type
const userId = localStorage.id
const teamId = localStorage.teamId
const userName = localStorage.name
// const userType = localStorage.type
function HomePage() {
    return (
        <div class="container mx-auto row hero">
            { userId && userType=='Admin' ? <Redirect to='/NewTeamsPage'/> : '' }
            { userType=='Member' ? <Redirect to={`/UserProfile/TimeLine`}/> : ''}
            <div class="col-6 mx-auto mt-5 text-left">
                <h1 className='heroText'>My <span style={{fontWeight: 'bold'}}>Collective</span> <br/> group</h1>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci sapiente delectus molestiae, ea quae amet perspiciatis facilis pariatur itaque magni iusto sunt reprehenderit assumenda quam exercitationem dicta maiores, quibusdam harum!</p>
                <div className="myBtnNew2">learn More</div>
            </div>
            <div class="col-6 mx-auto">
                <img src={heroImg} alt=""style={{height: "85vh", width: "100%", objectFit:"contain"}}/>
            </div> 
            
            {/* <div class="d-flex mx-auto">
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
            </div> */}
        </div>
    )
}

export default HomePage
