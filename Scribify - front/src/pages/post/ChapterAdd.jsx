import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import "../../assets/styles/forms/forms.css";

const ChapterAdd = () => {
  const [inputs, setInputs] = useState({
    chapterContent: "",
    chapterTitle: "",
  });

  const { bookId } = useParams();

  const [err, setErr] = useState();
  const [message, setMessage] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErr("");
    setMessage("");
  };

  const handleQuill = (chapterContent, delta, source, editor) => {
    setInputs({ ...inputs, chapterContent: editor.getHTML() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        inputs.chapterContent.trim() === "" ||
        inputs.chapterTitle.trim() === ""
      ) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const chapter = {
        chapterTitle: inputs.chapterTitle,
        chapterContent: inputs.chapterContent,
      };

      const data = {
        chapters: [chapter],
      };

      await axios
        .post(`http://localhost:9000/books/chapter/new/${bookId}`, data, {
          headers: token(),
        })
        .then((res) => {
          setMessage("Le chapitre a bien été ajouté");
          setInputs({
            chapterContent: "",
            chapterTitle: "",
          });
        });
    } catch (error) {
      console.error(error);
      setErr(error.message);
    }
  };

  return (
    <main>
      {message && <span className="success">{message}</span>}
      <section className="section-style2">
        <h2>Ajouter un chapitre</h2>
        <form onSubmit={handleSubmit} className="form-style2">
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
      </section>{" "}
    </main>
  );
};

export default ChapterAdd;
