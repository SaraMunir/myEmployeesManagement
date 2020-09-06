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
    const userData = req.body;
    const registerResult = await orm.registerUser( userData );
    res.send(registerResult);
})

//Login
app.post('/api/user/login', async function( req,res ){
    const userData = req.body;
    const loginResult = await orm.loginUser( userData.email, userData.password );
    console.log('in server loginResult: ', loginResult)
    loginResult.rememberMe = req.body.rememberMe;
    res.send( loginResult );
    
});
//Member log Login
app.post('/api/member/login', async function( req,res ){
    const userData2 = req.body;
    const memberLoginResult = await orm.loginMember( userData2);
    console.log('in server loginResult: ', memberLoginResult)
    // memberLoginResult.rememberMe = req.body.rememberMe;
    res.send( memberLoginResult );
    
});

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

//posting member
//     /api/postMember

//creating employees
app.post('/api/postMember', async function( req,res ){
    const memberData = req.body;
    const postMember = await orm.postMember( memberData );
    res.send(postMember);
})


// /api/member/${teamId}

//fetching members:
app.get('/api/member/:teamId', async(req, res) => {
    const teamId = req.params.teamId;
    const getMembers = await orm.getMembers( teamId );
    res.json( getMembers );
})

//     /api/deleteMember/${membId}

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