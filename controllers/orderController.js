const { badRequestError, notFoundError } = require("../errors");
const Cart = require("../model/Cart");
const Order = require("../model/Order");
const uniqid = require("uniqid");
const Product = require("../model/Product");
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { userId } = req.user;
  if (!COD) {
    throw new badRequestError("Create Cash Order Failed");
  }
  const cart = await Cart.findOne({ orderBy: userId });
  let finalAmount = 0;
  if (couponApplied && cart.totalAfterDiscount) {
    finalAmount = cart.totalAfterDiscount;
  } else {
    finalAmount = cart.cartTotal;
  }
  let newOrder = await new Order({
    products: cart.products,
    paymentIntent: {
      id: uniqid(),
      method: "COD",
      amount: finalAmount,
      status: "Cash On Delivery",
      date: Date.now(),
      currency: "USD",
    },
    orderBy: userId,
    status: "Cash On Delivery",
  }).save();
  let updateFewProductProps = await cart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  const updatedProduct = await Product.bulkWrite(updateFewProductProps, {});
  res.status(StatusCodes.OK).json({ message: "Success" });
};

const getProductOrders = async (req, res) => {
  const { userId } = req.user;
  const orders = await Order.findOne({ orderBy: userId })
    .populate("products.product")
    .exec();
  res.status(StatusCodes.OK).json({ orders });
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id: orderId } = req.params;
  const order = await Order.findOneAndUpdate(
    { _id: orderId },
    { status: status, paymentIntent: { status: status } },
    { new: true, runValidators: true }
  );
  if (!order) {
    throw new notFoundError(`No Order Exist With ID ${orderId}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

module.exports = { createOrder, getProductOrders, updateOrderStatus };
