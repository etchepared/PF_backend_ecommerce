require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://bmpuqgkdjiujpo:47c3d39186210634ecf7850c982d9bc36d5dbf7f845a02a3aa0d7ad8389ec9de@ec2-54-164-241-193.compute-1.amazonaws.com:5432/d9o4jo9b8j3mq6`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { Users, Product, Cart, Order, Details, Categories, Promos } =
  sequelize.models;

// Aca vendrian las relaciones

//Muchos productos pueden estar en una misma orden y distintas ordenes pueden tener a los mismos productos
Product.belongsToMany(Categories, { through: "Product_categories" }); //orders
Categories.belongsToMany(Product, { through: "Product_categories" }); //products

//Cada usuario puede guardar en su carrito muchos productos, y estos productos pueden ser los mismos para distintos usuarios
//Cart es una relacion entre usuarios y productos
Product.belongsToMany(Users, { through: "Product_users" }); //users
Users.belongsToMany(Product, { through: "Product_users" }); //products

//Muchos productos pueden estar en una misma orden y distintas ordenes pueden tener a los mismos productos
Product.belongsToMany(Cart, { through: "Product_cart" }); //orders
Cart.belongsToMany(Product, { through: "Product_cart" }); //products

//Un usuario puede tener varias ordenes, pero cada orden pertenece a un único usuario
Cart.belongsToMany(Users, { through: "UserCart" }); //orders
Users.belongsToMany(Cart, { through: "UserCart" }); //products

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
