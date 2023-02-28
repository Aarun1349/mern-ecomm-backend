const Products = require("../model/productModel");

// Get all products => api/v1/products
exports.getProducts = async (req, res, next) => {
  const products = await Products.find();
  res.status(200).json({
    success: true,
    result: products.length,
    data: products,
  });
};

// Get  product by id => api/v1/product/:id
exports.getProduct = async (req, res, next) => {
  try {
    let product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
  }
};

//Add new Product => api/v1/product/new
exports.addProduct = async (req, res, next) => {
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
    res.status(401).json({
      success: false,
      message: "New product is not added successfully",
      error: error,
    });
  }
};

// update Product => api/v1/admin/product/:id
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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
};

// delete Product => api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  let product = await Products.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.deleteOne();

  res.status(201).json({
    success: true,
    message: "Product deleted successfully",
  });
};
