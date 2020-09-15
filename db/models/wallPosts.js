const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let wallPosts = new Schema ({
    ownerName: String,
    ownerId: String,
    creator: String,
    creatorId: String,
    likes: {
        type: Number, 
        default: 0
    },
    comments: [
        {
            commenterId: String,
            comment: String,
            likes: 
            {
                type: Number, 
                default: 0
            },
            created: {type: Date, default: Date.now}
        }
    ],
    created: {type: Date, default: Date.now},
}, {
    timestamps: true
});

module.exports = mongoose.model('wallPosts', wallPosts);
    