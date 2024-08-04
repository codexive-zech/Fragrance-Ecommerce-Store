const { StatusCodes } = require("http-status-codes");
const Blog = require("../model/Blog");
const { notFoundError } = require("../errors");

const createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(StatusCodes.CREATED).json({ blog });
};

const getBlogs = async (req, res) => {
  const queryObj = {};
  if (req.query.search) {
    queryObj.title = { $regex: req.query.search, $options: "i" };
  }

  let blogs = Blog.find(queryObj).sort("-createdAt");

  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  blogs = blogs.skip(skip).limit(limit);

  const allBlogs = await blogs;
  res.status(StatusCodes.OK).json({ allBlogs, count: allBlogs.length });
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

const likeBlog = async (req, res) => {
  const { userId: loggedInUserId } = req.user;
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  const isLikedAlready = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes.find(
    (userId) => userId.toString() === loggedInUserId.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loggedInUserId },
        isDisliked: false,
      },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ blog });
  }
  if (isLikedAlready) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loggedInUserId },
        isLiked: false,
      },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ blog });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loggedInUserId },
        isLiked: true,
      },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ blog });
  }
};

const dislikeBlog = async (req, res) => {
  const { userId: loggedInUserId } = req.user;
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  const isDislikedAlready = blog?.isDisliked;
  const alreadyLiked = blog?.likes.find(
    (userId) => userId.toString() === loggedInUserId.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loggedInUserId },
        isLiked: false,
      },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ blog });
  }
  if (isDislikedAlready) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loggedInUserId },
        isDisliked: false,
      },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ blog });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loggedInUserId },
        isDisliked: true,
      },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ blog });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
