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
    console.log('in orm:', teamData)
    const createTeam = await db.users.findOneAndUpdate({ _id: userId }, { $push: {teams: teamData} });
    console.log(createTeam)
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
    console.log('in orm:', roleData)
    const createRole = await db.users.findOneAndUpdate(
        { _id: userId, "teams._id": teamID }, 
        { $push: { "teams.$.teamRoles": roleData }});
    console.log(createRole)
    return { 
        message: "role successfully saved", 
    };   
}
// membName: "", membDesc: "", membRole: ""

async function postEmployee( employee ){
    const teamID = employee.teamId
    const userId = employee.userId
    const employeeData = {
        'membName': `${employee.membName}`,
        'membDesc': `${employee.membDesc}`,
        'membRole': `${employee.membRole}`,
    };
    // console.log('in orm:', employeeData)
    const createEmployee = await db.users.findOneAndUpdate(
        { _id: userId, "teams._id": teamID }, 
        { $push: { "teams.$.teamMembers": employeeData }});
    console.log(createEmployee)
    return { 
        message: "role successfully saved", 
    };   
}

// getTeams
async function getTeams( userId ){
    const getTeams = await db.users.find({
        "_id" : userId
    })
    console.log('in orm: getteam:', getTeams)
    return getTeams
}
// getTeams
async function getRoles( userId, teamId ){
    const getRoles = await db.users.find({
        "_id" : userId 
    })
    // console.log('in orm: getrole:', getRoles[0].teams)
    let teamsRoleArr = getRoles[0].teams;
    teamsRoleArr.forEach( team =>{
        if(team._id == teamId){
            // console.log('in orm the thing is team name: ', team.teamRoles);
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
    // console.log('in orm: getrole:', getEmployees[0].teams)
    let teamsEmployeeArr = getEmployees[0].teams;
    teamsEmployeeArr.forEach( team =>{
        if(team._id == teamId){
            // console.log('in orm the thing is team name: ', team.teamRoles);
            teamsEmployeeArr = team.teamMembers;
        }
    })
    return teamsEmployeeArr
}
//delete roles
// deleteRole

async function deleteRole( allId ){
    const userId = allId.adminId
    const teamId = allId.teamId
    const roleId = allId.roleId
    // console.log('allId', allId)

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
    console.log('allId', allId)

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
    // console.log('in orm: getteam:',teamDetailArr)
    teamDetailArr.forEach(team => {
        if (team._id == teamId ){
            teamDetailArr = team;
        }
    });
    return teamDetailArr;
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
    deleteEmployee
}