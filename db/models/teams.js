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
            membId: String,
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
    