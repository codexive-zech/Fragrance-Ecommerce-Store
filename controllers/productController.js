const { StatusCodes } = require("http-status-codes");
const { notFoundError, badRequestError } = require("../errors");
const Product = require("../model/Product");
const slugify = require("slugify");
const User = require("../model/User");

const createProduct = async (req, res) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getProducts = async (req, res) => {
  const countAllProducts = await Product.countDocuments();
  const queryObj = { ...req.query };

  // Filtering - Category, Brand, Color, Price
  const queryToExclude = ["sort", "page", "limit", "fields"];
  queryToExclude.forEach((query) => delete queryObj[query]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let productQuery = Product.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    productQuery = productQuery.sort(sortBy);
  } else {
    productQuery = productQuery.sort("-createdAt"); // latest entry
  }

  // Fields Selection
  if (req.query.fields) {
    const fieldList = req.query.fields.split(",").join(" ");
    productQuery = productQuery.select(fieldList);
  } else {
    productQuery = productQuery.select("-__v");
  }

  // Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  productQuery = productQuery.skip(skip).limit(limit);

  if (req.query.page) {
    if (skip >= countAllProducts) {
      throw new badRequestError("This Page Does Not Exist");
    }
  }

  const products = await productQuery;
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new notFoundError(`Product With ID ${productId} Does Not Exist`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new notFoundError(`Product With ID ${productId} Does Not Exist`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) {
    throw new notFoundError(`Product With ID ${productId} Does Not Exist`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const addProductToWishlist = async (req, res) => {
  const { userId } = req.user;
  const { prodId } = req.body;
  const user = await User.findOne({ _id: userId });
  const productAlreadyInWishlist = user?.wishlist?.find(
    (id) => id.toString() === prodId
  );
  if (productAlreadyInWishlist) {
    const userProd = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { wishlist: prodId } },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ userProd });
  } else {
    const userProd = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { wishlist: prodId } },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ userProd });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addProductToWishlist,
};
