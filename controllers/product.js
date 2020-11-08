const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'product';
const { ObjectId } = require("mongodb");
const { roles } = require('../roles/roles.js');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

async function getProducts() {
  const client = await mongoUtils.conn();
  const products = await client
    .db(dataBase)
    .collection(COLLECTION_NAME)
    .find({})
    .toArray()
    .finally(() => client.close());
  return products;
}

function insertProduct(product) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(product)
      .finally(() => client.close());
  });
}

function updateProduct(body, productId) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .updateOne(
        {
          _id: ObjectId(productId),
        },
        {
          $set: { nombre: body.nombre , precio: body.precio , cantidad: body.cantidad  },
        },
      )
      .finally(() => client.close());
  });
}

function access(action, token, resource){
    
  let value;  
  jwt.verify( token, secret, (err, decoded ) => {
    let role = decoded.role;
    const permiso = roles.can(role)[action](resource);
    if (!permiso.granted) {value = false;}
    else {value = true;}
  });
  return value;
}

module.exports = [getProducts, insertProduct, updateProduct, access];
