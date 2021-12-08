const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    items: [],
    zipCode: {
        type: Number,
        min: [10000, "Zip code is too short"],
        max: [99999, "Zip code is too long"],
    }
});

module.exports = mongoose.model('Course', courseSchema);