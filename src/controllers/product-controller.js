const {  
  getProductByName,
  getProductById,
  postProduct,
  deleteProduct,
  updateProduct,
  patchProduct,} = require('../models/product-model');
const crypto = require("node:crypto");


async function getById(req, res){
  
  try{
    const product = await getProductById(req.params.id);

    if(!product){
      return res.status(404).json({message: "Producto no encontrado"});
    }
    return res.status(200).json(product);
  }catch(err){
    return res.status(500).json({err: "Error en el servidor", detail: err.message});
  };
}

async function getByName(req,res){
  try{
  const product = await getProductByName(req.params.name);
  if(!product){
    console.log("entre en el primer if");
    
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  
  return res.status(200).json(product);
}catch(err){  
    return res.status(500).json({error: "Error en el servidor", detail: err.message});
  }
}


async function createProduct(req, res, next){

      try{
        const {name, price} = req.body;
        const randomUuid = crypto.randomUUID();
        
        const product = await postProduct({name, price, uuid: randomUuid ,user_uuid: req.user.uuid,});
        return res.status(201).json({message:"Producto creado correctamente", id: product.id ,changes: product.changes});
      }catch(err){
        next(err)
      };
}

async function deleteProductById(req, res){
  try{
    const product = await deleteProduct(req.params.id);
    if(product.changes == 0){
      return res.status(404).json({message:"El producto no ha sido modificado", changes: product.changes});
    }
    return res.status(200).json({message: "Producto eliminado correctamente", changes: product.changes});
  }catch(err){
    return res.status(500).json({message:"Error en el servidor", detail: err.message})
  };
}

async function updateFullProduct(req, res, next){

    try{
    const product = await updateProduct(req.params.id, req.body)
  
      if(product.changes == 0){
        return res.status(404).json({message:"El producto no pudo actualizarse", changes: product.changes});
      }
      return res.status(200).json({message:"El producto se ha actualizado correctamente", id: product.id ,changes: product.changes});
    }catch(err){
      next(err)
    }

}

async function updatePartialProduct(req, res, next){
  
  try{

      let query ="UPDATE products SET ";
      let queryRows = Object.keys(req.body).map(key => {return key += " = ?"}).join(" , ")
      let queryEnd = "WHERE id = ?";

      const product = await patchProduct(query.concat(queryRows, queryEnd), [...Object.values(req.body), req.params.id]);
    
      if(product.changes == 0){
        return res.status(404).json({message:"No se ha podido actualizar el producto", changes: product.changes});
      }
      return res.status(200).json({ message:"El producto se ha actualizado correctamente", id: product.id, changes: product.changes });
    }catch(err){
      next(err);
    };
  
}

module.exports = {
    createProduct,
    getById,
    getByName,
    deleteProductById,
    updateFullProduct,
    updatePartialProduct
};