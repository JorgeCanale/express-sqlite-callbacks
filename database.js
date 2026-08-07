const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./products.db');

function getProductById(id){
    return new Promise((resolve, reject)=>{
                db.get('SELECT id, name, price FROM products WHERE id = ?', [id], (err,row)=>{
        if(err){
            return reject(err);
        };
        resolve(row);
    });
    })
}

function getProductByName (name, callback){

    return new Promise ((resolve, reject)=>{
        db.get('SELECT id, name , price FROM products WHERE name = ?', [name], (err,row)=>{       
        if(err){
            return reject(err);
        }
        resolve(row);
    });
    })
    

}

function postProduct (newProduct, callback){
    db.run("INSERT INTO products (name, price) VALUES (?,?)",[newProduct.name, newProduct.price],function(err){
        if(err){
        return callback(err);
        }else if(this.changes == 0){
        return callback(null, {message:"no se han realiado cambios"});
        }
        return callback(null,{message:"producto creado correctamente"});
    })
}


function deleteProduct(id, callback){
    db.run("DELETE FROM products WHERE id = ?", [id],function(err){

        if(this.changes == 0){
            callback(null, {message: "no se han realizado cambios",changes:this.changes});
            return
        }

        if(err){
            callback(err);
            return
        }
        callback(null, {message: "producto borrado correctamente", changes: this.changes});
    })
}


function updateProduct(id, porduct, callback){
    db.run('UPDATE products SET name = ?, price = ? WHERE id = ?', [porduct.name, porduct.price, id], function(err){
        if(err){
            return callback(err);
        }
        if(this.changes > 2){
            console.error(`ALERT: se detecto una actualizacion anomala de ${this.changes} filas.`);
            return callback(new Error("Error de integridad: la actualizacion afecto multiples registros."));
        }
        if(this.changes == 0){
            return callback(null, {changes: this.changes, message:"no sean realizado cambios"})
        }
        return callback(null, {message:"cambios realizados correctamente"});
    })
}

function patchProduct(query, values, callback){
    db.run(query,values, function(err){
        if(err){
            callback(err, null);
            return
        }

        if(this.changes == 0){
            return callback(null,{message: "no sean realizado cambios", changes: this.changes});
        }
        callback(null,{message: "cambios realizados correctamente", changes: this.changes});
        return
    })
}


db.serialize(()=>{
    db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT UNIQUE, price REAL)');


    // db.run('DELETE FROM products WHERE name = ?', [name],()=>{
    //     console.log('product was deleted')
    // })

    // let newprice = 1300.00;

    // db.run('UPDATE products SET price = ? WHERE name = ?', [newprice, name], ()=>{
    //     console.log('precio del producto actualziado')
    // })


    //     db.get('SELECT price FROM products WHERE name = ?', [name], (err,row)=>{
    //     if(err){
    //         console.log("product not finded",err);
    //         return
            
    //     };
    //     console.log(row);
    // });
});

module.exports = {getProductById, getProductByName,postProduct, deleteProduct, updateProduct, patchProduct} 