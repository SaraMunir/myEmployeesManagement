import React from 'react'
import heroImg from './assets/2522219.jpg';
import { Link, useLocation } from "react-router-dom";

function HomePage() {
    return (
        <div class="container hero">
            <div class="brd2 row mx-auto">
                <div class="col-5 mx-auto brd1 mt-5">
                    <h1 class="display-4 mt-5">Lets Get Started</h1>
                    <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                    <div className="d-flex col-10 mx-auto justify-content-between">
                        <Link to="/LogIn">
                            <div class="btn myBtn" href="#" role="button">Log In</div>
                        </Link>
                        <Link to="/SignUp">
                            <div class="btn myBtn" href="#" role="button">Sign Up</div>
                        </Link>
                    </div>
                </div>
                <div class="col-5 mx-auto brd1">
                    <img src={heroImg} alt=""/>
                </div>              
            </div>
        </div>
    )
}

export default HomePage
