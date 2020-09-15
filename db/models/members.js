const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let members = new Schema ({
    type: String,
    theme: {
        type: String,
        default: 'Light'},
    bio: String,
    teamId: String,
    name: String,
    role: String,
    roleId: String,
    sex: String,
    email: String,
    birthday: {
        type: String,
        default: 'Not Provided'},
    address: String,
    phoneNumber: String,
    homeNumber: String,
    status: String,
    membSalary: String,
    membSalaryId: String,
    profileImg: String,
    coverImg: String,
    friendList: [
        {friendId: String}
    ],
    friendRequests:[
        {memberId: String}
    ],
    house: {
        type: String,
        default: 'Not Provided'},
    membPassword :  { 
        type: String, 
        required: true, 
        trim: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('members', members);