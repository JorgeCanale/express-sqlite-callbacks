const db = require("../config/db");


function getProductById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, name, price FROM products WHERE id = ?",
      [id],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      },
    );
  });
}

function getProductByName(name) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, name , price FROM products WHERE name = ?",
      [name],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      },
    );
  });
}

function postProduct(newProduct) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO products (name TEXT NOT NULL, price INTEGER, uuid TEXT UNIQUE NOT NULL, user_uuid TEXT NOT NULL) VALUES (?,?,?,?)",
      [
        newProduct.name,
        newProduct.price,
        newProduct.uuid,
        newProduct.user_uuid,
      ],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, changes: this.changes });
      },
    );
  });
}

function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
      if (err) {
        return reject({ message: "Error en el servido", detail: err });
      }
      resolve({ changes: this.changes });
    });
  });
}

function updateProduct(id, porduct) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE products SET name = ?, price = ? WHERE id = ?",
      [porduct.name, porduct.price, id],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, changes: this.changes });
      },
    );
  });
}

function patchProduct(query, values) {
  return new Promise((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

module.exports = {
  getProductById,
  getProductByName,
  postProduct,
  deleteProduct,
  updateProduct,
  patchProduct,
};
