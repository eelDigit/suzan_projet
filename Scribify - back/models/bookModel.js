import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    categoryId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    title: {
      type: String,
      required: true,
    },
    chapters: [
      {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
        },
      },
    ],
    description: {
      type: String,
      required: true,
    },
    image: {
      src: String,
      alt: String,
    },
    comments: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        content: String,
        date: Date,
        answers: [
          {
            userId: {
              type: mongoose.Types.ObjectId,
              ref: "User",
            },
            content: String,
            date: Date,
          },
        ],
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
