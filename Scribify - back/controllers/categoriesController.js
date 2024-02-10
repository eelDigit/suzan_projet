import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

// Fonction pour ajouter une catégorie générale par l'administrateur
export const addGeneralCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name.trim() === "" || description.trim() === "") {
      return res.status(401).json({
        message: "Veuillez remplir tous les champs !",
      });
    }

    const category = new Category({
      name,
      description,
      image: {
        src: req.file ? req.file.filename : "",
        alt: req.file ? req.file.originalname : "",
      },
    });

    await category.save();

    res.status(200).json({ message: "Categorie bien créée" });
  } catch (error) {
    console.error("Error creating a catégorie:", error);
    res.status(500).json({ message: "Impossible de créer une catégorie" });
  }
};

// // Ajouter une catégorie à un livre
// export const addBookCategory = async (req, res) => {
//   try {
//     const { name } = req.body;

//     const bookId = req.bookId ? req.bookId : null;

//     if (name.trim() === "") {
//       return res.status(401).json({
//         message: "Veuillez remplir tous les champs !",
//       });
//     }

//     const category = new Category({
//       name,
//       bookId,
//     });

//     await category.save();

//     res.status(200).json({ message: "Categorie bien ajoutée au livre" });
//   } catch (error) {
//     console.error("Error adding a catégorie to book:", error);
//     res
//       .status(500)
//       .json({ message: "Impossible d'ajouter une catégorie au livre" });
//   }
// };

// // Modifier une catégorie spécifique à un livre pour un utilisateur
// export const updateCategoryByUser = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     // Vérifier si la catégorie existe
//     if (!category) {
//       res.status(404).json({ message: "Catégorie non trouvée" });
//     }

//     // Vérifier si l'utilisateur est autorisé à mettre à jour cette catégorie
//     if (category.bookId != req.bookId) {
//       res
//         .status(401)
//         .json({ message: "Non autorisé à modifier cette catégorie" });
//     }

//     // Extraire les champs à mettre à jour à partir du corps de la requête
//     const { name } = req.body;

//     // Vérifier que les champs requis ne sont pas vides
//     if (!name || name.trim() === "") {
//       res.status(400).json({ message: "Veuillez remplir tous les champs !" });
//     }

//     // Construire l'objet de mise à jour
//     const updateObject = {
//       name,
//       bookId: new mongoose.Types.ObjectId(req.bookId), // Mise à jour de l'ID du livre associé
//     };

//     // Mettre à jour la catégorie dans la base de données
//     const updatedCategory = await Category.findByIdAndUpdate(
//       req.params.id,
//       updateObject,
//       { new: true }
//     );

//     // Vérifier si la catégorie a bien été mise à jour
//     if (!updatedCategory) {
//       throw new Error("Impossible de mettre à jour la catégorie");
//     }

//     // Envoyer la réponse avec la catégorie mise à jour
//     res.status(200).json(updatedCategory);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Impossible de mettre à jour la catégorie",
//       error: error.message,
//     });
//   }
// };

// Modifier une catégorie en général (pour l'administrateur)
export const updateCategoryByAdmin = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    // Vérifier si la catégorie existe
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Extraire les champs à mettre à jour à partir du corps de la requête
    const { name, description } = req.body;

    // Vérifier que les champs requis ne sont pas vides
    if (
      !name ||
      name.trim() === "" ||
      !description ||
      description.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs !" });
    }

    // Construire l'objet de mise à jour
    const updateObject = {
      name,
      description,
    };

    if (req.file) {
      updateObject.image = {
        src: req.file.filename,
        alt: req.file.originalname,
      };
    } else {
      updateObject.image = { src: category.image.src, alt: category.image.alt };
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateObject,
      { new: true }
    );

    // Vérifier si la catégorie a bien été mise à jour
    if (!updatedCategory) {
      throw new Error("Impossible de mettre à jour la catégorie");
    }

    // Envoyer la réponse avec la catégorie mise à jour
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Impossible de mettre à jour la catégorie",
      error: error.message,
    });
  }
};

// Supprimer une catégorie en général (pour l'administrateur)
export const deleteCategoryByAdmin = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    return res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    return res.status(500).json({
      message: "Impossible de supprimer la catégorie",
      error: error.message,
    });
  }
};

// // Supprimer une catégorie d'un livre pour un utilisateur
// export const deleteCategoryByUser = async (req, res) => {
//   try {
//     const category = await Category.findOneAndDelete({
//       _id: req.params.id,
//       bookId: req.params.bookId, // Assure que seule la catégorie associée à ce livre peut être supprimée
//     });

//     if (!category) {
//       return res.status(404).json({
//         message:
//           "Catégorie non trouvée ou vous n'êtes pas autorisé à la supprimer",
//       });
//     }

//     return res.status(200).json({ message: "Catégorie supprimée avec succès" });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Impossible de supprimer la catégorie",
//       error: error.message,
//     });
//   }
// };

// Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Impossible de récupérer les catégories",
      error: error.message,
    });
  }
};

// Récupérer une seule catégorie
export const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      return res.status(404).json({ message: "Aucune catégorie trouvée" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération de la catégorie",
      error: error.message,
    });
  }
};

// Récupérer toutes les catégories avec les livres associés
export const getAllCategoriesWithBooks = async (req, res) => {
  try {
    const categoriesWithBooks = await Category.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "categories",
          as: "books",
        },
      },
    ]);

    res.status(200).json(categoriesWithBooks);
  } catch (error) {
    res.status(500).json({
      message:
        "Impossible de récupérer les catégories avec les livres associés",
      error: error.message,
    });
  }
};

// // // Ajouter une catégorie
// // export const addCategory = async (req, res) => {
// //   try {
// //     const { category } = req.body;

// //     if (!category || category.trim() === "") {
// //       return res
// //         .status(401)
// //         .json({ message: "Veuillez fournir une catégorie valide" });
// //     }

// //     const existingCategory = await Book.findOne({ categories: category });
// //     if (existingCategory) {
// //       return res.status(401).json({ message: "Cette catégorie existe déjà" });
// //     }

// //     await Book.updateOne({}, { $push: { categories: category } });

// //     res.status(200).json({ message: "Catégorie ajoutée avec succès" });
// //   } catch (error) {
// //     console.error("Error adding category:", error);
// //     res.status(500).json({ message: "Impossible d'ajouter une catégorie" });
// //   }
// // };

// export const getAllCategories = async (req, res) => {
//   try {
//     const categories = await Book.distinct("categories");

//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({
//       message: "Impossible de récupérer les catégories",
//     });
//   }
// };

// export const getAllCategoriesByBook = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     const book = await Book.findById(bookId);

//     if (!book) {
//       return res.status(404).json({ message: "Livre non trouvé" });
//     }

//     const categories = book.categories;

//     const populatedCategories = await Book.populate(categories, {
//       path: "userId",
//       select: "-password",
//     });

//     res.status(200).json(populatedCategories);
//   } catch (error) {
//     res.status(500).json({
//       message: "Impossible de récupérer les catégories",
//     });
//   }
// };
