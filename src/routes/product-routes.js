const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const validateSchema = require('../middlewares/validate-schema');
const {createProductSchema, updateProductSchema} = require('../schemas/product/product-schema');
const authMiddleware = require('../middlewares/auth-middleware');




router.get("/name/:name", productController.getByName );
 
router.get("/id/:id", productController.getById);

router.delete("id/:id", authMiddleware, productController.deleteProductById);

router.post("/create", authMiddleware, validateSchema(createProductSchema) ,productController.createProduct);

router.put("/:id", authMiddleware, validateSchema(updateProductSchema),productController.updateFullProduct);

router.patch("/:id",authMiddleware, validateSchema(updateProductSchema),productController.updatePartialProduct);


module.exports = router;