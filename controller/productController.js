const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Products = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");

// Get all products => api/v1/products
exports.getProducts =catchAsyncErrors( async (req, res, next) => {
  const products = await Products.find();
  if (products.length === 0) {
    return next(new ErrorHandler("No products are available", 404));
  }
  res.status(200).json({
    success: true,
    result: products.length,
    data: products,
  });
});

// Get  product by id => api/v1/product/:id
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    let product = await Products.findById({ _id: req.params.id });
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
  }
});

//Add new Product => api/v1/product/new
exports.addProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const result = await Products.create(req.body);
    if (result) {
      res.status(201).json({
        success: true,
        message: "New product added successfully",
        data: result,
      });
    }
  } catch (error) {
    return next(new ErrorHandler("Product Not Added", 401));
  }
});

// update Product => api/v1/admin/product/:id
exports.updateProduct =catchAsyncErrors( async (req, res, next) => {
  try {
    let product = await Products.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    console.log("Product updated successfully", req);
    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
  }
});

// delete Product => api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Products.findByIdAndDelete(req.params.id);
  if (!product) {
   return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne();

  res.status(201).json({
    success: true,
    message: "Product deleted successfully",
  });
});
