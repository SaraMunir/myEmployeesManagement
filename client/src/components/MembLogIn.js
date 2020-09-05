import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
function MembLogIn() {
    // !localStorage.email ? "": localStorage.email
    const [ userData, setUserData ] = useState({ name: "", email: "", membLeaderId: "", membTeamId: "", password: "", rememberMe: true });
    const [ isLoggedIn, setIsLoggedIn ] = useState( false );
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const inputEmail = useRef();
    const inputPassword = useRef();
    const inputMembLeader = useRef();
    const inputTeamId = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target;
        setUserData( { ...userData, [id]: value } );
    }
    function handleCheckbox(){
        setUserData( { ...userData, rememberMe: !userData.rememberMe } );
    }
    async function loginMember( e ){
        e.preventDefault();
        setUserData({ name: "", email: "", membLeaderId: "", membTeamId: "", password: "", rememberMe: true })
        if( userData.email === "" ) {
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your Email!' } );
            return;
        }
        if( userData.membLeaderId === "" ) {
            inputMembLeader.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your Leaders Id!' } );
            return;
        }
        if( userData.membTeamId === "" ) {
            inputTeamId.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your Team Id!' } );
            return;
        }
        if( userData.password === "" || userData.password.length < 8 ) {
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your password!' } );
            return;
        }
        console.log('posting member log in')
        const apiResult = await fetch('/api/member/login', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            }).then( result=>result.json())

            console.log('after posting apiResult: ', apiResult)
            localStorage.setItem('id', apiResult.id);
            localStorage.setItem('memberEmail', apiResult.email);
            localStorage.setItem('name', apiResult.name);
            localStorage.setItem('team', apiResult.team);
            localStorage.setItem('leader', apiResult.leader);
        if( !apiResult.message ){
            setAlertMessage( { type: 'danger', message: apiResult.error } );
            return;
        };
        setAlertMessage( { type: 'success', message: 'Loading, please wait...' } );
        localStorage.email = ( apiResult.rememberMe ? apiResult.email : '' );
        setTimeout( function(){ setIsLoggedIn(true); }, 1000 );
    }
    return (
        <div style={{color: "black"}}>
            { isLoggedIn ? <Redirect to='/MemberDashboard' /> : '' }
            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">
                {alertMessage.message}
            </div>
            <section class="text-center">
                <div class="container">
                    <h1>Member Login</h1>
                </div>
            </section>
            <div class="container">
                <div class="card">
                    <div class="card-body">
                        <form role="form">
                            <div class="form-group">
                                <label for="userEmail">Email Address</label>
                                <input 
                                    value={userData.email} 
                                    onChange={handleInputChange} 
                                    ref={inputEmail}
                                    id="email" type="email" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label for="memberLeaderId">Leader Id</label>
                                <input 
                                    value={userData.membLeaderId} 
                                    onChange={handleInputChange} 
                                    ref={inputMembLeader}
                                    id="membLeaderId" type="text" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label for="memberLeaderId">
                                    Team Id</label>
                                <input 
                                    value={userData.membTeamId} 
                                    onChange={handleInputChange} 
                                    ref={inputTeamId}
                                    id="membTeamId" type="text" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label for="userPassword">Password</label>
                                <input 
                                    value={userData.password} 
                                    onChange={handleInputChange} 
                                    ref={inputPassword}
                                    id="password" type="password" class="form-control" />
                            </div>
                            <button onClick={loginMember} type="button" class="btn btn-primary submit">Login</button>
                            &nbsp; 
                            <input type="checkbox" checked={userData.rememberMe} onChange={handleCheckbox} />                        
                            <label class='text-secondary' for='rememberMe'>Remember Me</label> &nbsp;
                            <a href="/register">Need to Register?</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MembLogIn
