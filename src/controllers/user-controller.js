const {getEmailByUser,getUserByEmail, getUserPass,
    postUser,deleteUser,updateUser,patchUser
} = require('../models/user-model');
const bcrypt = require("bcryptjs");


async function getByEmail(req, res ){
    try{      
        const userData = await getUserByEmail(req.body.email);

        if(!userData){
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        return res.status(200).json(userData);
    }catch(err){
        return res.status(500).json({err: "Erro en el servidor", detail: err});
    }
};

async function getByUser(req, res){
    try {

        const userName = await getEmailByUser(req.body.user);

        if(!userName){
            return res.status(404).json({message:"El email no esta asociado a ningun usuario"});
        }

        return res.status(200).json(userName);
    } catch (err) {
        return res.status(500).json({message:"Error en el servidor", detail: err});
    };
};

async function createUser(req,res, next){
    try {

        const existUser = await getUserByEmail(req.body.email);

        if(existUser){
            return res.status(409).json({message:"el email ya se encuentra registrado"});
        }
        
        const { user, password, email} = req.body;

        const uuid = crypto.randomUUID();

        console.log(uuid)
        
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await postUser({user, email, password: hashedPassword, uuid});

        console.log(result);

        return res.status(201).json({message:"El usuario se creo correctamente"});
    } catch (err) {
        next(err)
    }
}

async function updateFullUser(req, res, next) {
    try {
        const user = await updateUser(req.body.email, req.body);

        if(user.changes == 0){
            return res.status(404).json({message:"El usuario no a podido ser actualizado", changes: user.changes});
        };

        return res.status(200).json({message: "El usuario se ha actualizado correctamente", changes: user.changes})
    } catch (err) {
        next(err)
    }
}


async function updatePartialUser(req,res,next){
    try {
        let query ="UPDATE users SET ";
        let queryRows = Object.keys(req.body).map(key => {return key += " = ?"}).join(" , ")
        let queryEnd = "WHERE uid = ?";
        console.log(req.body.uid);
        

        const user = await patchUser(query.concat(queryRows, queryEnd),[...Object.values(req.body),]);

        if(user.changes == 0){
            return res.status(404).json({message: "No sea podido actualizar el usuario", changes: user.changes});
        };
        return res.status(200).json({message: "El usuario a sido actualizado correctamente", id: user.id, changes: user.changes});

    } catch (err) {
        next(err)
    };
};

async function loginUser(req, res, next){
    try {
        const userPass = await getUserPass(req.body.email);

        const equal = await bcrypt.compare(req.body.password, userPass); 

        if(!equal){
            return res.status(400).json({message:"alguno de los datos ingresados es incorrectos"});
        }
        
        return res.status(200).json({message: "sesion iniciada correctamente"});

        
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createUser, getByEmail,
    getByUser, updateUser,
    updatePartialUser, deleteUser, loginUser
}