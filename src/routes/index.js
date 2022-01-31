const router = require("express").Router();

// Importe de todas las rutas:
const { getProducts } = require("./products/getProducts");
const { getProductDetail } = require("./products/getProductDetail");
const { updateProducts } = require("./products/postProducts");
const { putProducts } = require("./products/putProducts");

const { getPromos } = require("./promos/getPromos");
const { postPromos } = require("./promos/postPromos");
const { putPromos } = require("./promos/putPromos");

const { getAllOrders } = require("./Orders/getAllOrders.js");
const { getUserOrders } = require("./Orders/getUserOrders.js");
const { postUserOrder } = require("./Orders/postUserOrder");
const { putOrder } = require("./Orders/putOrder.js");

const { getUserCart } = require("./Cart/getUserCart");
const { putUserCart } = require("./Cart/putUserCart");
const { deleteUserCart } = require("./Cart/deleteUserCart");

const { getCategories } = require("./categories/getCategories");
const { postCategories } = require("./categories/postCategories");
const { putCategories } = require("./categories/putCategories");

const { postUsers } = require("./Users/routePostAccount");
const { getActualUser } = require("./Users/getActualUser");
const { putUser } = require("./Users/putUser");

const { mercadoPagoPost } = require("./mercadoPago/mercadoPago.js");

/*          Configuracion de rutas:        */

router.get("/", async (req, res, next) => {
  return res.send("Base de datos conectada");
});

// USER:
router.post("/users", postUsers);
router.get("/users/:email", getActualUser);
router.put("/users", putUser);

// CART:
router.put("/cart/:UserId", putUserCart);
router.get("/cart/:UserId", getUserCart);
router.delete("/cart/:UserId", deleteUserCart);

// PRODUCT:
router.get("/products", getProducts);
router.get("/products/:ProductId", getProductDetail);
router.post("/products", updateProducts);
router.put("/products/:ProductId", putProducts);

//PROMOS:
router.get("/promos", getPromos);
router.post("/promos", postPromos);
router.put("/promos", putPromos);

//CATEGORIES:
router.get("/categories", getCategories);
router.post("/categories", postCategories);
router.put("/categories/:CategoriesId", putCategories);

// ORDER:
// router.get("/orders/:UserId", getUserOrders);
// router.get("/orders/:UserId/:OrderId", getUserOrders);
// router.post("/order/:UserId", postUserOrder);

// //ORDER ADMIN:
// router.get("/orders", getAllOrders);
// router.put("/order/:OrderId", putOrder);

//MERCADOPAGO:
router.get("/checkout", mercadoPagoPost);

module.exports = router;
