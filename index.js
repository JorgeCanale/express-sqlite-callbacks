const express = require("express");
const errorHandler = require("./src/middlewares/erro-handler");
const productRoute = require("./src/routes/product-routes");


const app = express();
const port = 3000;


app.use(express.json());

app.use('/product', productRoute);

app.use(errorHandler);



app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
