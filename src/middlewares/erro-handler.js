function errorHandler(err,req,res,next){
    console.log("Error capturado por el middleware centralizado:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({error: message, detail: err.detail || null});

}

module.exports = errorHandler;