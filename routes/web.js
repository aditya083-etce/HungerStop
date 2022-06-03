const express = require("express");
const router = express.Router();

const { gethome } = require("../app/http/controllers/homeController");
const { getRegister, getLogin } = require("../app/http/controllers/authController");
const { getCustomerCart, updateCustomerCart } = require("../app/http/controllers/customers/cartController");

router.get("/", gethome);

router.get("/register", getRegister);

router.get("/login", getLogin);

router.get("/cart", getCustomerCart);

router.post("/updateCart", updateCustomerCart);

module.exports = router;