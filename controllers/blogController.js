const { StatusCodes } = require("http-status-codes");
const Blog = require("../model/Blog");
const User = require("../model/User");
const { notFoundError } = require("../errors");

const createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(StatusCodes.CREATED).json({ blog });
};

const getBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.status(StatusCodes.OK).json({ blogs });
};

const getSingleBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new notFoundError(`No Blog With ID ${blogId} `);
  }
  const updateBlog = await Blog.findByIdAndUpdate(
    blogId,
    { $inc: { viewCount: 1 } },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ updateBlog });
};

const updateBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await Blog.findOneAndUpdate({ _id: blogId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    throw new notFoundError(`No Blog With ID ${blogId} `);
  }
  res.status(StatusCodes.OK).json({ blog });
};

const deleteBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await Blog.findByIdAndDelete({ _id: blogId });
  if (!blog) {
    throw new notFoundError(`No Blog With ID ${blogId} `);
  }
  res.status(StatusCodes.OK).json({ blog });
};

module.exports = {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
