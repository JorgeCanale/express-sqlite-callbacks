function checkRol(...allowedRoles){
    return(req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"Acceso denegado. No tienes los permisos suficientes para realizar esta acción"});
        };
        next();
    };
};

module.exports = checkRol;