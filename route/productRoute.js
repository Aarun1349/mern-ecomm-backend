const express = require("express");
const router = express.Router();
const { getProducts, addProduct, getProduct, deleteProduct, updateProduct } = require("../controller/productController");
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct);
router.route("/product/new").post(addProduct);
router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct);
// router.route("/admin/product/:id").delete(deleteProduct);

module.exports = router;
