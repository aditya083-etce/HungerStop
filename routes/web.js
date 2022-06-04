const express = require("express");
const router = express.Router();

const { gethome } = require("../app/http/controllers/homeController");
const { getRegister, getLogin, postRegister, postLogin, postLogout } = require("../app/http/controllers/authController");
const { getCustomerCart, updateCustomerCart } = require("../app/http/controllers/customers/cartController");

const isAuth = require("../app/http/middlewares/isAuth");

router.get("/", gethome);

router.get("/register", isAuth, getRegister);
router.post("/register", isAuth, postRegister);

router.get("/login", isAuth, getLogin);
router.post("/login", isAuth, postLogin);

router.post("/logout", postLogout);

router.get("/cart", getCustomerCart);

router.post("/updateCart", updateCustomerCart);

module.exports = router;