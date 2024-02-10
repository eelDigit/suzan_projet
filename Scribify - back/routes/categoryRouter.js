import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  // addBookCategory,
  addGeneralCategory,
  deleteCategoryByAdmin,
  // deleteCategoryByUser,
  getAllCategories,
  getAllCategoriesWithBooks,
  getOneCategory,
  updateCategoryByAdmin,
  // updateCategoryByUser,
} from "../controllers/categoriesController.js";
import upload from "../middlewares/multer.js";

const categoryRouter = express.Router();

// Récupérer toutes les catégories
categoryRouter.get("/categories", getAllCategories);

// Récupérer toutes les catégories avec les livres associés
categoryRouter.get("/categories/withBooks", getAllCategoriesWithBooks);

// Récupérer une seule catégorie
categoryRouter.get("/categories/:id", getOneCategory);

// Ajouter une catégorie générale par l'administrateur
categoryRouter.post(
  "/categories/new",
  isLogged,
  isAuthorized(["admin"]),
  upload.single("image"),
  addGeneralCategory
);

// // Ajouter une catégorie à un livre
// categoryRouter.post(
//   "/books/categories/new",
//   isLogged,
//   isAuthorized(["user", "admin"]),
//   addBookCategory
// );

// // Modifier une catégorie spécifique à un livre pour un utilisateur
// categoryRouter.put(
//   "books/categories/edit/:id",
//   isLogged,
//   isAuthorized(["user", "admin"]),
//   updateCategoryByUser
// );

// Modifier une catégorie en général (pour l'administrateur)
categoryRouter.put(
  "/categories/edit/:id",
  isLogged,
  isAuthorized(["admin"]),
  upload.single("image"),
  updateCategoryByAdmin
);

// // Supprimer une catégorie d'un livre pour un utilisateur
// categoryRouter.delete(
//   "books/categories/delete/:id/:bookId",
//   isLogged,
//   isAuthorized(["user", "admin"]),
//   deleteCategoryByUser
// );

// Supprimer une catégorie en général (pour l'administrateur)
categoryRouter.delete(
  "/categories/delete/:id",
  isLogged,
  isAuthorized(["admin"]),
  deleteCategoryByAdmin
);

export default categoryRouter;
