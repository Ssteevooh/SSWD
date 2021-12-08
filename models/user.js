const mongoose = require("mongoose");
const Product = require("./product");
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
    ownProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
    }]
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

userSchema.virtual("information")
.get(function() {
    return `${this.name.first} ${this.name.last} | ${this.email}`
});

/*userSchema.pre("save", function(next) {
    let user = this;
    if (user.ownProducts === undefined) {
      Product.findOne({
        email: user.email
      })
        .then(product => {
          user.ownProducts = product;
          next();
        })
        .catch(error => {
          console.log(`Error in connecting Product:${error.message}`);
          next(error);
        });
    } else {
      next();
    }
});
*/
  userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model('User', userSchema);