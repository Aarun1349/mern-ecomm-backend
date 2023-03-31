const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Products = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apifeatures");

// Get all products => api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Products.countDocuments();
  const apiFeatures = new APIFeatures(Products.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;
  if (products.length === 0) {
    return next(new ErrorHandler("No products are available", 404));
  }
  res.status(200).json({
    success: true,
    result: products.length,
    productCount,
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
  req.body.user = req.user.id;
  console.log(req.body);

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
    console.error(error);
    return next(new ErrorHandler("Product Not Added", 401));
  }
});

// update Product => api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
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

// create new review => api/v1/review
exports.createReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Products.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.noOfReviews = product.reviews.length;
  }

  product.ratings = product.reviews.reduce(
    (acc, item) => (item.rating + acc, 0) / product.reviews.length
  );
  await product.save({ validateBeforeSave: false });
  res.status(201).json({
    success: true,
  });
});

// get product reviews => api/v1/admin/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  let product = await Products.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  let reviews = product.reviews;

  res.status(201).json({
    success: true,
    reviews: reviews,
  });
});

// delete product reviews => api/v1/admin/reviews
exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
  let product = await Products.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const noOfReviews = reviews.length;
  let reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  const ratings = product.reviews.reduce(
    (acc, item) => (item.rating + acc, 0) / reviews.length
  );
  await Products.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      noOfReviews,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(201).json({
    success: true,
    reviews: reviews,
  });
});
