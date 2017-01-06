var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            type:Date,
            required:true,
            index:true
        },
        resource:String,
        action:{
            type:String,
            required:true,
            index:true
        }
});

var Log = mongoose.model("Log", logSchema);

module.exports = Log;