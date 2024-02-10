import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import "../../assets/styles/forms/forms.css";

const MAX_DESCRIPTION_LENGTH = 250;

const EditUser = () => {
  const [inputs, setInputs] = useState({
    login: "",
    email: "",
    description: "",
    image: null,
  });

  const { id } = useParams();

  const [err, setErr] = useState();
  const [message, setMessage] = useState();
  const [descriptionError, setDescriptionError] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:9000/users/${id}`, { headers: token() })
      .then((res) => {
        setInputs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      if (value.length <= MAX_DESCRIPTION_LENGTH) {
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
        setDescriptionError(false);
      } else {
        setDescriptionError(true);
      }
    } else if (name === "image") {
      setInputs((prevInputs) => ({ ...prevInputs, image: e.target.files[0] }));
    } else {
      setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    }

    setErr("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      inputs.login.trim() === "" ||
      inputs.email.trim() === "" ||
      inputs.description.trim() === ""
    ) {
      return setErr("Merci de renseigner au moins un champ !");
    }

    if (descriptionError) {
      return setErr("La description ne peut pas dépasser 200 caractères.");
    }

    const formData = new FormData();

    formData.append("login", inputs.login);
    formData.append("email", inputs.email);
    formData.append("description", inputs.description);
    formData.append("image", inputs.image);

    axios
      .put(`http://localhost:9000/users/edit/${id}`, formData, {
        headers: token(),
      })
      .then((res) => {
        console.log(res);
        setMessage("L'utilisateur a bien été modifié !");
        setInputs((prevInputs) => ({
          ...prevInputs,
          login: "",
          email: "",
          description: "",
          image: null,
        }));
        userData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userData = (res) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const newUser = {
      ...currentUser,
      _id: res.data._id,
      email: res.data.email,
      login: res.data.login,
      description: res.data.description,
      image: res.data.image,
      role: res.data.role,
      token: currentUser.token,
    };
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <main>
      {message && <span className="success">{message}</span>}
      {descriptionError && (
        <span className="error">
          La description ne peut pas dépasser {MAX_DESCRIPTION_LENGTH}{" "}
          caractères.
        </span>
      )}
      <section className="section-style2">
        <h2>Modifier</h2>
        {inputs && (
          <>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label htmlFor="image">Image de profil : </label>
              <input
                onChange={handleChange}
                type="file"
                id="image"
                name="image"
              />

              <label htmlFor="login">Nom d'utilisateur : </label>
              <input
                className="form-input"
                onChange={handleChange}
                value={inputs.login}
                type="text"
                id="login"
                name="login"
                placeholder="Nom d'utilisateur"
              />

              <label htmlFor="email">Email : </label>

              <input
                className="form-input"
                onChange={handleChange}
                value={inputs.email}
                type="email"
                id="email"
                name="email"
                placeholder="Adresse Mail"
              />

              <label htmlFor="description">Description : </label>

              <textarea
                className="form-textarea"
                onChange={handleChange}
                value={inputs.description}
                type="text"
                id="description"
                name="description"
                placeholder="description"
              />

              <button className="form-button">Valider</button>
            </form>
          </>
        )}

        {err && <span>{err}</span>}
      </section>
    </main>
  );
};

export default EditUser;
