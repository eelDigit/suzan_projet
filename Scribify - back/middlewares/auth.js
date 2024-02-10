import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

export const isLogged = (req, res, next) => {
  let authToken = req.headers.authorization;
  console.log(authToken);

  //J'extrais le token du headers de la requête
  let token = authToken && authToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Vous n'êtes pas authentifié" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(403).json({ message: "Token invalide" });
    }

    req.userId = decoded.id;

    next();
  });
};

export const isAuthorized = (roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Gestion des différents rôles d'une application
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Vos permissions ne vous permettent pas d'accéder à la page",
      });
    }
    next();
  };
};
