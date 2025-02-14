const router = require("express").Router();
const { Users, Cart } = require("../../db");

const postUsers =
  ("/",
  async (req, res) => {
    const { name, picture, email } = req.body;
    try {
      let validate = await Users.findOne({where: {email}})
      if (!validate){
        let accountCreated = await Users.create({name, email, picture});
        let cartCreate = await Cart.create({user:email})
        accountCreated.addCart(cartCreate)
      }else if (!validate.active) {
        validate.active = true;
        if (validate.name === "") validate.name = name;
        await validate.save();
      }
      if (validate.name === ""){
        validate.name = name;
        let cartCreate = await Cart.create({productCart: []})
        validate.addCart(cartCreate)
        await validate.save();
      }

      res.sendStatus(200);
    } catch(err) {
      console.log(err)
    }
  });

module.exports = { postUsers };