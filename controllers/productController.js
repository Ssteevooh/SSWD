const Product = require("../models/product");
const User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    Product.find({})
      .then(product => {
        res.locals.product = product;
        next();
      })
      .catch(error => {
        console.log(`Error fetching product: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("products/index");
  },

  new: (req, res) => {
    res.render("products/new");
  },

  create: (req, res, next) => {
    if (res.locals.currentUser === undefined) {
      req.flash("error", "Error: User logged out.");
      res.locals.redirect = "/users/login";
      next();
    }
    else {
    let productParams = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      ownerEmail: res.locals.currentUser.email,
      owner: res.locals.currentUser._id
    };
    Product.create(productParams)
      .then(product => {
        res.locals.redirect = "/products";
        res.locals.product = product;
        next();
      })
      .catch(error => {
        console.log(`Error saving product: ${error.message}`);
        next(error);
      });
    }
  },

  edit: (req, res, next) => {
    let productId = req.params.id;
    Product.findById(productId)
      .then(product => {
        res.render("products/edit", {
          product: product
        });
      })
      .catch(error => {
        console.log(`Error fetching product by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let productId = req.params.id,
      productParams = {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
      };
    Product.findByIdAndUpdate(productId, {
      $set: productParams
    })
      .then(product => {
        res.locals.redirect = `/products/${productId}`;
        res.locals.product = product;
        next();
      })
      .catch(error => {
        console.log(`Error updating product by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    console.log('test');
    console.log(req.params.id);
    let productId = req.params.id;
    Product.findByIdAndRemove(productId)
      .then(() => {
        res.locals.redirect = "/products";
        next();
      })
      .catch(error => {
        console.log(`Error deleting product by ID: ${error.message}`);
        next();
      });
  },
  saveProduct: (req, res) => {
    let newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price
    });
    newProduct
      .save()
      .then(result => {
        res.render("thanks");
      })
      .catch(error => {
        if (error) res.send(error);
      });
  },

  show: (req, res, next) => {
    let productId = req.params.id;
    Product.findById(productId)
      .then(product => {
        res.locals.product = product;
        next();
      })
      .catch(error => {
        console.log(`Error fetching product by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("products/show");
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  }
};