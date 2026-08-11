const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const validateSchema = require('../middlewares/validate-schema');
const {createProductSchema, updateProductSchema} = require('../schemas/product-schema')

router.get("/name/:name", productController.getByName );

router.get("/id/:id", productController.getById);

router.delete("/:id", productController.deleteProductById);

router.post("/create", validateSchema(createProductSchema) ,productController.createProduct);

router.put("/:id", validateSchema(updateProductSchema),productController.updateFullProduct);

router.patch("/:id", validateSchema(updateProductSchema),productController.updatePartialProduct);

module.exports = router;