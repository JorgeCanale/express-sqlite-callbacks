const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const validationSchema = require('../middlewares/validate-schema');
const createUserSchema = require('../schemas/user/user-schema');

router.get("/email",userController.getByEmail);

router.get("/associated-email", userController.getByUser);

router.delete('/delete', userController.deleteUser);

router.post('/register', validationSchema(createUserSchema), userController.createUser);

router.put('/mayor-update', validationSchema(createUserSchema), userController.updateUser);

router.patch('/minor-update', validationSchema(createUserSchema), userController.updatePartialUser);

module.exports = router;