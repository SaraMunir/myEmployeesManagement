const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let users = new Schema ({
    name : { 
        type: String,
        trim: true,
        required: true
    },
    email : { 
        type: String, 
        required: true, 
        trim: true, 
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address'] 
    },
    password :  { 
        type: String, 
        required: true, 
        trim: true
    },
    profileImg: {
        type: String,
        default: 'https://getdrawings.com/free-icon-bw/anonymous-avatar-icon-19.png'  
    },
    teams: 
    [
        {
            teamName: String,
            teamDesc: String,
            teamMembers: [
                {
                    membName: String,
                    membDesc: String,
                    membRole: String,
                }
            ],
            teamRoles: [
                {
                    roleName: String,
                    roleDesc: String
                }
            ],
            teamDept: [
                {
                    deptName: String,
                    deptDesc: String
                }
            ]
        }
    ],
    roles:
    [
        {
            roleName: String,
            roleDesc: String
        }
    ],
    departments:[
        {
            deptName: String,
        }
    ],
}, {
        timestamps: true
});

module.exports = mongoose.model('users', users);
