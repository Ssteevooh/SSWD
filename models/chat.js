const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    messages: [{
        user: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        messageDate: {
            type: String,
            required: true
        },
        clock: {
            type: String,
            required: true
        }
        },
    ],
},
{ timestamps:true
});

module.exports = mongoose.model('Chat', chatSchema);