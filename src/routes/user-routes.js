const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const validationSchema = require('../middlewares/validate-schema');
const createUserSchema = require('../schemas/user/user-schema');
const authMiddleware = require('../middlewares/auth-middleware');


router.get("/email",userController.getByEmail);

router.get("/associated-email", userController.getByUser);

router.delete('/delete', authMiddleware ,userController.deleteUser);

router.post('/register', validationSchema(createUserSchema), userController.createUser);

router.put('/mayor-update', authMiddleware ,validationSchema(createUserSchema), userController.updateFullUser);

router.patch('/minor-update', authMiddleware, validationSchema(createUserSchema), userController.updatePartialUser);

router.post("/login", userController.loginUser); 

// router.post("/logout");

module.exports = router;