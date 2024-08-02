const { StatusCodes } = require("http-status-codes");
const BlogCategory = require("../model/BlogCategory");
const { notFoundError } = require("../errors");

const createBlogCategory = async (req, res) => {
  const BlogCategory = await BlogCategory.create(req.body);
  res.status(StatusCodes.CREATED).json({ BlogCategory });
};

const getBlogCategory = async (req, res) => {
  const prodCategories = await BlogCategory.find({});
  res.status(StatusCodes.OK).json({ prodCategories });
};

const getSingleBlogCategory = async (req, res) => {
  const { id: BlogCategoryId } = req.params;
  const BlogCategory = await BlogCategory.findOne({ _id: BlogCategoryId });
  if (!BlogCategory) {
    throw new notFoundError(
      `Product Category With ID ${BlogCategoryId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ BlogCategory });
};

const updateSingleBlogCategory = async (req, res) => {
  const { id: BlogCategoryId } = req.params;
  const BlogCategory = await BlogCategory.findByIdAndUpdate(
    { _id: BlogCategoryId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!BlogCategory) {
    throw new notFoundError(
      `Product Category With ID ${BlogCategoryId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ BlogCategory });
};

const deleteSingleBlogCategory = async (req, res) => {
  const { id: BlogCategoryId } = req.params;
  const BlogCategory = await BlogCategory.findByIdAndDelete({
    _id: BlogCategoryId,
  });
  if (!BlogCategory) {
    throw new notFoundError(
      `Product Category With ID ${BlogCategoryId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ BlogCategory });
};

module.exports = {
  createBlogCategory,
  getBlogCategory,
  getSingleBlogCategory,
  updateSingleBlogCategory,
  deleteSingleBlogCategory,
};
