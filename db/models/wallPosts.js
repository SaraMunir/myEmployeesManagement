const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let wallPosts = new Schema ({
    ownerId: String,
    creatorId: String,
    post: String,
    likes: [
        { 
            frndId: String, 
        }
    ],
    upVotes: [
        { 
            frndId: String, 
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

module.exports = mongoose.model('wallPosts', wallPosts);
    