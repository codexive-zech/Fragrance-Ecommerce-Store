const { StatusCodes } = require("http-status-codes");
const ProdCategory = require("../model/ProdCategory");
const { badRequestError, notFoundError } = require("../errors");

const createProdCategory = async (req, res) => {
  const prodCategory = await ProdCategory.create(req.body);
  res.status(StatusCodes.CREATED).json({ prodCategory });
};

const getProdCategory = async (req, res) => {
  const prodCategories = await ProdCategory.find({});
  res.status(StatusCodes.OK).json({ prodCategories });
};

const getSingleProdCategory = async (req, res) => {
  const { id: prodCategoryId } = req.params;
  const prodCategory = await ProdCategory.findOne({ _id: prodCategoryId });
  if (!prodCategory) {
    throw new notFoundError(
      `Product Category With ID ${prodCategoryId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ prodCategory });
};

const updateSingleProdCategory = async (req, res) => {
  const { id: prodCategoryId } = req.params;
  const prodCategory = await ProdCategory.findByIdAndUpdate(
    { _id: prodCategoryId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!prodCategory) {
    throw new notFoundError(
      `Product Category With ID ${prodCategoryId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ prodCategory });
};

const deleteSingleProdCategory = async (req, res) => {
  const { id: prodCategoryId } = req.params;
  const prodCategory = await ProdCategory.findByIdAndDelete({
    _id: prodCategoryId,
  });
  if (!prodCategory) {
    throw new notFoundError(
      `Product Category With ID ${prodCategoryId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ prodCategory });
};

module.exports = {
  createProdCategory,
  getProdCategory,
  getSingleProdCategory,
  updateSingleProdCategory,
  deleteSingleProdCategory,
};
