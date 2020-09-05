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
       

//         team	5f2da4a917d7f78fcc7443be	
// leader	5f2da46817d7f78fcc7443bc	
// emails	suits@gmail.com	
// name	suits	
// id	5f530388aeef6b4434fd5bb6	
// email		

        setTimeout( function(){ setIsLoggedOut(true); }, 500 );
    }
    

    return (
        <div>
            { isLoggedOut ? <Redirect to='/HomePage' /> : '' }
            <section class="jumbotron text-center">
                <div class="container">
                    <p class="lead text-muted">Please wait, logging out...</p>
                </div>
            </section>
        </div>
    )
}

export default LogoutPage;