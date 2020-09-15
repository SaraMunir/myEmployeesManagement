import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
function MembLogIn() {
    // !localStorage.email ? "": localStorage.email
    const [ memberData, setMemberData ] = useState({ name: "", email: "", password: ""});
    const [ isLoggedIn, setIsLoggedIn ] = useState( false );
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ userTeamId, setTeamId] = useState()
    const inputEmail = useRef();
    const inputPassword = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target;
        setMemberData( { ...memberData, [id]: value } );
    }
    function handleCheckbox(){
        setMemberData( { ...memberData, rememberMe: !memberData.rememberMe } );
    }
    async function loginMember( e ){
        e.preventDefault();
        setMemberData({ name: "", email: "", membLeaderId: "", membTeamId: "", password: "", rememberMe: true })
        if( memberData.email === "" ) {
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your Email!' } );
            return;
        }
        if( memberData.password === "" || memberData.password.length < 8 ) {
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
                body: JSON.stringify(memberData)
            }).then( result=>result.json())

            console.log('after posting apiResult: ', apiResult)
            localStorage.setItem('id', apiResult.id);
            localStorage.setItem('name', apiResult.name);
            localStorage.setItem('type', 'Member');
            localStorage.setItem('theme', apiResult.theme);
            localStorage.setItem('teamId', apiResult.teamId);
            localStorage.setItem('house', apiResult.house);
            setTeamId(apiResult.teamId)
        if( !apiResult.message ){
            setAlertMessage( { type: 'danger', message: apiResult.error } );
            return;
        };
        setAlertMessage( { type: 'success', message: 'Loading, please wait...' } );
        // localStorage.email = ( apiResult.rememberMe ? apiResult.email : '' );
        setTimeout( function(){ 
            setIsLoggedIn(true);
            document.location.reload(true);
        }, 1000 );
    }
    return (
        <div style={{color: "black"}}>
            { isLoggedIn ? <Redirect to={`/UserProfile`} /> : '' }
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
                                    value={memberData.email} 
                                    onChange={handleInputChange} 
                                    ref={inputEmail}
                                    id="email" type="email" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label for="userPassword">Password</label>
                                <input 
                                    value={memberData.password} 
                                    onChange={handleInputChange} 
                                    ref={inputPassword}
                                    id="password" type="password" class="form-control" />
                            </div>
                            <button onClick={loginMember} type="button" class="btn btn-primary submit">Login</button>
                            &nbsp; 
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MembLogIn
