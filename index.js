require('dotenv').config();

const express = require("express");
const errorHandler = require("./src/middlewares/erro-handler");
const productRoute = require("./src/routes/product-routes");
const userRouter  = require('./src/routes/user-routes')



const app = express();
const port = process.env.PORT


app.use(express.json());

app.use('/product', productRoute);
app.use('/user', userRouter);

app.use(errorHandler);



app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
