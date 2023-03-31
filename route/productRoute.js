const express = require("express");
const router = express.Router();
const {
  getProducts,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  createReview,
  getProductReviews,
  deleteProductReviews,
} = require("../controller/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct);
router.route("/admin/product/new").post(isAuthenticatedUser, addProduct);
router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct);
router
  .route("/review")
  .put(isAuthenticatedUser, createReview)
  .delete(isAuthenticatedUser, deleteProductReviews);
router
  .route("admin/reviews")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getProductReviews);
// .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
// router.route("/admin/product/:id").delete(deleteProduct);

module.exports = router;
