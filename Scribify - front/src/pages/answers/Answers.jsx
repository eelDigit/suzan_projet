import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import Answer from "./Answer";

const Answers = ({ bookId, commentId }) => {
  const [answers, setAnswers] = useState([]);
  const [err, setErr] = useState();

  const auth = useAuth();

  useEffect(() => {
    axios
      .get(
        `http://localhost:9000/books/comment/answers/${bookId}/${commentId}`,
        {
          headers: token(),
        }
      )
      .then((res) => {
        console.log(res);
        setAnswers(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, [bookId, commentId]);

  return (
    <main>
      <h5 className="b-title">Réponses</h5>

      {answers.map((oneAnswer) => (
        <section key={oneAnswer._id}>
          <Answer
            bookId={bookId}
            commentId={commentId}
            answerId={oneAnswer._id}
          />
        </section>
      ))}
    </main>
  );
};

export default Answers;
