import React, { useState } from "react";
import "../../assets/styles/forms/forms.css";
import { useAuth } from "../../context/AuthContext";

const AddAnswer = ({ handleAnswer }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (inputs.content.trim() === "") {
        throw new Error("Veuillez remplir tous les champs");
      }

      handleAnswer(inputs.content);

      setMessage("La réponse au commentaire a bien été ajoutée");
      setInputs({
        content: "",
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
          placeholder="Votre réponse"
        />

        <button className="form-button">Répondre</button>
      </form>
      {err && <span>{err}</span>}
    </section>
  );
};

export default AddAnswer;
