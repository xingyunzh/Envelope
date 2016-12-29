var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = Schema({
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        createDate: {
            type:Date,
            required:true,
            index:true
        },
        theme:{
            type:Schema.Types.ObjectId,
            ref:"CardTheme",
            required:true,
        },

        text:String
});

var Card = mongoose.model("Card", cardSchema);

module.exports = Card;