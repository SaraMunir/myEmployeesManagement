const mongoose = require('mongoose');
const bcrypt = require ( 'bcrypt' );

// mongoose.connect(`mongodb://${process.env.movieTracker}`,{useNewUrlParser: true});

mongoose.connect(`mongodb://localhost:27017/myEmployeeManagement`, {useNewUrlParser: true, useFindAndModify: false});
const db = require( './models' );

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



//multer
async function updateAvatar( userId, imageUrl ){
    const imageData = {
        profileImg: imageUrl
     };
    const dbResult = await db.users.findOneAndUpdate({_id: userId}, imageData);
    const userFetch = await db.users.findOneAndUpdate({ _id: userId }, { $push: { friendList: {image: imageData} } });
    return { message: `Thank you, updated` }
}

module.exports = {
    registerUser,
    loginUser,
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
    updateEmployee
}