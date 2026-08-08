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
  } 
    validate = propertiesValidation(allowedProperties, Object.keys(req.body));
    if (validate.state == "allowed") {
      postProduct(req.body)
      .then((result)=>{
        if(result.changes == 0){
          return res.status(404).json({message:"no se han realizado cambios", changes: result.changes});
        } 
        return res.status(201).json({message:"Producto creado correctamente", id: result.id ,changes: result.changes});
      })
      .catch((err)=>{
        return res.status(500).json({message: "Error en el servidor", deatil: err.message});
      });
    } else {
      return res.status(400).json({message:"se han enviado campos no validos", detail: validate.notAllowed});
    }
  
});

app.get("/product/name/:name",(req,res)=>{
  getProductByName(req.params.name)
  .then((product)=>{
    if(!product){
      return res.status(404).json({error: "Producto no encontrado"});
    }
    return res.status(200).json(product);
  })
  .catch((err)=>{
    return res.status(500).json({error: "Error en el servidor", detail: err.message});
  });
});

app.get("/product/id/:id", (req, res) => {
  getProductById(req.params.id)
  .then((product)=>{
    if(!product){
      return res.status(404).json({error: "Producto no encontrado"});
    }
    return res.status(200).json(product);
  })
  .catch((err)=>{
    return res.status(500).json({err: "Error en el servidor", detail: err.message});
  });
});

app.delete("/product/:id", (req, res) => {
  deleteProduct(req.params.id)
  .then((result)=>{
    if(result.changes == 0){
      return res.status(404).json({message:"No se ha podido borrar el producto", changes: result.changes});
    }
    return res.status(200).json({message:"Producto eliminado correctamente", changes: result.changes});
  })
  .catch((err)=>{
    return res.status(500).json({message:"Error en el servidor", detail: err.message})
  })
});

app.put("/product/:id", (req, res) => {
  let validation = propertiesValidation(
    allowedProperties,
    Object.keys(req.body),
  );
  let haveAllProperties = propertiesChecker(Object.keys(req.body));

  if (validation.state == "allowed" && haveAllProperties == true) {
    updateProduct(req.params.id, req.body)
    .then((result)=>{
      if(result.changes == 0){
        return res.status(404).json({message:"el producto no fue ingresado en la red", changes: result.changes});
      }
      return res.status(200).json({message:"el producto se ha ingresado correctamente", changes: result.changes});
    })
    .catch((err)=>{
      return res.status(500).json({message:"Error del servidor", changes: err.message});
    })
  } else {
    return res.status(400).json({message:"se han enviado propiedades invalidas", detail: validation.notAllowed.join(",")});
  }
});

app.patch("/product/:id", (req,res)=>{
  let validate =  propertiesValidation(allowedProperties,Object.keys(req.body));

  if(validate.state !== "allowed"){
    return res.status(400).json({message: "Se han enviado propiedades invalids", detail: validate.notAllowed})
  }
    let query ="UPDATE products SET ";
    let queryRows = Object.keys(req.body).map(key => {return key += " = ?"}).join(" , ")
    let queryEnd = "WHERE id = ?";

    patchProduct(query.concat(queryRows, queryEnd), [...Object.values(req.body), req.params.id])
    .then((result)=>{
      if(result.changes == 0){
        return res.status(404).json({message:"no se ha podido actualizar el producto", changes: result.changes});
      }
      return res.status(200).json({message:"el producto se ha actualizado correctamente", changes: result.changes});
    })
    .catch((err)=>{
      return res.status(500).json({message:"Error del servidor", changes: err.message});
    });
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
