import Book from "../models/bookModel.js";
import mongoose from "mongoose";

// Ajouter une réponse à un commentaire
export const addAnswer = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(bookId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({ message: "Invalid bookId or commentId" });
    }

    const { content } = req.body;

    if (!content.trim()) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }

    const book = await Book.findOne({
      _id: new mongoose.Types.ObjectId(bookId),
      "comments._id": new mongoose.Types.ObjectId(commentId),
    });

    if (!book) {
      return res.status(404).json({ message: "Book or Comment not found" });
    }

    if (book.userId.toString() !== req.userId) {
      throw new Error(
        "Vous ne pouvez ajouter des réponses qu'à vos propres livres"
      );
    }

    const answer = {
      userId: new mongoose.Types.ObjectId(req.userId),
      content,
      date: new Date(),
    };

    await Book.updateOne(
      {
        _id: new mongoose.Types.ObjectId(bookId),
        "comments._id": new mongoose.Types.ObjectId(commentId),
      },
      { $push: { "comments.$.answers": answer } }
    );

    res.status(200).json({ message: "La réponse a bien été ajoutée" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Impossible d'ajouter une nouvelle réponse",
      error: error.message,
    });
  }
};

// Mettre à jour une réponse à un commentaire
export const updateAnswer = async (req, res) => {
  try {
    const { bookId, commentId, answerId } = req.params;
    const { content } = req.body;

    const book = await Book.findById(bookId);

    const comment = book.comments.id(commentId);
    const answer = comment.answers.id(answerId);

    if (!answer) {
      res.status(404).json({ message: "Cette réponse est introuvable" });
    }

    if (content) {
      answer.content = content;
      answer.date = new Date(); // Mettre à jour la date de la réponse
    }

    await book.save();

    res.status(200).json({ message: "La réponse a été modifiée avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Impossible de modifier la réponse" });
  }
};

// Supprimer une réponse à un commentaire
export const deleteAnswer = async (req, res) => {
  try {
    const { bookId, commentId, answerId } = req.params;
    const book = await Book.findById(bookId);

    const comment = book.comments.id(commentId);

    comment.answers.pull({ _id: answerId }); // Utilisation de pull pour supprimer l'élément du tableau

    await book.save();

    res.status(200).json({ message: "La réponse a été supprimée avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Impossible de supprimer la réponse" });
  }
};

// Récupérer toutes les réponses d'un commentaire
export const getAllAnswersByComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const comment = book.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    const answers = comment.answers;

    const populatedAnswers = await Book.populate(answers, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(populatedAnswers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Impossible de récupérer toutes les réponses du commentaire",
    });
  }
};

// Récupérer une réponse d'un commentaire
export const getOneAnswerByComment = async (req, res) => {
  try {
    const { bookId, commentId, answerId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const comment = book.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    const answer = comment.answers.id(answerId);

    if (!answer) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }

    await Book.populate(answer, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(answer);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Impossible de récupérer la réponse du commentaire",
    });
  }
};
