const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsProce,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;
  console.error(`Order ${orderItems}`, req.body);
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsProce,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.send(200).json({ success: true, order });
});

//Get Single Order =>  api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }
  res.status(201).json({
    success: true,
    order,
  });
});

//Get  Order by user id =>  api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find(req.user.id);

  res.status(201).json({
    success: true,
    orders,
  });
});

//Get all orders =>  api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.reduce((totalAmount, order) => (totalAmount += order.totalPrice));
  res.status(201).json({
    success: true,
    count: orders.length,
    totalAmount,
    orders,
  });
});

//processo orders =>  api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Product is already delivered", 400));
  }
  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });
  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(201).json({
    success: true,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stocks = product.stocks - quantity;
  await product.save({ validateBeforeSave: false });
}

//Delete order =>  api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }
  res.status(201).json({
    success: true,
    message: "order deleted successfully",
  });
});
