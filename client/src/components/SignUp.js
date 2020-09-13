import React, { useState, useRef, useEffect} from 'react'
import { Redirect } from 'react-router-dom';
function SignUp() {
    const [ userData, setUserData ] = useState({ name: "", email: "", password: ""});
    const [ isRegistered, setIsRegistered ] = useState( false );
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ emails, setEmails ] = useState([]);
    const inputEmail = useRef();
    const inputPassword = useRef();
    async function handleInputChange( e ){
        const { id, value } = e.target;
        setUserData( { ...userData, [id]: value });
    }
    async function loadUserEmail(){
        const fetchEmail = await fetch (`/api/checkEmail`).then( res => res.json());
        setEmails(fetchEmail)
    }
    async function signUpUser( e ){
        let checkEmailExist = false;
        emails.map(email=>
            {if(userData.email == email){checkEmailExist = true;} })
        e.preventDefault();
        if( userData.email === "" ) {
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your Email!' } );
            return;
        }
        if( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) ) {
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide a valid Email!' } );
            return;
        }
        if( userData.password === "" ) {
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide a password!' } );
            return;
        }
        if( userData.password.length < 8 ) {
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide a longer password (8 characters min)!' } );
            return;
        } 
        if ( checkEmailExist == true ){
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Email address already exist, please provide a different email address!' } );
            return;
        }
        localStorage.clear();
        console.log('finished?')
        const registerUser = await fetch('/api/user/signUp',
            {
                method: 'post', 
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( userData )
            }).then( result=>result.json())

            if( registerUser.message ){
                setAlertMessage( {type:'success',
            message:'Thank you successfully registered!'} );
            setTimeout( function(){ setIsRegistered(true); }, 1000 );
            }else {
                setAlertMessage( { type: 'danger', message: 'Try again' } );
            }
            setUserData({ name: "", email: "", password: ""})
    }
    useEffect(function(){
        loadUserEmail()
    },[])
    return (
        <div class="container-fluid text-left">
            { isRegistered ? <Redirect to='/login' /> : '' }
            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">
                {alertMessage.message}
            </div>
            <div class="col-8 mx-auto card mt-5">
                <form class="card-body ">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input 
                        value={userData.name}
                        onChange={handleInputChange}
                        id="name"
                        type="text"
                        class="form-control" aria-describedby="fullName" placeholder="Enter full name"/>
                    </div>
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input 
                        value={userData.email} 
                        onChange={handleInputChange}
                        ref={inputEmail}
                        id="email" 
                        type="email" class="form-control" placeholder="Enter email"/>
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input
                        value={userData.password} 
                        onChange={handleInputChange} 
                        ref={inputPassword}
                        id="password" 
                        type="password" class="form-control" placeholder="Password"/>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div>
                    <button  onClick={signUpUser} type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp
