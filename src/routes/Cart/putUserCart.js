const {Cart, Users, Product} = require("../../db");


const putUserCart = async (req,res,next)=>{
  try{
    const {UserId} = req.params;
    const { productsInfo} = req.body;
    //console.log("userid",UserId)
    //console.log("productsInfo",productsInfo)
    //[ Me dejo un arreglo con los ids de los productos que componen el nuevo carrito
    let idProduct = productsInfo.map(el=>el.idProduct)

    //[Busco al usuario
    let user = await Users.findByPk(UserId);
    //! console.log(usuario.toJSON());
    
    //[Remuevo los elementos del carrito previamente asociados al usuario.
    //await user.removeProducts(await user.getProducts());
    //! console.log("Ahora en el carrito hay : ", await usuario.countProducts(), "productos");

    //[Busco los productos que agregaré al carrito.
    let products = await Product.findAll({
      where:{
        idProduct: idProduct
      }
    })
    //! console.log( products.map(el=>el.toJSON()));
    if(!products.length) return res.status(200).json({msg:"Cart deleted"});


    //[ Agrego los productos al carrito
    await user.addProducts(products);

    //[Busco los productos desde la tabla carrito para actualizar la cantidad
    let cart = await Cart.findAll({
      where:{
        UserId
      }
    })

    //[Actualizo a la cantidad correspondiente de cada producto del carrito
    for(let i=0;i<productsInfo.length;i++){
      let product = cart.find(el=>el.ProductId===productsInfo[i].idProduct);
      await product.update({amount:productsInfo[i].amount})
    }

    //[Los vuelvo a pedir para enviar los datos correctamente
    products = await user.getProducts({
      attributes: ["idProduct","name", "price", "stock","image"]
    });
    products = products.map(el=>{
      const{idProduct, name, price, stock,image, cart:{amount}} = el.toJSON()
      return {idProduct, name, price, stock,image, amount, totalPrice:amount*price}
    })

    return res.status(200).json({cart:  products});
  }catch(err){
    console.log("Get users/cart/:id", err);
    next(err)
  }
};

module.exports = {putUserCart};
