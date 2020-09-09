const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let members = new Schema ({
    type: String,
    bio: String,
    teamId: String,
    name: String,
    role: String,
    roleId: String,
    sex: String,
    email: String,
    birthday: String, 
    address: String,
    phoneNumber: String,
    status: String,
    membSalary: String,
    membSalaryId: String,
    profileImg: String,
    house: String,
    membPassword :  { 
        type: String, 
        required: true, 
        trim: true
    },
}, {
        timestamps: true
});

module.exports = mongoose.model('members', members);
    