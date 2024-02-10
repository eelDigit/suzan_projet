import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  addChapter,
  deleteChapter,
  getAllChaptersByBook,
  getOneChapterByBook,
  updateChapter,
} from "../controllers/chaptersController.js";

const chapterRouter = express.Router();

chapterRouter.get(
  "/books/chapters/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getAllChaptersByBook
);

chapterRouter.get(
  "/books/chapter/:bookId/:chapterId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getOneChapterByBook
);

chapterRouter.post(
  "/books/chapter/new/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  addChapter
);

chapterRouter.put(
  "/books/chapter/edit/:bookId/:chapterId",
  isLogged,
  isAuthorized(["admin", "user"]),
  updateChapter
);

chapterRouter.delete(
  "/books/chapter/delete/:bookId/:chapterId",
  isLogged,
  isAuthorized(["admin", "user"]),
  deleteChapter
);

export default chapterRouter;
