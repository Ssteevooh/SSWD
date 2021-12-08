const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    cookTime: {
        type: Number,
        required: true,
        min: [1, "Cook time too short"],
        max: [99999999, "Cook time too long"],
    },
    vegan: {
         type: Boolean,
         required: true
    }
});

module.exports = mongoose.model('Recipe', recipeSchema);