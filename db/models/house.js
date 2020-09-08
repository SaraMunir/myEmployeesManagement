const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let house = new Schema ({
    houseName: String,
    about: String,
    teamId: String,
    profileImg: String,
    coverImg: String,
    houseColor: String,
    houseLeader: {
        Name: String,
        memberId: String,
    },
    houseCoLeader:[
        {
            Name: String,
            memberId: String,
        }
    ],
    housePin :  { 
        type: String, 
        required: true, 
        trim: true
    },
}, {
        timestamps: true
});

module.exports = mongoose.model('house', house);
    