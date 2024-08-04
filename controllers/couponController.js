const { StatusCodes } = require("http-status-codes");
const Coupon = require("../model/Coupon");
const { notFoundError } = require("../errors");

const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(StatusCodes.CREATED).json({ coupon });
};

const getAllCoupon = async (req, res) => {
  const coupons = await Coupon.find({});
  res.status(StatusCodes.CREATED).json({ coupons });
};

const getSingleCoupon = async (req, res) => {
  const { id: couponId } = req.params;
  const coupon = await Coupon.findOne({ _id: couponId });
  if (!coupon) {
    throw new notFoundError(`Coupon With ID ${couponId} Does Not Exist`);
  }
  res.status(StatusCodes.CREATED).json({ coupon });
};

const updateCoupon = async (req, res) => {
  const { id: couponId } = req.params;
  const coupon = await Coupon.findOneAndUpdate({ _id: couponId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    throw new notFoundError(`Coupon With ID ${couponId} Does Not Exist`);
  }
  res.status(StatusCodes.CREATED).json({ coupon });
};

const deleteCoupon = async (req, res) => {
  const { id: couponId } = req.params;
  const coupon = await Coupon.findOneAndDelete({ _id: couponId });
  if (!coupon) {
    throw new notFoundError(`Coupon With ID ${couponId} Does Not Exist`);
  }
  res.status(StatusCodes.CREATED).json({ coupon });
};

module.exports = {
  createCoupon,
  getAllCoupon,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
};
