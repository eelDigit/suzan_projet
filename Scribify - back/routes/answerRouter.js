import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  addAnswer,
  updateAnswer,
  deleteAnswer,
  getAllAnswersByComment,
  getOneAnswerByComment,
} from "../controllers/answersController.js";

const answerRouter = express.Router();

answerRouter.get(
  "/books/comment/answers/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getAllAnswersByComment
);

answerRouter.get(
  "/books/comment/answer/:bookId/:commentId/:answerId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getOneAnswerByComment
);

answerRouter.post(
  "/books/comment/answer/new/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  addAnswer
);

answerRouter.put(
  "/books/comment/answer/edit/:bookId/:commentId/:answerId",
  isLogged,
  isAuthorized(["admin", "user"]),
  updateAnswer
);

answerRouter.delete(
  "/books/comment/answer/delete/:bookId/:commentId/:answerId",
  isLogged,
  isAuthorized(["admin", "user"]),
  deleteAnswer
);

answerRouter.delete(
  "/books/comment/answer-by-admin/delete/:bookId/:commentId/:answerId",
  isLogged,
  isAuthorized(["admin"]),
  deleteAnswer
);

export default answerRouter;
