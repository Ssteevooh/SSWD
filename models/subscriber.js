const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    zipCode: {
        type: Number,
        required: true,
        min: [10000, "Zip code is way too short"],
        max: [99999, "Zip code is too long"]
    },
    vip: {
         type: Boolean,
         required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ]
});

subscriberSchema.methods.getInfo = function() {
    return `
    Name: ${this.name}
    Email: ${this.email}
    Zip code: ${this.zipCode}
    Vip: ${this.vip ? "Yes" : "No"}
    `
}

subscriberSchema.methods.findLocalSubscribers = function() {
    return this.model("Subscriber")
        .find({zipCode: this.zipCode})
        .exec();
}


module.exports = mongoose.model('Subscriber', subscriberSchema);