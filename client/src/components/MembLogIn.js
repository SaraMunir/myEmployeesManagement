import React from 'react'

function MembLogIn() {
    return (
        <div style={{color: "black"}}>
            { isLoggedIn ? <Redirect to='/Dashboard' /> : '' }
            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">
                {alertMessage.message}
            </div>
            <section class="text-center">
                <div class="container">
                    <h1>Login</h1>
                    <p class="lead text-muted">Welcome back to Movie Maniax!</p>
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

export default MembLogIn
