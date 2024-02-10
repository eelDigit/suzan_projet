import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  addComment,
  deleteComment,
  getAllCommentsByBook,
  getOneCommentByBook,
  updateComment,
} from "../controllers/commentsController.js";
import upload from "../middlewares/multer.js";

const commentRouter = express.Router();

commentRouter.get(
  "/books/comments/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getAllCommentsByBook
);

commentRouter.get(
  "/books/comment/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getOneCommentByBook
);

commentRouter.post(
  "/books/comment/new/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  upload.single("image"),
  addComment
);

commentRouter.put(
  "/books/comment/edit/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  updateComment
);

commentRouter.delete(
  "/books/comment/delete/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  deleteComment
);

export default commentRouter;
