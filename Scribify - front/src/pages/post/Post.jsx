import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";

import "../../assets/styles/forms/forms.css";

const Post = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    categories: [],
    categoryId: [],
    image: null,
    chapterContent: "",
    chapterTitle: "",
  });
  const [err, setErr] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:9000/categories")
      .then((res) => {
        setInputs({
          ...inputs,
          categoryId: res.data,
          categories: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setInputs({ ...inputs, image: e.target.files[0] });
    } else if (name === "categories") {
      //transformer un objet en tableau
      const options = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setInputs({ ...inputs, categoryId: options });
    } else {
      setInputs({ ...inputs, [name]: value });
    }

    setErr("");
    setMessage("");
  };

  const handleQuill = (chapterContent, delta, source, editor) => {
    setInputs({ ...inputs, chapterContent: editor.getHTML() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      inputs.title.trim() === "" ||
      inputs.description.trim() === "" ||
      inputs.categoryId.length <= 0 ||
      inputs.chapterContent.trim() === "" ||
      inputs.chapterTitle.trim() === ""
    ) {
      return setErr("Veuillez remplir tous les champs");
    }

    const formData = new FormData();

    formData.append("title", inputs.title);
    formData.append("description", inputs.description);
    formData.append("categories", JSON.stringify(inputs.categoryId));
    formData.append("image", inputs.image);

    const chapter = [
      { title: inputs.chapterTitle, content: inputs.chapterContent },
    ];

    formData.append("chapters", JSON.stringify(chapter));

    axios
      .post("http://localhost:9000/books/new", formData, {
        headers: token(),
      })
      .then((res) => {
        setMessage(res.data.message);
        setInputs({
          ...inputs,
          title: "",
          description: "",
          chapterContent: "",
          chapterTitle: "",
          categories: [],
          categoryId: [],
          image: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main>
      {message && <span className="success">{message}</span>}

      <section className="section-style2">
        <h2>Publier</h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="form-style2"
        >
          <label htmlFor="image">Couverture de livre : </label>
          <input onChange={handleChange} type="file" id="image" name="image" />
          <label htmlFor="title">Titre : </label>
          <input
            className="form-input"
            onChange={handleChange}
            value={inputs.title}
            type="text"
            id="title"
            name="title"
            placeholder="Titre"
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

          <label htmlFor="categories">Catégories : </label>
          <select
            multiple
            name="categories"
            id="categories"
            value={inputs.categories}
            onChange={handleChange}
          >
            {inputs.categories.map((category, index) => (
              <option value={category._id} key={index}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="chapterTitle">Titre du chapitre : </label>
          <input
            className="form-input"
            onChange={handleChange}
            value={inputs.chapterTitle}
            type="text"
            id="chapterTitle"
            name="chapterTitle"
            placeholder="Titre du chapitre"
          />

          <ReactQuill
            className="ql-editor"
            theme="snow"
            value={inputs.chapterContent}
            onChange={handleQuill}
            placeholder="Contenu du chapitre"
          />

          <button className="form-button">Valider</button>
        </form>
        {err && <span>{err}</span>}
      </section>
    </main>
  );
};

export default Post;
