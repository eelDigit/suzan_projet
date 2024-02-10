import Book from "../models/bookModel.js";
import mongoose from "mongoose";
import Category from "../models/categoryModel.js";

// Récupérer tous les livres
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate("userId", "-password")
      .populate("categoryId");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Impossible de récupérer les livres",
    });
  }
};

// Récupérer un seul livre
export const getOneBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({ _id: id })
      .populate("userId", "-password")
      .populate("categoryId");

    if (!book) {
      return res.status(404).json({ message: "Aucun livre trouvé" });
    }

    // condition en sélectionnant req.userId (le faire pck)
    book.views += 1;
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Une erreur est survenue lors de la récupération du livre",
    });
  }
};

// Récupérer tous les livres postés par un utilisateur
export const getBooksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const books = await Book.find({
      userId: userId,
    })
      .populate("userId", "-password")
      .populate("categoryId");

    res.status(200).json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération de vos livres",
    });
  }
};

// Créer un livre
export const addBook = async (req, res) => {
  try {
    const { title, description, chapters, categories } = req.body;

    const userId = req.userId ? req.userId : null;

    if (
      title.trim() === "" ||
      description.trim() === "" ||
      categories.length === 0 ||
      chapters.length === 0
    ) {
      return res.status(401).json({
        message:
          "Veuillez remplir tous les champs, y compris au moins un chapitre et au moins une catégorie",
      });
    }

    // convertir la chaine de caractère en tableau (avec les images)
    const parseChapters = JSON.parse(chapters);
    const parseCategories = JSON.parse(categories);

    const book = new Book({
      title,
      description,
      userId,
      categoryId: parseCategories,
      chapters: parseChapters.map((chapter) => ({
        title: chapter.title,
        content: chapter.content,
        date: new Date(),
      })),
      image: {
        src: req.file ? req.file.filename : "",
        alt: req.file ? req.file.originalname : "",
      },
    });

    await book.save();

    res.status(200).json({ message: "Livre bien créé" });
  } catch (error) {
    console.error("Error creating a book:", error);
    res.status(500).json({ message: "Impossible de créer un livre" });
  }
};

// Aimer un livre
export const likeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const updateBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        [book.likes.includes(req.userId) ? "$pull" : "$addToSet"]: {
          likes: new mongoose.Types.ObjectId(req.userId),
        },
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    return res.status(200).json({
      message: updateBook.likes.includes(req.userId)
        ? "Vous avez enlevé votre like avec succès"
        : "Vous avez liké le livre avec succès",
      likes: updateBook.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Impossible de traiter l'action de like",
      error: error.message,
    });
  }
};

// Modifier un livre
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book || !req.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    if (book.userId != req.userId) {
      throw new Error("Vous ne pouvez mettre à jour que vos propres livres");
    }

    const { title, description, categories } = req.body;

    if (
      (title && title.trim() === "") ||
      (description && description.trim() === "") ||
      (categories && categories.length <= 0)
    ) {
      return res.status(401).json({
        message: "Veuillez remplir tous les champs !",
      });
    }

    const parseCategories = JSON.parse(categories);

    const updateObject = {
      title,
      description,
      userId: new mongoose.Types.ObjectId(req.userId),
      categoryId: parseCategories,
    };

    if (req.file) {
      updateObject.image = {
        src: req.file.filename,
        alt: req.file.originalname,
      };
    } else {
      updateObject.image = { src: book.image.src, alt: book.image.alt };
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateObject,
      { new: true }
    );

    if (!updatedBook) {
      throw new Error("Vous ne pouvez mettre à jour que vos propres livres");
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Impossible de mettre à jour le livre",
      error: error.message,
    });
  }
};

// Supprimer un livre
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    return res.status(200).json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({
      message: "Impossible de supprimer le livre",
      error: error.message,
    });
  }
};

// Récuperer les livres populaires
export const getPopularBooksList = async (req, res) => {
  try {
    const popularBooks = await Book.find({})
      .sort({ likes: -1 })
      .limit(10)
      .populate({
        path: "userId",
        select: "-password",
      });

    res.status(200).json(popularBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des livres populaires",
      error: error.message,
    });
  }
};

// Récupérer les nouveaux livres
export const getNewestBooks = async (req, res) => {
  try {
    const newestBooks = await Book.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "userId",
        select: "-password",
      });

    res.status(200).json(newestBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des nouveaux livres",
      error: error.message,
    });
  }
};

// Les derniers livres publiés (updated)
export const getLatestBooks = async (req, res) => {
  try {
    const latestBooks = await Book.find({}).sort({ updatedAt: -1 }).populate({
      path: "userId",
      select: "-password",
    });

    res.status(200).json(latestBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des derniers livres",
      error: error.message,
    });
  }
};

// Récupérer les derniers chapitres publiés
export const getLatestChapters = async (req, res) => {
  try {
    const latestChapters = await Book.aggregate([
      { $unwind: "$chapters" }, // Split the chapters array into separate documents
      { $sort: { "chapters.updatedAt": -1 } }, // Sort by chapter's last update time in descending order
      { $limit: 10 }, // Limit the result to the latest 10 chapters
      {
        $lookup: {
          // Perform a join to get user details
          from: "users",
          localField: "chapters.userId",
          foreignField: "_id",
          as: "chapters.userDetails",
        },
      },
      {
        $project: {
          // Project the necessary fields
          bookId: "$_id",
          title: "$chapters.title",
          content: "$chapters.content",
          date: "$chapters.date",
          updatedAt: "$chapters.updatedAt",
          userDetails: { $arrayElemAt: ["$chapters.userDetails", 0] },
        },
      },
    ]);

    res.status(200).json(latestChapters);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des derniers chapitres",
      error: error.message,
    });
  }
};

export const getBooksByCategoryName = async (req, res) => {
  try {
    const categoryName = req.params.id;
    // console.log(categoryName);
    const category = await Category.findOne({ _id: categoryName });
    // console.log(category);

    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Recherche des livres qui ont le même nom de catégorie
    const books = await Book.find({ categoryId: { $in: [category._id] } });
    console.log(books);
    console.log(category._id);

    res.status(200).json({ category, books });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des livres par catégorie",
      error: error.message,
    });
  }
};

// ------------ ESPACE ADMIN ------------ //

// Supprimer tous les livres d'un utilisateur

export const deleteAllBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const book = await Book.deleteMany({
      userId: userId,
    }).populate("userId", "-password");

    if (!book) {
      return res.status(404).json({ message: "Livres non trouvés" });
    }

    return res
      .status(200)
      .json({ message: "Tous les livres ont été supprimés avec succès" });
  } catch (error) {
    return res.status(500).json({
      message: "Impossible de supprimer les livres",
      error: error.message,
    });
  }
};
