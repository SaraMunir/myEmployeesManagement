const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let wall = new Schema ({
    wallOwnerId: String,
    posts: [
        {
            postCreator: String,
            postCretorId: String,
            post: String,
        }
    ]    
}, {
        timestamps: true
});

module.exports = mongoose.model('wall', wall);
    