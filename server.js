require('dotenv').config(); // --> process.env
const multer  = require('multer');
const express = require( 'express' );
const fs = require('fs');
const path = require("path");
const orm = require( './db/orm.mongoose' );

// const { kMaxLength } = require('buffer');
const PORT = process.env.PORT || 8080;
const app = express();
var server = app.listen( PORT, function(){ console.log( `[myEmployeeManagement], http://localhost:${PORT}` ); });


app.use( express.static('client/build/') );
// app.use(express.static(path.join(__dirname, "client/src/components/Genre")));
// app.use( express.urlencoded({ extended: false }) );
// app.use( express.json() );



app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );

app.post('/api/user/signUp', async function( req,res ){
    const userData = req.body;
    const registerResult = await orm.registerUser( userData );
    res.send(registerResult);
})
//getting all user email
app.get('/api/checkEmail', async(req, res) => {
    // const userId = req.params.userId;
    const getAllEmail = await orm.getAllEmail();
    res.json( getAllEmail );
})

//Login
app.post('/api/user/login', async function( req,res ){
    const userData = req.body;
    const loginResult = await orm.loginUser( userData.email, userData.password );
    // console.log('in server loginResult: ', loginResult)
    loginResult.rememberMe = req.body.rememberMe;
    res.send( loginResult );
    
});
//Member log Login
app.post('/api/member/login', async function( req,res ){
    const memberData = req.body;
    const memberLoginResult = await orm.loginMember(  memberData.email, memberData.password );
    res.send( memberLoginResult );
});
//fetching admin detail: 
app.get('/api/adminProfile/:userId', async(req, res) => {
    const userId = req.params.userId;
    const getAdmin = await orm.getAdmin( userId );
    res.json( getAdmin );
})
//creating Teams
app.post('/api/teams', async function( req,res ){
    const userTeams = req.body;
    const postTeams = await orm.postTeams( userTeams );
    res.send(postTeams);
})
app.get('/api/teams/:userId', async(req, res) => {
    const userId = req.params.userId;
    const getTeams = await orm.getTeams( userId );
    res.json( getTeams );
})
app.get('/api/getUserFriendList/:userId', async(req, res) => {
    const userId = req.params.userId;
    const getUserFriendList = await orm.getUserFriendList( userId );
    res.json( getUserFriendList );
})
// update admin theme
app.put('/api/updateTheme/:userId', async function( req,res ){
    const userId = req.params.userId
    const theme = req.body;
    console.log('in server the theme: ', theme)
    const updateTheme = await orm.updateTheme( theme, userId );
    res.json(updateTheme);
})
// update admin theme
app.put('/api/sendFrndReq/:userId', async function( req,res ){
    const userId = req.params.userId
    const friendData = req.body;
    console.log('in server the friend data: ', friendData)
    const sendFriendReq = await orm.sendFriendReq( friendData );
    res.json(sendFriendReq);
})
// accept friend
app.put('/api/acceptfriend/:userId', async function( req,res ){
    const userId = req.params.userId
    const friendData = req.body;
    console.log('in server the friend data: ', friendData)
    const acceptFriend = await orm.acceptFriend( friendData );
    res.json(acceptFriend);
})
// update admin theme
app.put('/api/unFriend/:userId', async function( req,res ){
    const userId = req.params.userId
    const friendData = req.body;
    console.log('in server the friend data: ', friendData)
    const unFriend = await orm.unFriend( friendData );
    res.json(unFriend);
})
// update admin theme
app.put('/api/declinefriend/:userId', async function( req,res ){
    const userId = req.params.userId
    const friendData = req.body;
    console.log('in server the friend data: ', friendData)
    const declinefriend = await orm.declinefriend( friendData );
    res.json(declinefriend);
})
// update admin theme
app.put('/api/cancelFriendReq/:userId', async function( req,res ){
    const userId = req.params.userId
    const friendData = req.body;
    console.log('in server the friend data: ', friendData)
    const cancelFriendReq = await orm.cancelFriendReq( friendData );
    res.json(cancelFriendReq);
})
// update member theme
app.put('/api/updateMemTheme/:userId', async function( req,res ){
    const userId = req.params.userId
    const theme = req.body;
    console.log('in server the theme: ', theme)
    const updateMembTheme = await orm.updateMembTheme( theme, userId );
    res.json(updateMembTheme);
})

app.get('/api/roles/:userId/:teamId', async(req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;
    const getRoles = await orm.getRoles( userId, teamId );
    res.json( getRoles );
})

app.get('/api/employees/:userId/:teamId', async(req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;
    const getEmployees = await orm.getEmployees( userId, teamId );
    res.json( getEmployees );
})

app.get('/api/employeeDetail/:userId/:teamId/:membId', async(req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;
    const membId = req.params.membId;
    const getMembDetail = await orm.getMembDet( userId, teamId, membId );
    res.json( getMembDetail );
})

//deleting roles
app.get('/api/deleteRole/:adminId/:teamId/:roleId', async(req, res) => {
    const adminId= req.params.adminId;
    const teamId= req.params.teamId;
    const roleId= req.params.roleId;
    const allId ={
        'adminId': req.params.adminId, 
        'teamId': req.params.teamId,
        'roleId': req.params.roleId
    }
    const deletRole = await orm.deleteRole( allId );
    res.json( deletRole );

})
//deleting employee
app.get('/api/deleteEmployee/:adminId/:teamId/:employeeId', async(req, res) => {
    const allId ={
        'adminId': req.params.adminId, 
        'teamId': req.params.teamId,
        'employeeId': req.params.employeeId
    }
    const deleteEmployee = await orm.deleteEmployee( allId );
    res.json( deleteEmployee );

})



//fetching Team Detail:
app.get('/api/TeamDetail/:teamId/:userId', async(req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;
    const getTeamDetail = await orm.getTeamDetail( teamId, userId);
    res.json( getTeamDetail );
})

//creating roles
app.post('/api/roles', async function( req,res ){
    const userRoles = req.body;
    const postRoles = await orm.postRoles( userRoles );
    res.send(postRoles);
})

//creating employees
app.post('/api/employees', async function( req,res ){
    const userEmployee = req.body;
    const postEmployee = await orm.postEmployee( userEmployee );
    res.send(postEmployee);
})

// update employee info
app.put('/api/employeeDetail/:userId/:teamId/:membId', async function( req,res ){
    const allId = { 
        'userId': req.params.userId, 
        'teamId': req.params.teamId,
        'membId': req.params.membId
    }
    const userEmployee = req.body;
    const updateEmployee = await orm.updateEmployee( userEmployee, allId );
    console.log(updateEmployee)
    res.send(updateEmployee);
})


//new stuffs:
//posting teams
app.post('/api/newteams', async function( req,res ){
    const userTeams = req.body;
    const postNewTeam = await orm.postNewTeam( userTeams );
    res.send(postNewTeam);
})
//fetching teams
app.get('/api/allTeams/:userId', async(req, res) => {
    const userId = req.params.userId;
    const getAllTeams = await orm.getAllTeams( userId );
    res.json( getAllTeams );
})

//pinning team:

app.get('/api/pinTeam/:teamId', async(req, res) => {
    const teamId= req.params.teamId;
    
    const pinTeam = await orm.pinTeam( teamId );
    res.json( pinTeam );
})
//posting new roles
//creating roles
app.post('/api/newRoles', async function( req,res ){
    const userRoles = req.body;
    const postNewRoles = await orm.postNewRoles( userRoles );
    res.send(postNewRoles);
})
//getting all new roles
app.get('/api/allRoles/:teamId', async(req, res) => {
    // const userId = req.params.userId;
    const teamId = req.params.teamId;
    const getAllRoles = await orm.getAllRoles( teamId );
    res.json( getAllRoles );
})
//deleting roles
app.get('/api/deleteRole/:teamId/:roleId', async(req, res) => {
    const adminId= req.params.adminId;
    const teamId= req.params.teamId;
    const roleId= req.params.roleId;
    const allId ={
        'teamId': req.params.teamId,
        'roleId': req.params.roleId
    }
    const deleteNewRole = await orm.deleteNewRole( allId );
    res.json( deleteNewRole );
})
//team detail
///api/teamDetail/${teamId}
app.get('/api/teamDetails/:teamId', async(req, res) => {
    const teamId = req.params.teamId;
    const getTeamDetails = await orm.getTeamDetails( teamId );
    res.json( getTeamDetails );
})
//deleting team
app.get('/api/deleteTeam/:teamId', async(req, res) => {
    const teamId= req.params.teamId;
    
    const deleteTeam = await orm.deleteTeam( teamId );
    res.json( deleteTeam );
})
//deleting member
app.get('/api/deleteMember/:membId', async(req, res) => {
    const memberId= req.params.membId;
    
    const deleteMember = await orm.deleteMember( memberId );
    res.json( deleteMember );
})
 
//posting member
//creating employees
app.post('/api/postMember', async function( req,res ){
    const memberData = req.body;
    const postMember = await orm.postMember( memberData );
    res.send(postMember);
})
//fetching members:
app.get('/api/member/:teamId', async(req, res) => {
    const teamId = req.params.teamId;
    const getMembers = await orm.getMembers( teamId );
    res.json( getMembers );
})

//deleting member
app.get('/api/deleteMember/:membId', async(req, res) => {
    const memberId= req.params.membId;
    
    const deleteMember = await orm.deleteMember( memberId );
    res.json( deleteMember );
})
//fetching members:
app.get('/api/memberProfile/:membId', async(req, res) => {
    const membId = req.params.membId;
    const getMemberDetail = await orm.getMemberDetail( membId );
    res.json( getMemberDetail[0] );
})

//updating members: 
//   /api/memberDetailUpdate/${membId}

// update employee info
app.put('/api/memberDetailUpdate/:membId', async function( req,res ){
    const membId = req.params.membId
    const userMember = req.body;
    console.log('in server userMember:', userMember)
    const updateMember = await orm.updateMember( userMember, membId );
    res.send(updateMember);
})
// update employee info
app.put('/api/houseDtlUpdate/:teamId', async function( req,res ){
    const teamId = req.params.teamId
    const houseDetail = req.body;
    const updateHouse = await orm.updateHouse( houseDetail, teamId );
    res.send(updateHouse);
})
// update employee info
app.put('/api/memberPasswordUpdate/:membId', async function( req,res ){
    const membId = req.params.membId
    const userMember = req.body;
    const updateMemberPass = await orm.updateMemberPass( userMember, membId );
    res.send(updateMemberPass);
})
// update admin info
app.put('/api/adminDetailUpdate/:membId', async function( req,res ){
    const membId = req.params.membId
    
    const userMember = req.body;
    const updateAdmin = await orm.updateAdmin( userMember, membId );
    // console.log(updateAdmin)
    res.send(updateAdmin);
})
const upload = require('multer')({ dest: 'client/public/uploads/' });

app.post('/api/deleteOldProfilePIc', async function( req,res ){
    const oldphoto = req.body;
    const path = `client/public/${oldphoto.old}`
        fs.unlink(path, (err) => {
            if (err) {
            console.error(err)
            return
            }
            res.send({ message: `Thank you, updated` });
            //file removed
        })
})

app.put( '/api/upload/:userid', upload.single('myFile'), async function( req, res ){
    let userId = req.params.userid
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
    fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );
    const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
    const imgUploadDb = await orm.updateAvatar( userId, imageUrl );
    res.send( imgUploadDb );
});
app.put( '/api/uploadCvrPhto/:userid', upload.single('myFile'), async function( req, res ){
    let userId = req.params.userid
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
        fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );

        const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
    const imgUploadDb = await orm.updateCoverPhto( userId, imageUrl );
    res.send( imgUploadDb );
});
app.put( '/api/uploadAdminCvrPhto/:userid', upload.single('myFile'), async function( req, res ){
    let userId = req.params.userid
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
        fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );

        const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
    const imgUploadDb = await orm.updateAdmnCoverPhto( userId, imageUrl );
    res.send( imgUploadDb );
});
// update admin info
app.put('/api/saveCvrImgSettng/:userId', async function( req,res ){
    const userId = req.params.userId
    const coverPhotoSetting = req.body;
    const covrPhtoSetting = await orm.covrPhtoSetting( coverPhotoSetting, userId );
    console.log(covrPhtoSetting)
    res.send(covrPhtoSetting);
})
app.put( '/api/adminUpload/:userid', upload.single('myFile'), async function( req, res ){
    let userId = req.params.userid
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
        fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );

        const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
    const imgUploadDb = await orm.updateAdminAvatar( userId, imageUrl );
    res.send( imgUploadDb );
});
app.put( '/api/discussionBoardPic', upload.single('myFile'), async function( req, res ){
    console.log('is it coming in server')
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
        fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );
        const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
    // const imgUploadDb = await orm.updateAdminAvatar( userId, imageUrl );
    console.log(imageUrl)
    res.json( imageUrl );
});
app.put( '/api/eventsPic', upload.single('myFile'), async function( req, res ){
    console.log('is it coming in server')
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
        fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );
        const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
    // const imgUploadDb = await orm.updateAdminAvatar( userId, imageUrl );
    console.log(imageUrl)
    res.json( imageUrl );
});



//creating Houses:
//creating employees
app.post('/api/postHouse', async function( req,res ){
    const houseData = req.body;
    const postHouse = await orm.postHouse( houseData );
    res.send(postHouse);
})
//fetching houses
//fetching members:
app.get('/api/house/:teamId', async(req, res) => {
    const teamId = req.params.teamId;
    const getHouses = await orm.getHouses( teamId );
    res.json( getHouses );
})

////deleting house
app.get('/api/deleteHouse/:houseId', async(req, res) => {
    const houseId= req.params.houseId;
    const deleteHouse = await orm.deleteHouse( houseId );
    res.json( deleteHouse );
})

app.get('/api/houseDetail/:houseId', async(req, res) => {
    const houseId = req.params.houseId;
    const getHouseDetail = await orm.getHouseDetail( houseId );
    res.json( getHouseDetail[0] );
})


//uploading house image
app.put( '/api/uploadHouseImg/:houseId', upload.single('myFile'), async function( req, res ){
    let hosueId = req.params.houseId
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
        fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );

        const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
    const imgUploadDb = await orm.updateHouseAvatar( hosueId, imageUrl );
    res.send( imgUploadDb );
});

//posting: 
app.post('/api/postPost/:membId', async function( req,res ){
    const membId = req.params.membId
    const postData = req.body;
    // console.log('in server the friend data: ', postData)
    const postingPost = await orm.postingPost( postData, membId );
    res.json(postingPost);
})
app.get('/api/loadPosts/:membId', async(req, res) => {
    const membId = req.params.membId;
    const getAllPosts = await orm.getAllPosts( membId );
    res.json( getAllPosts );
})
// posting comment
app.put('/api/postComment/:postId', async function( req,res ){
    const postId = req.params.postId
    const postData = req.body;
    const postComment = await orm.postComment( postData, postId );
    res.json(postComment);
})
// like post
app.put('/api/likePost/:postId', async function( req,res ){
    const postId = req.params.postId
    const likeData = req.body;
    const postLike = await orm.postLike( likeData, postId );
    res.json(postLike);
})
// unlike post
app.put('/api/unLikePost/:postId', async function( req,res ){
    const postId = req.params.postId
    const unlikeData = req.body;
    const unlikePost = await orm.unlikePost( unlikeData, postId );
    res.json(unlikePost);
})
// like comment
app.put('/api/likeComment/:postId/:cmntId', async function( req,res ){
    const postId = req.params.postId
    const cmntId = req.params.cmntId
    const likeData = req.body;
    const likeComnt = await orm.likeComnt( likeData, postId, cmntId  );
    res.json(likeComnt);
})
// Unlike comment
app.put('/api/unLikeComment/:postId/:cmntId', async function( req,res ){
    const postId = req.params.postId
    const cmntId = req.params.cmntId
    const unLikeData = req.body;
    const unLikeComnt = await orm.unLikeComnt( unLikeData, postId, cmntId  );
    res.json(unLikeComnt);
})
// upvote post
app.put('/api/upVotePost/:postId', async function( req,res ){
    const postId = req.params.postId
    const upVoteData = req.body;
    const upVote = await orm.upVote( upVoteData, postId );
    res.json(upVote);
})
// downVote
app.put('/api/downVotePost/:postId', async function( req,res ){
    const postId = req.params.postId
    const downVoteData = req.body;
    const downVote = await orm.downVote( downVoteData, postId );
    res.json(downVote);
})

//creating discussions
app.post('/api/postDiscussion', async function( req,res ){
    const discussionData = req.body;
    const postDiscussion = await orm.postDiscussion( discussionData );
    res.send(postDiscussion);
})
//creating discussions
app.post('/api/followDiscussion', async function( req,res ){
    const DiscussionData = req.body;
    const followDiscussionData = await orm.followDiscussionData( DiscussionData );
    res.send(followDiscussionData);
})
// getting discussions
app.get('/api/discussions/:teamId', async(req, res) => {
    const teamId = req.params.teamId;
    const getDiscussions = await orm.getDiscussions( teamId );
    res.json( getDiscussions );
})
app.get('/api/discussionPost/:discnId', async(req, res) => {
    const discnId = req.params.discnId;
    const getDiscPost = await orm.getDiscPost( discnId );
    res.json( getDiscPost );
})
// like post
app.put('/api/likeDiscPost/:postId', async function( req,res ){
    const postId = req.params.postId
    const likeData = req.body;
    const postDiscLike = await orm.postDiscLike( likeData, postId );
    res.json(postDiscLike);
})
app.put('/api/unLikeDiscPost/:postId', async function( req,res ){
    const postId = req.params.postId
    const likeData = req.body;
    const postDiscUnLike = await orm.postDiscUnLike( likeData, postId );
    res.json(postDiscUnLike);
})
app.put('/api/postDiscsnCmnt/:discussionId', async function( req,res ){
    const discussionId = req.params.discussionId
    const commentData = req.body;
    const postDisckCmnt = await orm.postDisckCmnt( commentData, discussionId );
    res.json(postDisckCmnt);
})
app.put('/api/replyToComment/:discussionId/:commentId', async function( req,res ){
    const discussionId = req.params.discussionId
    const commentId = req.params.commentId
    const replyData = req.body;
    const postCmntReplies = await orm.postCmntReplies( replyData,discussionId, commentId );
    res.json(postCmntReplies);
})
// like post
app.put('/api/likeDiscComnt/:discussionId/:postId', async function( req,res ){
    const discussionId = req.params.discussionId
    const postId = req.params.postId
    const likeData = req.body;
    const postComntLike = await orm.postComntLike( likeData, discussionId,postId );
    res.json(postComntLike);
})
// like post
app.put('/api/unLikeDiscComnt/:discussionId/:postId', async function( req,res ){
    const discussionId = req.params.discussionId
    const postId = req.params.postId
    const likeData = req.body;
    const unLikeComment = await orm.unLikeComment( likeData, discussionId,postId );
    res.json(unLikeComment);
})
// like reply
app.put('/api/likeCmntReply/:discussionId', async function( req,res ){
    const discussionId = req.params.discussionId
    const replyLikeData = req.body;
    const postReplytLike = await orm.postReplytLike( replyLikeData, discussionId );
    res.json(postReplytLike);
})
// like reply
app.put('/api/unLikeCmntReply/:discussionId', async function( req,res ){
    const discussionId = req.params.discussionId
    const replyUnLikeData = req.body;
    const unLikeReply = await orm.unLikeReply( replyUnLikeData, discussionId );
    res.json(unLikeReply);
})
// vote poll
app.put('/api/votePoll/:discussionId/:pollOptId', async function( req,res ){
    const discussionId = req.params.discussionId
    const pollOptId = req.params.pollOptId
    const pollData = req.body;
    const postPoll = await orm.postPoll( pollData, discussionId, pollOptId);
    res.json(postPoll);
})
// vote poll
app.put('/api/unVotePoll/:discussionId/:pollOptId', async function( req,res ){
    const discussionId = req.params.discussionId
    const pollOptId = req.params.pollOptId
    const pollData = req.body;
    const unvotePoll = await orm.unvotePoll( pollData, discussionId, pollOptId);
    res.json(unvotePoll);
})

//creating events
app.post('/api/postEvent', async function( req,res ){
    const EventData = req.body;
    const postEvents = await orm.postEvents( EventData );
    res.send(postEvents);
})
// getting Events
app.get('/api/getEvents/:teamId', async(req, res) => {
    const teamId = req.params.teamId;
    const getEvents = await orm.getEvents( teamId );
    res.json( getEvents );
})
app.get('/api/loadEventsDetail/:eventId', async(req, res) => {
    const eventId = req.params.eventId;
    const getEventDetail = await orm.getEventDetail( eventId );
    res.json( getEventDetail );
})
app.post('/api/goingToEvent', async function( req,res ){
    const eventData = req.body;
    const goingToEventData = await orm.goingToEventData( eventData );
    res.send(goingToEventData);
})
app.post('/api/notGoingToEvent', async function( req,res ){
    const eventData = req.body;
    const notGoingToEventData = await orm.notGoingToEventData( eventData );
    res.send(notGoingToEventData);
})
app.get('/api/closeEvent/:eventId', async(req, res) => {
    const eventId = req.params.eventId;
    const closeEvent = await orm.closeEvent( eventId );
    res.json( closeEvent );
})

app.put('/api/postEventCmnt/:evetnId', async function( req,res ){
    const evetnId = req.params.evetnId
    const commentData = req.body;
    const postEvntcomnt = await orm.postEvntcomnt( commentData, evetnId );
    res.json(postEvntcomnt);
})
// like post
app.put('/api/likeEvntPost/:postId', async function( req,res ){
    const postId = req.params.postId
    const likeData = req.body;
    const postEvntLike = await orm.postEvntLike( likeData, postId );
    res.json(postEvntLike);
})
//unlike event post
app.put('/api/unLikeEvntPost/:postId', async function( req,res ){
    const postId = req.params.postId
    const likeData = req.body;
    const unLikeEvnt = await orm.unLikeEvnt( likeData, postId );
    res.json(unLikeEvnt);
})

// like event's comment post
app.put('/api/likeEvntComnt/:eventId/:postId', async function( req,res ){
    const eventId = req.params.eventId
    const postId = req.params.postId
    const likeData = req.body;
    const likeEvntComnt = await orm.likeEvntComnt( likeData, eventId, postId );
    res.json(likeEvntComnt);
})

// like post
app.put('/api/unLikeEvntComnt/:eventId/:postId', async function( req,res ){
    const eventId = req.params.eventId
    const postId = req.params.postId
    const likeData = req.body;
    const unLikeEvntComnt = await orm.unLikeEvntComnt( likeData, eventId,postId );
    res.json(unLikeEvntComnt);
})
//replyeing to events comment
app.put('/api/replyToEvntComment/:eventId/:commentId', async function( req,res ){
    const eventId = req.params.eventId
    const commentId = req.params.commentId
    const replyData = req.body;
    const postReplyToEvntsCmnt = await orm.postReplyToEvntsCmnt( replyData, eventId, commentId );
    res.json(postReplyToEvntsCmnt);
})
// like reply
app.put('/api/likeEvntCmntReply/:eventId', async function( req,res ){
    const eventId = req.params.eventId
    const replyLikeData = req.body;
    const postEvntReplytLike = await orm.postEvntReplytLike( replyLikeData, eventId );
    res.json(postEvntReplytLike);
})
// postReplytLike
// unlike reply
app.put('/api/unLikeEvntCmntReply/:eventId', async function( req,res ){
    const eventId = req.params.eventId
    const replyUnLikeData = req.body;
    const unLikeEvntReply = await orm.unLikeEvntReply( replyUnLikeData, eventId );
    res.json(unLikeEvntReply);
})

//creating events
app.post('/api/postEventTimeLine/:eventId', async function( req,res ){
    const eventId = req.params.eventId
    const EventTimelineData = req.body;
    const postEventTimeLine = await orm.postEventTimeLine( EventTimelineData, eventId);
    res.send(postEventTimeLine);
})