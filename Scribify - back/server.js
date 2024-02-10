import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import bookRouter from "./routes/bookRouter.js";
import userRouter from "./routes/userRouter.js";
import commentRouter from "./routes/commentRouter.js";
import chapterRouter from "./routes/chapterRouter.js";
import answerRouter from "./routes/answerRouter.js";
import categoryRouter from "./routes/categoryRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

dotenv.config();

connectDB();

app.use(bookRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(answerRouter);
app.use(chapterRouter);
app.use(categoryRouter);

app.listen(process.env.PORT, () => {
  console.log(`Le serveur est exécuté à : ${process.env.BASE_URL}`);
});
