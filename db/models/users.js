const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let users = new Schema ({
    name : { 
        type: String,
        trim: true,
        required: true
    },
    theme: {
        type: String,
        default: 'Light'
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
    pinnedTeams:[
        {teamId: String}
    ],
    profileImg : String,
    coverImg: String,
    coverImgSetting: {y: Number},
}, {
        timestamps: true
});

module.exports = mongoose.model('users', users);
