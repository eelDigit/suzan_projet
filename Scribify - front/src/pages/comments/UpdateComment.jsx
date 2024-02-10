import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import "../../assets/styles/forms/forms.css";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const UpdateComment = () => {
  const [inputs, setInputs] = useState({
    content: "",
  });

  const auth = useAuth();

  const [err, setErr] = useState();
  const [message, setMessage] = useState();

  const { bookId, commentId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/comment/${bookId}/${commentId}`, {
        headers: token(),
      })
      .then((res) => {
        setInputs({
          content: res.data.content,
        });
      })
      .catch((error) => {
        console.error(error);
        setErr("Impossible de charger les données du commentaire");
      });
  }, [bookId, commentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErr("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (inputs.content.trim() === "") {
        throw new Error("Veuillez remplir tous les champs");
      }

      const updatedComment = {
        content: inputs.content,
      };

      await axios
        .put(
          `http://localhost:9000/books/comment/edit/${bookId}/${commentId}`,
          updatedComment,
          {
            headers: token(),
          }
        )
        .then((res) => {
          setMessage("Le commentaire a bien été mis à jour");
        });
    } catch (error) {
      console.error(error);
      setErr(error.message);
    }
  };

  return (
    <section>
      {message && <span className="success">{message}</span>}

      <form onSubmit={handleSubmit} className="form-style2">
        <label htmlFor="content">Modifier le commentaire : </label>

        <img
          className="style-base2"
          src={`http://localhost:9000/assets/img/${auth.user.image.src}`}
          alt={auth.user.image.alt}
        />
        <h5>{auth.user.login}</h5>
        <textarea
          className="form-textarea"
          onChange={handleChange}
          value={inputs.content}
          type="text"
          id="content"
          name="content"
          placeholder="Votre commentaire"
        />

        <button className="form-button">Valider</button>
      </form>
      {err && <span>{err}</span>}
    </section>
  );
};

export default UpdateComment;
