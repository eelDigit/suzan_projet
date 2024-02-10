import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import "../../assets/styles/forms/forms.css";
import { useAuth } from "../../context/AuthContext";

const AddComment = ({ bookId }) => {
  const [inputs, setInputs] = useState({
    content: "",
  });

  const auth = useAuth();

  const [err, setErr] = useState();
  const [message, setMessage] = useState();

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

      const comment = {
        content: inputs.content,
        pseudo: auth.user.login,
      };
      console.log(bookId);
      await axios
        .post(`http://localhost:9000/books/comment/new/${bookId}`, comment, {
          headers: token(),
        })
        .then((res) => {
          setMessage("Le commentaire a bien été ajouté");
          setInputs({
            content: "",
          });
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
        <label htmlFor="content">Ajouter un commentaire : </label>

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

export default AddComment;
