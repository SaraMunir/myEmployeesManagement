import React,{useRef, useState} from 'react'
import heroImg from './assets/young-people-taking-selfie_23-2148462713.png';
import { Link, useLocation } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import makeGroup from './assets/add-notes-concept-illustration_114360-2496.jpg'
import addUser from './assets/add-user-concept-illustration_114360-557.jpg'
import createDisccusions from './assets/connecting-teams-concept-illustration_114360-665.jpg'
import createEvents from './assets/3187910.jpg'
import friends from './assets/design-community-concept-illustration_114360-1244.jpg'

const userType = localStorage.type
const userId = localStorage.id
const teamId = localStorage.teamId
const userName = localStorage.name
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop); 

function HomePage() {
    const [showStep, setShowStep] = useState(false);
    const showMe = useRef();
    function showMeme(){
        // showMe.current.focus();
        if(showStep===false){
            setShowStep(true)
        }else{
            setShowStep(false)
        }
        setTimeout(() => {
            scrollToRef(showMe)
        }, 100);
    }
    return (
        <div class="container mx-auto row hero">
            {/* { userId && userType=='Admin' ? <Redirect to='/NewTeamsPage'/> : '' }
            { userId && userType=='Member' ? <Redirect to={`/UserProfile/TimeLine`}/> : ''} */}
            <div class="col-6 mx-auto mt-5 text-left">
                <h1 className='heroText'>My <span style={{fontWeight: 'bold'}}>Collective</span> <br/> group</h1>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci sapiente delectus molestiae, ea quae amet perspiciatis facilis pariatur itaque magni iusto sunt reprehenderit assumenda quam exercitationem dicta maiores, quibusdam harum!</p>
                <div className="myBtnNew2 col-4 mt-3" onClick={showMeme}>learn More</div>
            </div>
            <div class="col-6 mx-auto">
                <img src={heroImg} alt=""style={{height: "85vh", width: "100%", objectFit:"contain"}}/>
            </div> 
            <div ref={showMe} className={showStep === true ? 'container-fluid col-12': 'hide'}>
                <div className="mx-auto howSteps row col-10">
                    <div className="col-lg-5 howToCard mx-auto">
                        <img className="howToImg mx-auto" src={makeGroup} alt="create groups"/>
                        <h2>1</h2>
                        <hr className="col-4 mx-auto" style={{borderWidth: '2px'}}/>
                        <h5>Create Group</h5>
                    </div>
                    <div className="mx-auto col-lg-1">
                        <i class="fas fa-2x fa-chevron-right" style={{marginTop: '25vh'}}></i>
                    </div>
                    <div className="col-lg-5 howToCard mx-auto">
                        <img className="howToImg" src={addUser} alt="create users"/>
                        <h2>2</h2>
                        <hr className="col-4" style={{borderWidth: '2px'}}/>
                        <h5>Add User</h5>
                    </div>
                </div>
                <div className="mx-auto howSteps row">
                    <div className="howToCard col-lg-3 mx-auto">
                        <img className="howToImg" src={createDisccusions} alt="create discussion"/>
                        <h2>3</h2>
                        <hr className="col-4 mx-auto" style={{borderWidth: '2px'}}/>
                        <h5>Create Discussions</h5>
                    </div>
                    <div className="mx-auto col-lg-1">
                        <i class="fas fa-2x fa-chevron-right" style={{marginTop: '20vh'}}></i>
                    </div>
                    <div className="howToCard col-lg-3 mx-auto">
                        <img className="howToImg" src={createEvents} alt="create discussion"/>
                        <h2>4</h2>
                        <hr className="col-4 mx-auto" style={{borderWidth: '2px'}}/>
                        <h5>Create Events</h5>
                    </div>
                    <div className="mx-auto col-lg-1">
                        <i class="fas fa-2x fa-chevron-right" style={{marginTop: '20vh'}}></i>
                    </div>
                    <div className="howToCard col-lg-3 mx-auto">
                        <img className="howToImg" src={friends} alt="create discussion"/>
                        <h2>5</h2>
                        <hr className="col-4 mx-auto" style={{borderWidth: '2px'}}/>
                        <h5>Make Friends</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
