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
async function getAllEmail(  ){
    const getAllUsers = await db.users.find({})
    let allEmail = []
    getAllUsers.map(users=>
        allEmail.push(users.email)
        )
    // console.log('getAllRoles ', getAllRoles[0].teamRoles)

    return allEmail;
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
        theme: userData.theme,
    };
}
// getTeams
async function getAdmin( userId ){
    const getAdmin = await db.users.findOne({
        "_id" : userId
    })
    return getAdmin
}
async function loginMember( email, password ) {
    const memberData = await db.members.findOne({ email: email });
    // console.log('in orm logged in member Info received: ', memberData);
    if( !memberData ) {
        return { error: "Couldn't find that email. Try again!" };
    }
    const isValidPassword = await bcrypt.compare( password, memberData.membPassword );
    if( !isValidPassword ) {
        return { error: "Invalid password" };
    }
    return {
        message: "user successfully loggedin",
        id: memberData.id,
        name: memberData.name,
        email: memberData.email,
        theme: memberData.theme,
        teamId: memberData.teamId,
        house: memberData.house
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
// getTeams
async function getUserFriendList( userId ){
    const getTeams = await db.members.findOne({
        "_id" : userId
    })
    return getTeams.friendList
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
// pinning team:
async function pinTeam( teamId ){
    const apiResult = await db.teams.findOne({
        "_id" : teamId
    })
    if (apiResult.pinned == false){
        const pinTeam = await db.teams.findOneAndUpdate(
            { _id: teamId},
                { "$set": {
                    "pinned" : true,
                }}
        );
        return pinTeam
    }
    if (apiResult.pinned == true){
        const pinTeam = await db.teams.findOneAndUpdate(
            { _id: teamId},
                { "$set": {
                    "pinned" : false,
                }}
        );
        return pinTeam
    }
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
async function updateMemberPass( member, membId  ){
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(member.membPassword, saltRounds);
    const updateMembInfo = await db.members.findOneAndUpdate(
        { _id: membId},
            { "$set": {membPassword: passwordHash}}
    );
    return { 
        message: "Member Password successfully Updated", 
    };
}
async function updateTheme( theme, userId  ){
    const updateMembInfo = await db.users.findOneAndUpdate(
        { _id: userId},
            { "$set": theme}
    );
    const getTheme = await db.users.findOne(
        { _id: userId}
    );
    return getTheme.theme;
}
async function sendFriendReq(friendData){
    friendId = friendData.friendId
    userId = friendData.userId
    const friendRequest = await db.members.findOneAndUpdate(
        { _id: friendId},
        { "$push": {friendRequests: {memberId: userId}}}
    );
    return  { message: "Friend Added" };
}
async function acceptFriend(friendData){
    friendId = friendData.friendId
    userId = friendData.userId
    const addToUser = await db.members.findOneAndUpdate(
        { _id: userId},
            { "$push": {friendList: {friendId: friendId}}}
    );
    const deletefromFriendReq = await db.members.findOneAndUpdate(
        { _id: userId},
            { "$pull": {friendRequests: {memberId: friendId}}}
    );
    const addUserToFriend = await db.members.findOneAndUpdate(
        { _id: friendId},
        { "$push": {friendList: {friendId: userId}}}
    );
    return  { message: "Friend Added" };
}
async function unFriend(friendData){
    friendId = friendData.friendId
    userId = friendData.userId
    const deleteFromUserList = await db.members.findOneAndUpdate(
        { _id: userId},
            { "$pull": {friendList: {friendId: friendId}}}
    );
    const deleteFromMembList = await db.members.findOneAndUpdate(
        { _id: friendId},
        { "$pull": {friendList: {friendId: userId}}}
    );
    return  { message: "Friend deleted" };
}
async function declinefriend(friendData){
    friendId = friendData.friendId
    userId = friendData.userId
    const deleteFriendReq = await db.members.findOneAndUpdate(
        { _id: userId},
            { "$pull": {friendRequests: {memberId: friendId}}}
    );
    return  { message: "Friend Added" };
}
async function cancelFriendReq(friendData){
    friendId = friendData.friendId
    userId = friendData.userId
    const deleteRequest = await db.members.findOneAndUpdate(
        { _id: friendId},
        { "$pull": {friendRequests: {memberId: userId}}}
    );
    return  { message: "Friend Added" };
}
async function updateMembTheme( theme, userId  ){
    console.log('in orm: ', theme)
    const updateMembInfo = await db.members.findOneAndUpdate(
        { _id: userId},
            { "$set": theme}
    );
    const getTheme = await db.members.findOne(
        { _id: userId}
    );
    console.log('in orm received', getTheme.theme)
    return getTheme.theme;
}
async function updateAdmin( userEmployee, membId  ){
    console.log('in orm: ', userEmployee.address)
    const updateMembInfo = await db.users.findOneAndUpdate(
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

    return { message: `Thank you, updated` }
}
//uploading Admin image
async function updateAdminAvatar( userId, imageUrl ){
    const imageData = {
        profileImg: imageUrl
    };
    console.log('imageData : ', imageData)
    const dbResult = await db.users.findOneAndUpdate(
        {_id: userId}, {"$set": imageData});

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

    return { message: `Thank you, updated` }
}
async function postingPost(postData, membId){
    ownerId = postData.membId
    creatorId = postData.creatorId
    wallPosts = {
        'ownerId': postData.ownerId,
        'creatorId': postData.creatorId,
        'post': postData.post,
    }
    const dbWallPosts = new db.wallPosts( wallPosts );
    const savewallPosts = await dbWallPosts.save();
    return  { message: "Friend Added" };
}
// getHouseDetail
async function getAllPosts( membId ){
    const getAllPosts = await db.wallPosts.find({
        "ownerId" : membId
    })
    return getAllPosts
}
async function postComment(postData, postId){
    
    const friendRequest = await db.wallPosts.findOneAndUpdate(
        { _id: postId},
        { "$push": {comments: postData}}
    );
    return  { message: "Friend Added" };
}

module.exports = {
    registerUser,
    getAllEmail,
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
    updateHouseAvatar,
    updateAdminAvatar,
    updateAdmin,
    pinTeam,
    updateTheme,
    updateMembTheme,
    updateMemberPass,
    sendFriendReq,
    getUserFriendList,
    acceptFriend,
    cancelFriendReq,
    declinefriend,
    unFriend,
    // posts:
    postingPost,
    getAllPosts,
    postComment

}