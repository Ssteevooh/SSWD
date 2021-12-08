const Product = require("../models/product");

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
    let productParams = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      ownerEmail: res.locals.currentUser.email,
      owner: res.locals.currentUser
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
  },

  saveProduct: (req, res) => {
    console.log(currentUser);
    let newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image
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