const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let timelineActivity = new Schema ({
    userId: String,
    userType: String,
    teamId: String,
    activityType:String,
}, {
        timestamps: true
});

module.exports = mongoose.model('timelineActivity', timelineActivity);