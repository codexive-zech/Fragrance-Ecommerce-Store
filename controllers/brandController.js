const { StatusCodes } = require("http-status-codes");
const Brand = require("../model/Brand");
const { notFoundError } = require("../errors");

const createBrand = async (req, res) => {
  const brand = await Brand.create(req.body);
  res.status(StatusCodes.CREATED).json({ brand });
};

const getBrand = async (req, res) => {
  const brands = await Brand.find({});
  res.status(StatusCodes.OK).json({ brands });
};

const getSingleBrand = async (req, res) => {
  const { id: brandId } = req.params;
  const brand = await Brand.findOne({ _id: brandId });
  if (!brand) {
    throw new notFoundError(
      `Product Category With ID ${brandId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ brand });
};

const updateSingleBrand = async (req, res) => {
  const { id: brandId } = req.params;
  const Brand = await Brand.findByIdAndUpdate({ _id: brandId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!brand) {
    throw new notFoundError(
      `Product Category With ID ${brandId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ brand });
};

const deleteSingleBrand = async (req, res) => {
  const { id: brandId } = req.params;
  const brand = await Brand.findByIdAndDelete({
    _id: brandId,
  });
  if (!brand) {
    throw new notFoundError(
      `Product Category With ID ${brandId} Does Not Exist`
    );
  }
  res.status(StatusCodes.OK).json({ brand });
};

module.exports = {
  createBrand,
  getBrand,
  getSingleBrand,
  updateSingleBrand,
  deleteSingleBrand,
};
