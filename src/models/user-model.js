const db = require('../config/db');

function getUserByEmail(email,check){

    return new Promise((resolve, reject)=>{db.get('SELECT user, email, uid FROM users WHERE email = ?', [email], function(err, row){
        
        if(err){
            reject(err)
        }

        if(check){
            resolve(true);
        }

        resolve(row)
    });})
};

function getEmailByUser(user){
    return new Promise((resolve, reject)=>{db.get('SELECT email FROM users WHERE user = ?', [user], function(err,row){
        console.log(row);
        
        if(err){
            reject(err);
        };
        resolve(row);
    });
});
};

function getUserWithPass(email){
    return new Promise((resolve, reject)=>{
        db.get('SELECT user, email, password, uid FROM users WHERE email = ?', [email], function(err, row){
            
            if(err){
                reject(err);
            };
            resolve(row);
        })
    })
}

function postUser(newUser){

    return new Promise((resolve, reject)=>{db.run(
        "INSERT INTO users (id INTEGER PRIMARY KEY  AUTOINCREMENT user TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, uid TEXT UNIQUE NOT NULL, role TEXT DEFAULT 'client' CHECK(role IN ('admin', 'client')) ) VALUES (?, ?, ?, ?)",
        [newUser.user, newUser.email, newUser.password, newUser.uuid, newUser.role], 
        function(err){
        if(err){
            reject(err);
        };
        resolve({id: this.lastID, changes:this.changes});
    });})
};

function deleteUserFromDB(email){
    return new Promise((resolve, reject)=>{db.run('DELETE FROM users WHERE email = ?',[email], function(err){
        if(err){
            reject({message: "Error en el servidor", detail: err});
        };

        resolve({changes: this.changes}); 
    });
});
};

function patchUser(query, values){
    return new Promise((resolve, reject)=>{db.run(query, values, function(err){
        console.log(values.uid);
        
        if(err){
            reject({message: "Error en el servridor", detal: err});
        };

        resolve({id: this.lastID, changes: this.changes});
    });
    });
};

function updateUser(email, user){
    return new Promise((resolve,reject)=>{db.run('UPDATE users SET user = ?, email = ?, password = ?, uid = ?', [user.user, user.email, user.password, user.uid], function(err){
        if(err){
            reject({message: "Error en el servidor", detail: err});
        };
        resolve({changes: this.changes});
    });
});
};

module.exports = {
    getUserByEmail, getEmailByUser, getUserWithPass,
    postUser, updateUser,
    deleteUserFromDB, patchUser
};