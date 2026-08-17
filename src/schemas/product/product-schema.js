const {z} = require("zod");

const createProductSchema = z.object({
    name: z.string({
        required_error: "El nombre es obligatorio",
        invalid_type_error: "El nombre debe ser una cadena de texto"
    })
    .min(2,{message: "El nombre debe tener al menos 2 caracteres"}),
    price: z.number({
        required_error: "El precio es obligatorio",
        invalid_type_error:"El precio debe ser un número "
    })
    .positive({ message: "El precio debe ser un número positivo mayor a 0"})
});

const updateProductSchema = createProductSchema.partial();

module.exports = {
    createProductSchema,
    updateProductSchema
}