const db = require('../config/db');

function getUserByEmail(email,check){

    return new Promise((resolve, reject)=>{db.get('SELECT user, email,uid FROM users WHERE email = ?', [email], function(err, row){
        
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

function postUser(newUser, uid){

    return new Promise((resolve, reject)=>{db.run("INSERT INTO users (user, email, password, uid) VALUES (?, ?, ?, ?)",[newUser.user, newUser.email, newUser.password, uid], function(err){
        if(err){
            reject(err);
        };
        resolve({id: this.lastID, changes:this.changes});
    });})
};

function deleteUser(email){
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
    getUserByEmail, getEmailByUser,
    postUser, updateUser,
    deleteUser, patchUser
};