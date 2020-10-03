const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;

let discussionPost = new Schema ({
    creatorId: String,
    followers: [{userId: String, userType: String}],
    discussionImg: String,
    teamId: String,
    discussionPost: String,
    discussionTitle: String,
    discussionType: String,
    resolved: {type: Boolean, default: false},
    closed: {type: Boolean, default: false},
    pollOptions: [
        {
            optionId: Number,
            optionTxt: String,
            votes: [{ userId: String }],
        }
    ],
    likes: [
        { 
            userId: String, 
        }
    ],
    upVotes: [
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

module.exports = mongoose.model('discussionPost', discussionPost);
    