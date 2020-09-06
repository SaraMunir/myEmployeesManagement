const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let teams = new Schema ({
    teamAdmin: String,
    teamAdminName: String,
    teamId: String,
    teamName: String,
    teamDesc: String,
    teamMembers: [
        {
            // membName: String,
            membId: String,
            // membDesc: String,
            // membRole: String,
            // membRoleId: String,
            // membSex: String,
            // email: String,
            // birthday: String, 
            // address: String,
            // phoneNumber: String,
            // status: String,
            // membSalary: String,
            // membSalaryId: String,
            // membPassword :  { 
            //     type: String, 
            //     required: true, 
            //     trim: true
            // }
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
}, {
        timestamps: true
});

module.exports = mongoose.model('teams', teams);
    