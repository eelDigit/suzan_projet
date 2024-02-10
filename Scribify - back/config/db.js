import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = () => {
  mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then(() => console.log("Connexion à la BDD établie !"))
    .catch(() => console.log("Impossible de se connecter à la BDD"));
};

export default connectDB;
