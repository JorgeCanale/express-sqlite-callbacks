const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./products.db');

function getProductById(id){
    return new Promise ((resolve, reject)=>{
        db.get('SELECT id, name, price FROM products WHERE id = ?', [id], (err,row)=>{
        if(err){
            return reject(err);
        }
        resolve(row);
    });
    })
}

function getProductByName (name){

    return new Promise ((resolve, reject)=>{
        db.get('SELECT id, name , price FROM products WHERE name = ?', [name], (err,row)=>{       
        if(err){
            return reject(err);
        }
        resolve(row);
    });
    })
    

}

function postProduct (newProduct){

    return new Promise ((resolve, reject)=>{
        db.run("INSERT INTO products (name, price) VALUES (?,?)",[newProduct.name, newProduct.price],function(err){
            if(err){
            return reject(err);
            }
            resolve({id: this.lastID, changes: this.changes})
        })
    })
}


function deleteProduct(id){

    return new Promise ((resolve,reject)=>{
        db.run("DELETE FROM products WHERE id = ?", [id],function(err){
    
            if(err){
                return reject({message: "Erro en el servido", detail: err})
            }
            resolve({changes: this.changes});
        })

    })
}


function updateProduct(id, porduct){

    return new Promise ((resolve,reject)=>{
        db.run('UPDATE products SET name = ?, price = ? WHERE id = ?', [porduct.name, porduct.price, id], function(err){
            if(err){
                return reject(err);
            }
            resolve({changes: this.changes});
        })
    })

}

function patchProduct(query, values){
    return new Promise((resolve,reject)=>{
        db.run(query,values, function(err){
            if(err){
                return reject(err);
            }
            resolve({changes: this.changes})
        })
        
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