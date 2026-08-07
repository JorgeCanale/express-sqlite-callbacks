const express = require("express");
const app = express();
const port = 3000;
const {
  getProductByName,
  getProductById,
  postProduct,
  deleteProduct,
  updateProduct,
  patchProduct,
} = require("./database");

app.use(express.json());
const allowedProperties = ["name", "price", "id"];
const necessaryProperties = ["name"];

function propertiesValidation(allowed, toValidate) {
  let result = { state: "to validate", notAllowed: [] };

  toValidate.forEach((e) => {
    if (!allowed.includes(e)) {
      result.state = "not allowed";
      result.notAllowed.push(e);
    } else if (result.notAllowed.length < 1) {
      result.state = "allowed";
    }
  });

  return result;
}

function propertiesChecker(properties) {
  let counter = 0;
  necessaryProperties.forEach((p) => {
    if (properties.includes(p)) {
      counter++;
    }
  });
  if (counter == necessaryProperties.length) {
    return true;
  } else {
    return false;
  }
}

app.post("/product/create", (req, res) => {
  let validate;

  if (!propertiesChecker(Object.keys(req.body))) {
    return res.status(400).send("no se han enviado todos los campos necesarios");
  } else {
    validate = propertiesValidation(allowedProperties, Object.keys(req.body));
    if (validate.state == "allowed") {
      postProduct(req.body, (err, result) => {
        if (result.changes == 0) {
          res.status(400).send(result.message);
          return;
        }
        if(err){
          res.status(500).json({message: "ha ocurrido un erro en la consulta SQL", detail: err});
          return
        }
        res.status(200).send(result.message);
        return
      });
    } else {
      return res.status(400).json({message:"se han enviado campos no validos", detail: validate.notAllowed})
    }
  }
});

app.get("/product/:id", (req, res) => {
  getProductById(req.params.id)
  .then((product)=>{
    if(!product){
      return res.status(200).json({erro: "Producto no encontrado"});
    }
    return res.status(200).json(product);
  })
  .catch((err)=>{
    return res.status(500).json({err: "Error en el servidor", detail: err.message})
  });
});

app.delete("/product/:id", (req, res) => {
  deleteProduct(req.params.id, (err, result) => {
    if(err){
      return res.status(500).json({message:"ha ocurrido un error en la consulta SQL", detail: err});
    }
    if(result.changes == 0){
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  });
});

app.put("/product/:id", (req, res) => {
  let validation = propertiesValidation(
    allowedProperties,
    Object.keys(req.body),
  );
  let haveAllProperties = propertiesChecker(Object.keys(req.body));

  if (validation.state == "allowed" && haveAllProperties == true) {
    updateProduct(req.params.id, req.body, (err,result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if(result.changes == 0){
        return res.status(400).send(result.message);
      }
      return res.status(200).send(result.message);
    });
  } else {
    return res.status(400).json({message:"se han enviado propiedades invalidas", detail: validation.notAllowed.join(",")});
  }
});

app.patch("/product/:id", (req,res)=>{
  let validate =  propertiesValidation(allowedProperties,Object.keys(req.body));

  if(validate.state == "allowed"){

    let query ="UPDATE products SET ";
    let queryRows = Object.keys(req.body).map(key => {return key += " = ?"}).join(" , ")
    let queryEnd = "WHERE id = ?";


    

    patchProduct(query.concat(queryRows, queryEnd), [...Object.values(req.body), req.params.id],(err,result)=>{
      if(err){
      return res.status(500).json({message:"ha ocurrido un erro", detail: err});
      }
      if(result.changes == 0){
        return res.status(400).send( result.message);
      }
      return res.status(200).json({message: result.message, changes: result.changes});
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
