const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let users = new Schema ({
    name : { 
        type: String,
        trim: true,
        required: true
    },
    bio: String,
    sex: String,
    birthday: String, 
    address: String,
    phoneNumber: String,
    homeNumber: String,
    status: String,
    email : { 
        type: String, 
        required: true, 
        trim: true, 
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address'] 
    },
    password : { 
        type: String, 
        required: true, 
        trim: true
    },
    profileImg : String,
    teams:[
        {   teamName: String,
            teamDesc: String,
            teamMembers: [
                {
                    membName: String,
               s     membDesc: String,
                    membRole: String,
                    membRoleId: String,
                    membSex: String,
                    email: String,
                    birthday: String, 
                    address: String,
                    phoneNumber: String,
                    status: String,
                    membSalary: String,
                    membSalaryId: String,
                    membPassword :  { 
                        type: String, 
                        required: true, 
                        trim: true
                    }
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
    
}, {
        timestamps: true
});

module.exports = mongoose.model('users', users);
