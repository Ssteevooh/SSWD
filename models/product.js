const mongoose = require("mongoose");

const User = require("./user");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        min: [1, "Cannot sell products for free"],
        required: true
    },
    ownerEmail: {
        type: String,
        required: true,
    },
    owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
});

productSchema.pre("save", function(next) {
    let product = this;
    console.log(product);
    User.findById(product.owner)
        .then(user => {
          if(user.ownProducts === undefined) {
              user.ownProducts = []
          }
          user.ownProducts.push(product._id);
          next();
        })
        .catch(error => {
          console.log(`Error in finding user:${error.message}`);
          next(error);
        });
});


productSchema.methods.getInfo = function() {
    return `
    Name: ${this.name}
    Description: ${this.description}
    image: ${this.image}
    owner: ${this.owner}
    `
}



module.exports = mongoose.model('Product', productSchema);