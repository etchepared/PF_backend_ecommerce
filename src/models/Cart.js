const { DataTypes, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
    sequelize.define('cart', {
        id:{
          type:DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        amount : {
          type:DataTypes.INTEGER,
          allowNull: false,
          defaultValue:0
        },
        products:{
          type:DataTypes.ARRAY,
          allowNull: false,
          defaultValue:[]
        }
    }, {timestamps: false});
};