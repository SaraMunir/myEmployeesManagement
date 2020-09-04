import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
function LogIn() {
    const [ userData, setUserData ] = useState({ name: "", email: localStorage.email, password: "", rememberMe: true });
    const [ isLoggedIn, setIsLoggedIn ] = useState( false );
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const inputEmail = useRef();
    const inputPassword = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target;
        setUserData( { ...userData, [id]: value } );
    }
    function handleCheckbox(){
        setUserData( { ...userData, rememberMe: !userData.rememberMe } );
    }
    async function loginUser( e ){
        e.preventDefault();
        setUserData({ name: "", email: localStorage.email, password: "", rememberMe: true })
        if( userData.email === "" ) {
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your Email!' } );
            return;
        }
        if( userData.password === "" || userData.password.length < 8 ) {
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your password!' } );
            return;
        }
        const apiResult = await fetch('/api/user/login', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            }).then( result=>result.json())

            localStorage.setItem("email", apiResult.email);
            localStorage.setItem('id', apiResult.id);
            localStorage.setItem('name', apiResult.name);

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
            { isLoggedIn ? <Redirect to='/Dashboard' /> : '' }
            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">
                {alertMessage.message}
            </div>
            <section class="text-center">
                <div class="container">
                    <h1>Login</h1>
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
                                <label for="userPassword">Password</label>
                                <input 
                                    value={userData.password} 
                                    onChange={handleInputChange} 
                                    ref={inputPassword}
                                    id="password" type="password" class="form-control" />
                            </div>
                            <button onClick={loginUser} type="button" class="btn btn-primary submit">Login</button>
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

export default LogIn
