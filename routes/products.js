var express = require('express');
var router = express.Router();
var [getProducts, insertProduct, updateProduct, access] = require('../controllers/product');
const auth = require('../lib/utils/auth');

/* GET product listing. */
router.get('/', auth.checkToken, async function (req, res, next) {
  let token = req.headers['authorization'] 
  token = token.split(' ')[1];
  if(access('readAny', token ,'product') === false){
    return res.status(401).json({
     error: "No tiene permiso"
    });
  }

  const products = await getProducts();
  console.warn('products->', products);
  res.send(products);
});

/**
 * POST product
 */
router.post('/', auth.checkToken, async function (req, res, next) {
  let token = req.headers['authorization'] 
  token = token.split(' ')[1];
  if(access('createAny', token ,'product') === false){
    return res.status(401).json({
     error: "No tiene permiso"
    });
  }

  const newProduct = await insertProduct(req.body);
  console.warn('insert products->', newProduct);
  res.send(newProduct);
});

router.put('/:id/', auth.checkToken, async function (req, res, next) {
  let token = req.headers['authorization'] 
  token = token.split(' ')[1];
  if(access('updateAny', token ,'product') === false){
    return res.status(401).json({
     error: "No tiene permiso"
    });
  }
 
  const editProduct = await updateProduct(req.body, req.params.productoId);
  res.send(editProduct);
});

module.exports = router;
