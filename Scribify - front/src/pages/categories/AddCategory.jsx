import React, { useState } from "react";
import axios from "axios";
import { token } from "../../context/token";

import "../../assets/styles/forms/forms.css";

const AddCategory = () => {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [err, setErr] = useState();
  const [message, setMessage] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setInputs({ ...inputs, image: e.target.files[0] });
    } else {
      setInputs({ ...inputs, [name]: value });
    }

    setErr("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputs.name.trim() === "" || inputs.description.trim() === "") {
      return setErr("Veuillez remplir tous les champs");
    }

    const formData = new FormData();

    formData.append("name", inputs.name);
    formData.append("description", inputs.description);
    formData.append("image", inputs.image);

    axios
      .post("http://localhost:9000/categories/new", formData, {
        headers: token(),
      })
      .then((res) => {
        setMessage(res.data.message);
        setInputs({
          ...inputs,
          name: "",
          description: "",
          image: null,
        });
        console.log(inputs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main>
      {message && <span className="success">{message}</span>}

      <section className="section-style2">
        <h2>Ajouter une catégorie</h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="form-style2"
        >
          <label htmlFor="image">Couverture de catégorie : </label>
          <input onChange={handleChange} type="file" id="image" name="image" />
          <label htmlFor="name">Name : </label>
          <input
            className="form-input"
            onChange={handleChange}
            value={inputs.name}
            type="text"
            id="name"
            name="name"
            placeholder="Nom"
          />

          <label htmlFor="description">Description : </label>

          <textarea
            className="form-textarea"
            onChange={handleChange}
            value={inputs.description}
            type="text"
            id="description"
            name="description"
            placeholder="Description"
          />

          <button className="form-button">Valider</button>
        </form>
        {err && <span>{err}</span>}
      </section>
    </main>
  );
};

export default AddCategory;
