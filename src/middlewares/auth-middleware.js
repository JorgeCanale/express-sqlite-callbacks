const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No se proporciono un token" });
    }

    const splitedHeader = req.headers.authorization.split(" ");

    if (splitedHeader.length < 2 || splitedHeader[0] !== "Bearer") {
      return res.status(401).json({ message: "Formato de token invalido" });
    }

    const clave = process.env.JWT_SECRET;

    const payload = jwt.verify(splitedHeader[1], clave);

    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ message: "error de autenticacion", detail: err });
  }
};


module.exports = authMiddleware;