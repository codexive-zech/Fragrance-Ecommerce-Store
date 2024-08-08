const { StatusCodes } = require("http-status-codes");
const Cart = require("../model/Cart");
const Product = require("../model/Product");
const User = require("../model/User");
const Coupon = require("../model/Coupon");
const { badRequestError } = require("../errors");

const addProductToCart = async (req, res) => {
  const { cart } = req.body;
  const { userId } = req.user;
  let products = [];
  const user = await User.findOne({ _id: userId });
  const alreadyExistCart = await Cart.findOne({ orderBy: user._id }); // check if the user already have product in cart
  if (alreadyExistCart) {
    alreadyExistCart.remove();
  }
  for (let item = 0; item < cart.length; item++) {
    let cartObj = {};
    cartObj.product = cart[item]._id;
    cartObj.count = cart[item].count;
    cartObj.color = cart[item].color;
    let getPrice = await Product.findOne({ _id: cart[item]._id })
      .select("price")
      .exec();
    cartObj.price = getPrice.price;
    products.push(cartObj);
  }
  let cartTotal = 0;
  for (let item = 0; item < products.length; item++) {
    cartTotal = cartTotal + products[item].price * products[item].count;
  }
  let freshNewCart = await new Cart({
    products,
    cartTotal,
    orderBy: user._id,
  }).save();
  res.status(StatusCodes.CREATED).json({ freshNewCart });
};

const getAllProductsCart = async (req, res) => {
  const { userId } = req.user;
  const carts = await Cart.find({ orderBy: userId }).populate(
    "products.product"
  );
  res.status(StatusCodes.OK).json({ carts });
};

const emptyCart = async (req, res) => {
  const { userId } = req.user;
  const cart = await Cart.findOneAndDelete({ orderBy: userId });
  res.status(StatusCodes.OK).json({ cart });
};

const applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const { userId } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) {
    throw new badRequestError("Invalid Coupon");
  }
  const { cartTotal } = await Cart.findOne({
    orderBy: userId,
  }).populate("products.product");
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderBy: userId },
    { totalAfterDiscount },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ totalAfterDiscount });
};

module.exports = {
  addProductToCart,
  getAllProductsCart,
  emptyCart,
  applyCoupon,
};
