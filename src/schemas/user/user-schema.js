const {z} = require('zod');

const createUserSchema = z.object({
    user: z.string({
        required_error: "El usuario es obligatorio",
        invalid_type_error: "El usuario debe ser una cadena de texto"
    })
    .min(3,{message: "el usuario debe tener almenos 3 caracteres"}),
    email: z.string().email({
        required_error: "El email es obligatorio",
        invalid_type_error: "El email debe ser una cadena de texto"
    }),
    password: z.string({
        required_error:"La contraseña es obligatoria",
        invalid_type_error: "La contraseña debe ser una cadena de texto"
    }).regex(/[A-Z]/,{message: "La cadena de texto debe poseer almenos una carater en mayuscula"})
    .min(8,{message: "La contraseña debe ser de un minimo de 8 caracteres"})
    .max(24,{message: "La contraseña debe ser de un maximo de 24 caracteres"}),
});

module.exports = createUserSchema;