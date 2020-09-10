const mongoose = require('mongoose');
const bcrypt = require ( 'bcrypt' );

const { v4: uuidv4 } = require('uuid');
var short = require('short-uuid');

// mongoose.connect(`mongodb://${process.env.movieTracker}`,{useNewUrlParser: true});

mongoose.connect(`mongodb://localhost:27017/myEmployeeManagement`, {useNewUrlParser: true, useFindAndModify: false});
const db = require( './models' );
const e = require('express');

async function registerUser( userData ){
    if( !userData.password || !userData.name || !userData.email ){
        return { message: "Invalid user data", id: "", name: "" };
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);    
    const saveData = {
        name: userData.name,
        email: userData.email,
        password: passwordHash
    };

    const dbUser = new db.users( saveData );
    const saveUser = await dbUser.save();
    return { 
        message: "User successfully saved", 
        id: saveUser._id,
        email: saveUser.email,
        name: saveUser.name 
    };           
}
async function loginUser( email, password ) {
    const userData = await db.users.findOne({ email: email });
    if( !userData ) {
        return { error: "Couldn't find that email. Register or try again!" };
    }
    const isValidPassword = await bcrypt.compare( password, userData.password );
    if( !isValidPassword ) {
        return { error: "Invalid password" };
    }
    // remap the data into the specified fields as we are using camelCase
    return {
        message: "user successfully loggedin",
        id: userData._id,
        name: userData.name,
        email: userData.email,
    };
}
// getTeams
async function getAdmin( userId ){
    const getAdmin = await db.users.findOne({
        "_id" : userId
    })
    return getAdmin
}
async function loginMember( userData ) {
    // name: "", email: localStorage.email, membLeaderId: "", membTeamId: "", password: "", rememberMe: true 
    const admindId = userData.membLeaderId;
    const membTeamId = userData.membTeamId;
    const email = userData.email;
    const membPassword = userData.password;
    console.log('in orm logged in member Info received: ', userData)
    const memberData = await db.users.findOne({ _id: admindId});
    console.log('fetched data in orms: ', memberData.teams);
    if( !memberData ) {
        return { error: "Couldn't find the Leader Id. Register or try again!" };
    }
    // let memberFinalData ={
    //     name: '',
    //     id: '',
    //     team: '',
    //     leader: '',
    //     email: '',
    //     error: ''
    // };
    let teamMember={}
    memberData.teams.forEach(async function(team){
        if(team._id == membTeamId){
            // // console.log('team: ', team.teamName)
            // memberFinalData.name = team.teamName;
            // memberFinalData.id = team._id;
            team.teamMembers.forEach(async function(member){
                if(member.email == email){
                    teamMember = member
                }
            })

        }
    })
    console.log('teamMember Now: ', teamMember)
    const isValidPassword = await bcrypt.compare( membPassword, teamMember.membPassword );
    if( !isValidPassword ) {
        return { error: "Invalid password" };
    }
    return {
        message: "user successfully loggedin",
        id: teamMember.id,
        name: teamMember.membName,
        email: teamMember.email,
        leader: admindId,
        team: membTeamId
    };
}
async function postTeams( userTeams ){
    const userId = userTeams.adminId
    const teamData = {
        'teamName': `${userTeams.teamName}`,
        'teamDesc': `${userTeams.teamDesc}`,
    };
    const createTeam = await db.users.findOneAndUpdate({ _id: userId }, { $push: {teams: teamData} });
    return { 
        message: "team successfully saved", 
    };   
}
async function postRoles( userRoles ){
    const teamID = userRoles.teamId
    const userId = userRoles.adminId
    const roleData = {
        'roleName': `${userRoles.roleName}`,
        'roleDesc': `${userRoles.roleDesc}`,
    };
    const createRole = await db.users.findOneAndUpdate(
        { _id: userId, "teams._id": teamID }, 
        { $push: { "teams.$.teamRoles": roleData }});
    return { 
        message: "role successfully saved", 
    };   
}

async function postEmployee( employee ){
    const teamID = employee.teamId;
    const userId = employee.userId;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(employee.membPassword, saltRounds); 
    const employeeData = {
        'membName': `${employee.membName}`,
        'membDesc': `${employee.membDesc}`,
        'membRole': `${employee.membRole}`,
        'membSex': `${employee.membSex}`,
        'membPassword': passwordHash,
        'address': `${employee.address}`,
        'birthday': `${employee.birthday}`,
        'email': `${employee.email}`,
        'phoneNumber': `${employee.phoneNumber}`,
        'status':`${employee.status}`
    };
    const createEmployee = await db.users.findOneAndUpdate(
        { _id: userId, "teams._id": teamID }, 
        { $push: { "teams.$.teamMembers": employeeData }});
    return { 
        message: "employee successfully created", 
    };   
}
// getTeams
async function getTeams( userId ){
    const getTeams = await db.users.find({
        "_id" : userId
    })
    return getTeams
}
// getRoles
async function getRoles( userId, teamId ){
    const getRoles = await db.users.find({
        "_id" : userId 
    })
    let teamsRoleArr = getRoles[0].teams;
    teamsRoleArr.forEach( team =>{
        if(team._id == teamId){
            teamsRoleArr = team.teamRoles;
        }
    })
    return teamsRoleArr
}
// getEmployees
async function getEmployees( userId, teamId ){
    const getEmployees = await db.users.find({
        "_id" : userId 
    })
    let teamsEmployeeArr = getEmployees[0].teams;
    teamsEmployeeArr.forEach( team =>{
        if(team._id == teamId){
            teamsEmployeeArr = team.teamMembers;
        }
    })
    return teamsEmployeeArr
}
// getEmployee detail
async function getMembDet( userId, teamId, membId ){
    const getMembDetail = await db.users.find({
        "_id" : userId 
    })
    let memberDetail={};
    let teamsEmployeeArr = getMembDetail[0].teams;
    teamsEmployeeArr.forEach( team =>{
        if(team._id == teamId){
            team.teamMembers.forEach(member =>{
                if(member._id == membId){
                    memberDetail = member;
                    return memberDetail
                }
            })
        }
    })
    return memberDetail
}
// deleteRole
async function deleteRole( allId ){
    const userId = allId.adminId
    const teamId = allId.teamId
    const roleId = allId.roleId
    const deleteRole = await db.users.findOneAndUpdate(
        { _id: userId, "teams._id": teamId }, 
        { "$pull": { "teams.$.teamRoles": {_id: roleId} }});
    return deleteRole;
}
// deleteEmployee
async function deleteEmployee( allId ){
    const userId = allId.adminId
    const teamId = allId.teamId
    const employeeId = allId.employeeId

    const deleteEmployee = await db.users.findOneAndUpdate(
        { _id: userId, "teams._id": teamId }, 
        { "$pull": { "teams.$.teamMembers": {_id: employeeId} }});
    return deleteEmployee;
}
// getTeams
async function getTeamDetail( teamId, userId ){
    const getTeams = await db.users.find({
        "_id" : userId
    })
    let teamDetailArr = getTeams[0].teams
    teamDetailArr.forEach(team => {
        if (team._id == teamId ){
            teamDetailArr = team;
        }
    });
    return teamDetailArr;
}

//updateEmployee Info
async function updateEmployee( userEmployee, allId  ){
    const updateEmpInfo = await db.users.findOneAndUpdate(
        { _id: allId.userId},
            { "$set": 
                { "teams.$[updateTeams].teamMembers.$[updateMemb]": userEmployee }
            }, {
                "arrayFilters": [
                    {"updateTeams._id" : allId.teamId},
                    {"updateMemb._id" : allId.membId}
                ]
            }
    );

    return { userEmployee: userEmployee }

}



// //multer
// async function updateAvatar( userId, imageUrl ){
//     const imageData = {
//         profileImg: imageUrl
//     };
//     const dbResult = await db.users.findOneAndUpdate({_id: userId}, imageData);
//     const userFetch = await db.users.findOneAndUpdate({ _id: userId }, { $push: { friendList: {image: imageData} } });
//     return { message: `Thank you, updated` }
// }

//new stuff: 
//  posting team:
async function postNewTeam( userTeams ){
    // const userId = userTeams.adminId
    const teamData = {
        'teamName': `${userTeams.teamName}`,
        'teamDesc': `${userTeams.teamDesc}`,
        'teamAdmin': `${userTeams.adminId}`,
        'teamAdminName': `${userTeams.adminName}`,
    };
    const dbTeam = new db.teams( teamData );
    const saveTeam = await dbTeam.save();

    return { 
        message: "team successfully saved", 
    };   
}
async function getAllTeams( userId ){
    const getAllTeams = await db.teams.find({
        "teamAdmin" : userId
    })
    return getAllTeams
}
//posting roles
async function postNewRoles( userRoles ){
    const teamID = userRoles.teamId
    const userId = userRoles.adminId
    const roleData = {
        'roleName': `${userRoles.roleName}`,
        'roleDesc': `${userRoles.roleDesc}`,
    };
    const createRole = await db.teams.findOneAndUpdate(
        { _id: teamID}, 
        { $push: { "teamRoles": roleData }});
    return { 
        message: "role successfully saved", 
    };   
}
//fetching all roles
async function getAllRoles( teamId ){
    const getAllRoles = await db.teams.find({
        "_id" : teamId 
    })
    // console.log('getAllRoles ', getAllRoles[0].teamRoles)
    return getAllRoles[0]
}
// deleteRole
async function deleteNewRole( allId ){
    // const userId = allId.adminId
    const teamId = allId.teamId
    const roleId = allId.roleId
    const deleteRole = await db.teams.findOneAndUpdate(
        { _id: teamId}, 
        { "$pull": { "teamRoles": {_id: roleId} }});
    return deleteRole;
}
// fetchign team detail
async function getTeamDetails( teamId ){
    const getTeams = await db.teams.find({
        "_id" : teamId
    })
    return getTeams[0];
}
// postMember
async function postMember( memberInfo ){

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(memberInfo.membPassword, saltRounds);    
    const memberData = {
        'teamId': `${memberInfo.teamId}`,
        'name': `${memberInfo.membName}`,
        'role': `${memberInfo.membRole}`,
        'email': `${memberInfo.membEmail}`,
        'sex': `${memberInfo.membSex}`,
        'membPassword': passwordHash
    };
    const dbMember = new db.members( memberData );
    const saveMember = await dbMember.save();
    return { 
        message: "Member successfully saved", 
    };   
}
async function getMembers( teamId ){
    const getAllMembers = await db.members.find({
        "teamId" : teamId
    })
    return getAllMembers
}
async function deleteMember( membId ){
    const deleteMember = await db.members.deleteOne({
        "_id" : membId
    })
    return deleteMember
}
async function getMemberDetail( membId ){
    const getMembDetail = await db.members.find({
        "_id" : membId
    })
    return getMembDetail
}
async function updateMember( userEmployee, membId  ){
    console.log('in orm: ', userEmployee.address)
    const updateMembInfo = await db.members.findOneAndUpdate(
        { _id: membId},
            { "$set": userEmployee}
    );
    return { 
        message: "Member successfully Updated", 
    };

}
//uploading image
async function updateAvatar( userId, imageUrl ){
    const imageData = {
        profileImg: imageUrl
    };
    console.log('imageData : ', imageData)
    const dbResult = await db.members.findOneAndUpdate(
        {_id: userId}, {"$set": imageData});
    // const userFetch = await db.users.findOneAndUpdate({ _id: userId }, { $push: { friendList: {image: imageData} } });

    return { message: `Thank you, updated` }
}
async function postHouse( memberInfo ){

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(memberInfo.housePin, saltRounds);    
    const houseData = {
        'houseName': `${memberInfo.houseName}`,
        'about': `${memberInfo.about}`,
        'teamId': `${memberInfo.teamId}`,
        'houseLeader': memberInfo.houseLeader,
        'houseColor': memberInfo.houseColor,
        'housePin': passwordHash
    };
    const dbHouse = new db.house( houseData );
    const saveHouse = await dbHouse.save();
    return { 
        message: "House successfully saved", 
    };   
}
async function getHouses( teamId ){
    const getAllHouses = await db.house.find({
        "teamId" : teamId
    })
    return getAllHouses
}
async function deleteHouse( houseId ){
    const deleteHouse = await db.house.deleteOne({
        "_id" : houseId
    })
    return deleteHouse
}
async function loginHouse(  houseData, houseId ) {
    console.log( 'in orm id received is: ', houseId)
    const userData = await db.house.findOne({ _id: houseId });
    console.log('received data in orm: ', userData)
    if( !userData ) {
        return { error: "Couldn't find such house. Register or try again!" };
    }
    const isValidPassword = await bcrypt.compare( houseData.housePin, userData.housePin );
    if( !isValidPassword ) {
        return { error: "Invalid Pin" };
    }
    // remap the data into the specified fields as we are using camelCase
    return {
        message: "user successfully loggedin",
        // id: userData._id,
        // name: userData.name,
        // email: userData.email,
    };
}
// getHouseDetail
async function getHouseDetail( houseId ){
    const getHouseDetail = await db.house.find({
        "_id" : houseId
    })
    return getHouseDetail
}
//uploading image
async function updateHouseAvatar( userId, imageUrl ){
    const imageData = {
        profileImg: imageUrl
    };
    const dbResult = await db.house.findOneAndUpdate(
        {_id: userId}, {"$set": imageData});
    // const userFetch = await db.users.findOneAndUpdate({ _id: userId }, { $push: { friendList: {image: imageData} } });

    return { message: `Thank you, updated` }
}


module.exports = {
    registerUser,
    loginUser,
    getAdmin,
    loginMember,
    postTeams,
    getTeams, 
    getTeamDetail,
    postRoles,
    getRoles,
    deleteRole,
    postEmployee,
    getEmployees,
    deleteEmployee,
    updateAvatar,
    getMembDet,
    updateEmployee, 
    
    // new stuffs
    postNewTeam,
    getAllTeams,
    postNewRoles,
    getAllRoles,
    deleteNewRole,
    getTeamDetails,
    postMember,
    getMembers,
    deleteMember,
    getMemberDetail,
    updateMember,
    postHouse,
    getHouses,
    deleteHouse,
    loginHouse,
    getHouseDetail,
    updateHouseAvatar

}