import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';


function LogoutPage(){
    const [ isLoggedOut, setIsLoggedOut ] = useState( false );

    useEffect( function(){
        // attempt to request logout (only once)
        logoutRequest();
    }, [] );

    // call the api to logout (and clear session)
    async function logoutRequest(){
        localStorage.clear();
        setTimeout( function(){ 
            setIsLoggedOut(true); 
            document.location.reload(true)
        }, 1000 );
    }
    return (
        <div>
            {/* { isLoggedOut ? <Redirect to='/HomePage' /> : '' } */}
            { isLoggedOut === true ? <Redirect to='/HomePage' /> : '' }
            <section class="jumbotron text-center">
                <div class="container">
                    <p class="lead text-muted">Please wait, logging out...</p>
                </div>
            </section>
        </div>
    )
}

export default LogoutPage;