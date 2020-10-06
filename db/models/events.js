const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;

let events = new Schema ({
    creatorId: String,
    guests: [{userId: String, userType: String}],
    eventImg: String,
    teamId: String,
    eventPost: String,
    eventTitle: String,
    eventType: String,
    eventStartDate: {type: Date},
    eventStartTime: String,
    eventEndDate: {type: Date},
    eventEndTime: String,
    resolved: {type: Boolean, default: false},
    closed: {type: Boolean, default: false},
    likes: [
        { 
            userId: String, 
        }
    ],
    comments: [
        {
            commenterId: String,
            comment: String,
            likes: [
                { 
                    userId: String, 
                }
            ],
            created: {type: Date, default: Date.now},
            replies:[{
                replierId: String,
                reply: String,
                likes: [
                    { 
                        userId: String, 
                    }
                ],
                created: {type: Date, default: Date.now},
            }]
        }
    ],
    created: {type: Date, default: Date.now},
}, {
    timestamps: true
});
module.exports = mongoose.model('events', events);
    