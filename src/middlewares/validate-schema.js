function validateSchema(schema){
    return (req, res, next)=>{
        const result = schema.safeParse(req.body);

        if(!result.success){
            const formattedErrors = result.error.issues.map((issue)=>({
                field: issue.path.join('.'),
                errors: issue.message
            }));

            return res.status(400).json({
                message: "Error de validación en los datos enviados",
                errors: formattedErrors
            });
        }

        req.body = result.data;
        next();
    };
}

module.exports = validateSchema;