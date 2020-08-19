import React, { useState, useContext, useEffect }  from 'react'
import { UserContext } from '../TeamPage/TeamPage';
import { Link, useParams } from "react-router-dom";


function TeamDashBoard(props) {
    const { teamId } = useParams();

    const {teamDetail, teamMembersDetail, femaleMembersDetail, maleMembersDetail} = useContext(UserContext);


    
    useEffect(function(){
        
        console.log('is it loading')
    },[])
    // const employeNum = parseInt(teamDetail.teamMembers.length)
    return (
        <div>
            <main role="main" class="inner cover">
                <div className="card mb-3 mt-3">
                    <div className="card-body">
                        <h1 class="cover-heading">{teamDetail.teamName}</h1>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <h2 class="cover-heading">Team Member</h2>
                        <h3>total no of Members: {teamMembersDetail.length}</h3>
                        {/* <h3>total no of Members: {teamMembersDetail[0].membName}</h3> */}
                        <div className="row mx-auto">
                            <div class="card mx-auto">
                                <div className="card-body">
                                    <h3>Female Members: </h3>
                                    <h5>total no of Female Members: {femaleMembersDetail.length}</h5>
                                    <ul class="list-group  text-left">
                                        {teamMembersDetail.filter(memb => memb.membSex =='F').map(filteredName => (
                                        <li class="list-group-item">{filteredName.membName}</li>))}
                                    </ul>
                                </div>
                            </div>
                            <div  class="card mx-auto">
                                <div className="card-body">
                                    <h3>Male Members:</h3>
                                    <h5>total no of Male Members: {maleMembersDetail.length}</h5>
                                    <ul class="list-group text-left">
                                    {teamMembersDetail.filter(memb => memb.membSex =='M').map(filteredName => (
                                        <li  class="list-group-item">{filteredName.membName} </li>))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body row">
                        {teamMembersDetail.map( memb => {
                    switch (memb.membSex){
                        case "F":
                            return <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                            <div class="card mx-auto">
                                    <div class="card-body">
                                        <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" class="empAvatarThmb"/>
                                        <h5 class="">{memb.membName}</h5>
                                    </div>
                            </div>
                                </Link>
                        case "M":
                            return  <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                            <div class="card mx-auto">
                                <div class="card-body">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EdmT6pfXNT_HO-f842hBiYEzHCwGGLsrEnkm-zqw74FoOb4&s" alt="" class="empAvatarThmb"/>
                                    <h5 class="card-title">{memb.membName}</h5>
                                </div>
                            </div>
                            </Link>
                        default:   return <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                        <div class="card mx-auto">
                            <div class="card-body">
                                <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" alt="" class="empAvatarThmb"/>
                                <h5 class="card-title">{memb.membName}</h5>
                            </div>
                        </div>
                    </Link>
                        } }
                        )}
                    </div>
                </div>
                <div className="row mt-3 mx-auto">
                    <div className="card col-6 mx-auto" style={{"width": "100%"}}>
                        <div className="card-body">
                            <h4>calendar</h4>
                            <table class="table table-bordered table-dark">
                                <thead>
                                    <tr>
                                    <th scope="col">su</th>
                                    <th scope="col">mo</th>
                                    <th scope="col">tu</th>
                                    <th scope="col">tu</th>
                                    <th scope="col">tu</th>
                                    <th scope="col">tu</th>
                                    <th scope="col">tu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                    <td>4</td>
                                    <td>5</td>
                                    <td>6</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>8</td>
                                    <td>9</td>
                                    <td>10</td>
                                    <td>11</td>
                                    <td>12</td>
                                    <td>13</td>
                                    <td>14</td>
                                </tr>
                                <tr>
                                    <td>15</td>
                                    <td>16</td>
                                    <td>17</td>
                                    <td>18</td>
                                    <td>19</td>
                                    <td>20</td>
                                    <td>21</td>
                                </tr>
                                <tr>
                                    <td>22</td>
                                    <td>23</td>
                                    <td>24</td>
                                    <td>25</td>
                                    <td>26</td>
                                    <td>27</td>
                                    <td>28</td>
                                </tr>
                                <tr>
                                    <td>29</td>
                                    <td>30</td>
                                    <td>31</td>
                                    <td style={{color: "grey"}}>1</td>
                                    <td style={{color: "grey"}}>2</td>
                                    <td style={{color: "grey"}}>3</td>
                                    <td style={{color: "grey"}}>4</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-6 mx-auto" >
                        <div class="input-group mb-2">
                            <div class="input-group-prepend" style={{"min-height": "130px"}}>
                                <div class="input-group-text" style={{ "width":"100px"}}>
                                    <i class="fas fa-2x fa-birthday-cake mx-auto"></i>
                                </div>
                            </div>
                            <div className="form-control" style={{"min-height": "130px"}}>
                                <h5 className="text-left">upcoming birthday</h5>
                                <div className="d-flex text-left">
                                    <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" class="" style={{"width": "15vh"}}/>
                                    <div className="empSumm ml-3">
                                        <p>sara munir</p>
                                        <p>Lorem ipsum dolor sit.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend" style={{"min-height": "130px"}}>
                                <div class="input-group-text" style={{ "width":"100px"}}>
                                    <i class="far fa-newspaper fa-2x mx-auto"></i>
                                </div>
                            </div>
                            <div className="form-control" style={{"min-height": "130px"}}>
                                <h5 className="text-left">News</h5>
                                <div className="d-flex text-left">
                                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore itaque repudiandae in corrupti...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TeamDashBoard
