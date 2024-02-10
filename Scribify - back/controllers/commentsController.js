import Book from "../models/bookModel.js";
import mongoose from "mongoose";

// Ajouter un commentaire
export const addComment = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    const { content } = req.body;

    if (content.trim() === "") {
      return res
        .status(401)
        .json({ message: "Veuillez remplir tous les champs" });
    }

    const comment = {
      userId: req.userId,
      content,
      date: new Date(),
    };

    await Book.updateOne(
      { _id: new mongoose.Types.ObjectId(bookId) },
      { $push: { comments: comment } }
    ).populate("userId", "-password");

    res.status(200).json({ message: "Le commentaire a bien été ajouté" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Impossible d'ajouter ce commentaire" });
  }
};

// Modifier un commentaire

export const updateComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    const { content } = req.body;

    const book = await Book.findById(bookId);

    const comment = book.comments.id(commentId);
    console.log(new mongoose.Types.ObjectId(req.userId));
    console.log(comment.userId);

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Ce commentaire est introuvable" });
    }

    if (req.userId.toString() !== comment.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez pas éditer ce commentaire" });
    }

    if (content) {
      comment.content = content;
      comment.date = new Date(); // Mettre à jour la date du commentaire
    }

    await book.save();

    res
      .status(200)
      .json({ message: "Le commentaire a été modifié avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Impossible de modifier le commentaire" });
  }
};

// Supprimer un commentaire

export const deleteComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    const book = await Book.updateOne(
      { _id: bookId },
      { $pull: { comments: { _id: commentId } } }
    );

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res
      .status(200)
      .json({ message: "Le commentaire a été supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Impossible de supprimer le commentaire" });
  }
};

// Récupérer tous les commentaires d'un livre
export const getAllCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const comments = book.comments;

    const populatedComments = await Book.populate(comments, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(populatedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Impossible de récupérer tous les commentaires",
    });
  }
};

// Récupérer un commentaire d'un livre
export const getOneCommentByBook = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const comment = book.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    await Book.populate(comment, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Impossible de récupérer le commentaire",
    });
  }
};
