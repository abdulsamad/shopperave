const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          err: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "problem with image",
      });
    }

    // destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        err: "Please include all fields",
      });
    }

    const product = new Product(fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: "File size too big!",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to the DB
    product.save((dbErr, dbProduct) => {
      if (dbErr) {
        return res.status(400).json({
          err: "Saving tshirt in DB failed",
        });
      }

      return res.json(dbProduct);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  next();
};

// delete controllers
exports.deleteProduct = (req, res) => {
  const { product } = req;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        err: "Failed to delete the product",
      });
    }

    res.json({
      message: "Deletion was a success",
      deletedProduct,
    });
  });
};

// delete controllers
exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "problem with image",
      });
    }

    // updation code
    let { product } = req;
    product = _.extend(product, fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: "File size too big!",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to the DB
    product.save((dbErr, dbProduct) => {
      if (dbErr) {
        return res.status(400).json({
          err: "Updation of product failed",
        });
      }

      return res.json(dbProduct);
    });
  });
};

// product listing
exports.getAllProducts = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO product FOUND",
        });
      }

      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category found",
      });
    }

    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  const myOperations = req.body.order.products.map((prod) => ({
    updateOne: {
      filter: { _id: prod._id },
      update: { $inc: { stock: -prod.count, sold: +prod.count } },
    },
  }));

  Product.bulkWrite(myOperations, {}, (err) => {
    if (err) {
      return res.status(400).json({
        err: "Bulk operation failed",
      });
    }

    next();
  });
};
