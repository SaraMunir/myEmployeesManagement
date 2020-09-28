const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let discussionPost = new Schema ({
    creatorId: String,
    discussionImg: String,
    teamId: String,
    discussionPost: String,
    discussionTitle: String,
    discussionType: String,
    pollOptions: [
        {
            optionId: Number,
            optionTxt: String
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
                    frndId: String, 
                }
            ],
            created: {type: Date, default: Date.now}
        }
    ],
    created: {type: Date, default: Date.now},
}, {
    timestamps: true
});

module.exports = mongoose.model('discussionPost', discussionPost);
    