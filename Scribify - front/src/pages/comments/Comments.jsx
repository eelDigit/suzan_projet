import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import Comment from "./Comment";

const Comments = ({ bookId }) => {
  const [comments, setComments] = useState([]);
  const [err, setErr] = useState();

  const auth = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/comments/${bookId}`, {
        headers: token(),
      })
      .then((res) => {
        console.log(res);
        setComments(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, [bookId]);

  return (
    <main>
      <h1 className="b-title">Commentaires</h1>

      {comments.map((oneComment) => (
        <section key={oneComment._id}>
          <Comment bookId={bookId} commentId={oneComment._id} />
        </section>
      ))}
    </main>
  );
};

export default Comments;
