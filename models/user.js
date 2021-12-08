const mongoose = require("mongoose");
const Subscriber = require("./subscriber");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true,
            trim: true
        },
        last: {
            type: String,
            required: true,
            trim: true,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    zipCode: {
        type: Number,
        min: [10000, "Zip code is way too short"],
        max: [99999, "Zip code is too long"]
    },
    courses:[{type: mongoose.Schema.Types.ObjectId, ref: "Course"}],
    subscribedAccount: {type: mongoose.Schema.Types.ObjectId, ref: "Subscriber"}
}, {
    timestamps:true
});

userSchema.virtual("username")
    .get(function() {
        return `${this.name.first.substr(0,1)}${this.name.last.length > 6 ? this.name.last.substr(0,7) : this.name.last}`
    });

userSchema.virtual("fullname")
.get(function() {
    return `${this.name.first} ${this.name.last}`
});

userSchema.pre("save", function(next) {
    let user = this;
    if (user.subscribedAccount === undefined) {
      Subscriber.findOne({
        email: user.email
      })
        .then(subscriber => {
          user.subscribedAccount = subscriber;
          next();
        })
        .catch(error => {
          console.log(`Error in connecting subscriber:${error.message}`);
          next(error);
        });
    } else {
      next();
    }
});

  userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model('User', userSchema);