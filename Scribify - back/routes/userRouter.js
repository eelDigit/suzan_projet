import express from "express";
import {
  deleteUser,
  getAllUsers,
  getOneUser,
  login,
  register,
  updateRole,
  updateUser,
} from "../controllers/usersController.js";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

userRouter.get(
  "/users",
  isLogged,
  isAuthorized(["admin", "user"]),
  upload.single("image"),
  getAllUsers
);

userRouter.get(
  "/users/:id",
  isLogged,
  isAuthorized(["admin", "user"]),
  getOneUser
);

userRouter.put(
  "/users/edit/:id",
  isLogged,
  isAuthorized(["admin", "user"]),
  upload.single("image"),
  updateUser
);

userRouter.put(
  "/users/edit-role/:id",
  isLogged,
  isAuthorized(["admin"]),
  updateRole
);

userRouter.delete(
  "/users/delete/:id",
  isLogged,
  isAuthorized(["user", "admin"]),
  deleteUser
);

export default userRouter;
