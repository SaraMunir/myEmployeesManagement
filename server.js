require('dotenv').config(); // --> process.env
const multer  = require('multer');
const express = require( 'express' );
const fs = require('fs');
const path = require("path");
const orm = require( './db/orm.mongoose' );
// const { kMaxLength } = require('buffer');
// const multer  = require('multer');
const PORT = process.env.PORT || 8080;
const app = express();
var server = app.listen( PORT, function(){ console.log( `[myEmployeeManagement], http://localhost:${PORT}` ); });

app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );

app.post('/api/user/signUp', async function( req,res ){
    console.log('in server, userDate: ', req.body)
    const userData = req.body;
    const registerResult = await orm.registerUser( userData );
    res.send(registerResult);
})

//Login
app.post('/api/user/login', async function( req,res ){
    const userData = req.body;
    const loginResult = await orm.loginUser( userData.email, userData.password );
    loginResult.rememberMe = req.body.rememberMe;
    res.send( loginResult );
    
});

//creating Teams

app.post('/api/teams', async function( req,res ){
    const userTeams = req.body;
    // console.log('in server:', userTeams)
    const postTeams = await orm.postTeams( userTeams );
    res.send(postTeams);
})

//fetching teams:
// /api/teams/${userId}

app.get('/api/teams/:userId', async(req, res) => {
    // console.log('in server the team fetched userId: ', req.params.userId);
    const userId = req.params.userId;

    const getTeams = await orm.getTeams( userId );
    res.json( getTeams );
})
//fetching teams:
// /api/teams/${userId}

app.get('/api/roles/:userId/:teamId', async(req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;

    const getRoles = await orm.getRoles( userId, teamId );
    res.json( getRoles );
})
// /api/employees/${adminId}/${teamId}
//get employees
app.get('/api/employees/:userId/:teamId', async(req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;

    const getEmployees = await orm.getEmployees( userId, teamId );
    res.json( getEmployees );
})
//get member detail

///api/TeamDetail/${userId}/${teamId}/${membId}

// /api/employeeDetail/${userId}/${teamId}/${membId}
app.get('/api/employeeDetail/:userId/:teamId/:membId', async(req, res) => {
    const userId = req.params.userId;
    const teamId = req.params.teamId;
    const membId = req.params.membId;
    // console.log('in server the memb details is being loaded')

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
// /api/deleteEmployee/${adminId}/${teamId}/${employeeId}
app.get('/api/deleteEmployee/:adminId/:teamId/:employeeId', async(req, res) => {
    const adminId= req.params.adminId;
    const teamId= req.params.teamId;
    const employeeId= req.params.employeeId;
    const allId ={
        'adminId': req.params.adminId, 
        'teamId': req.params.teamId,
        'employeeId': req.params.employeeId
    }
    const deleteEmployee = await orm.deleteEmployee( allId );
    res.json( deleteEmployee );

})


//fetching Team Detail:
// /api/TeamDetail/${teamId}
// /api/TeamDetail/${teamId}/${userId}
app.get('/api/TeamDetail/:teamId/:userId', async(req, res) => {
    console.log('in server the team fetched userId for getting team detail: ', req.params.teamId);
    const userId = req.params.userId;
    const teamId = req.params.teamId;
    const getTeamDetail = await orm.getTeamDetail( teamId, userId);
    res.json( getTeamDetail );
})

//creating roles
app.post('/api/roles', async function( req,res ){
    const userRoles = req.body;
    // console.log('in server:', userRoles)
    const postRoles = await orm.postRoles( userRoles );
    res.send(postRoles);
})
//creating employees
app.post('/api/employees', async function( req,res ){
    const userEmployee = req.body;
    // console.log('in server:', userEmployee)
    const postEmployee = await orm.postEmployee( userEmployee );
    res.send(postEmployee);
})

// multer upload
// const upload = require('multer')({ dest: 'client/public/uploads/' });
// app.put( '/api/upload/:userid', upload.single('myFile'), async function( req, res ){
//     let userId = req.params.userid
//     const filePath = req.file.path;
//     const originalName = req.file.originalname;

//     const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.'))).replace('jpeg','jpg');
//         fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePath}${fileExt}` );
//     const imageUrl = req.file.path.replace(/\\/g, '/').replace('client/public/','/')+fileExt;
//     const imgUploadDb = await orm.updateAvatar( userId, imageUrl );
//     res.send( imgUploadDb );
// });
