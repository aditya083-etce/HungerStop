const express = require("express");
const router = express.Router();

const { gethome } = require("../app/http/controllers/homeController");
const { getRegister, getLogin, postRegister, postLogin, postLogout } = require("../app/http/controllers/authController");
const { getCustomerCart, updateCustomerCart } = require("../app/http/controllers/customers/cartController");
const { postOrders, getOrders, getOrderStatus } = require("../app/http/controllers/customers/orderController");
const { getAdminOrders } = require("../app/http/controllers/admin/orderController")
const { postOrderStatus } = require("../app/http/controllers/admin/statusController")

const isNotAuth = require("../app/http/middlewares/isNotAuth");
const isAuth = require("../app/http/middlewares/isAuth");
const isAdmin = require("../app/http/middlewares/isAdmin")

// Hme
router.get("/", gethome);

// Register
router.get("/register", isNotAuth, getRegister);
router.post("/register", isNotAuth, postRegister);

// Login
router.get("/login", isNotAuth, getLogin);
router.post("/login", isNotAuth, postLogin);

// Logout
router.post("/logout", postLogout);

// Cart
router.get("/cart", getCustomerCart);
router.post("/updateCart", updateCustomerCart);

// Customer orders
router.post("/orders", postOrders);
router.get("/customer/orders", isAuth, getOrders );
router.get("/customer/orders/:id", isAuth, getOrderStatus );

// Admin
router.get("/admin/orders", isAdmin, getAdminOrders );
router.post("/admin/order/status", isAdmin, postOrderStatus );



module.exports = router;