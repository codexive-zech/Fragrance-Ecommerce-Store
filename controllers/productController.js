const { StatusCodes } = require("http-status-codes");
const { notFoundError } = require("../errors");
const Product = require("../model/Product");
const slugify = require("slugify");

const createProduct = async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
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
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
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

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
