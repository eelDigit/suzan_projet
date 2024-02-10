import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import "../../assets/styles/forms/forms.css";

const PostEdit = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    categories: [],
    categoryId: [],
    image: null,
  });
  const [categories, setCategories] = useState([]);

  const { id } = useParams();

  const [err, setErr] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/${id}`)
      .then((res) => {
        // Ajoutez une vérification pour s'assurer que les données existent avant la mise à jour du state

        setInputs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:9000/categories")
      .then((res) => {
        // setInputs((input) => ({
        //   ...input,
        //   categories: res.data,
        // }));
        setCategories(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      setInputs((prevInputs) => ({ ...prevInputs, image: e.target.files[0] }));
    } else if (name === "categories") {
      const options = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setInputs((prevInputs) => ({ ...prevInputs, categoryId: options }));
    } else {
      setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    }

    console.log(inputs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      inputs.title.trim() === "" ||
      inputs.description.trim() === "" ||
      inputs.categoryId.length <= 0
    ) {
      return setErr("Veuillez remplir tous les champs");
    }

    const formData = new FormData();

    formData.append("title", inputs.title);
    formData.append("description", inputs.description);
    formData.append("categories", JSON.stringify(inputs.categoryId));
    formData.append("image", inputs.image);

    axios
      .put(`http://localhost:9000/books/edit/${id}`, formData, {
        headers: token(),
      })
      .then((res) => {
        console.log(res);
        setMessage("Le livre a bien été modifié !");
        setInputs((prevInputs) => ({
          ...prevInputs,
          title: "",
          description: "",
          // categoryId: [],
          // categories: [],
          image: null,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main>
      {message && <span className="success">{message}</span>}
      <section className="section-style2">
        <h2>Modifier</h2>
        {inputs._id && (
          <>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label htmlFor="image">Couverture du livre : </label>
              <input
                onChange={handleChange}
                type="file"
                id="image"
                name="image"
              />

              <label htmlFor="title">Titre du livre : </label>
              <input
                className="form-input"
                onChange={handleChange}
                value={inputs.title}
                type="text"
                id="title"
                name="title"
                placeholder="Titre"
              />

              <label htmlFor="description">Description du livre : </label>

              <textarea
                className="form-textarea"
                onChange={handleChange}
                value={inputs.description}
                type="text"
                id="description"
                name="description"
                placeholder="Description"
              />

              <label htmlFor="categories">Catégories : </label>
              <select
                multiple
                name="categories"
                id="categories"
                value={inputs.categoryId}
                onChange={handleChange}
              >
                {categories &&
                  categories.map((category, index) => (
                    <option value={category._id} key={index}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <button className="form-button">Valider</button>
            </form>
          </>
        )}

        {err && <span>{err}</span>}
      </section>
    </main>
  );
};
export default PostEdit;
