import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import "../../assets/styles/forms/forms.css";

const ChapterUpdate = () => {
  const [inputs, setInputs] = useState({
    chapterContent: "",
    chapterTitle: "",
  });

  const { bookId, chapterId } = useParams();

  const [err, setErr] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/${bookId}`)
      .then((res) => res.data)
      .then((bookData) => {
        const chapter = bookData.chapters.find((ch) => ch._id === chapterId);

        if (chapter) {
          setInputs({
            chapterTitle: chapter.title,
            chapterContent: chapter.content,
          });
        } else {
          console.error("Chapter not found");
        }
      })
      .catch((error) => console.error("Error fetching chapter data", error));
  }, [bookId, chapterId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErr("");
    setMessage("");
  };

  const handleQuill = (chapterContent, delta, source, editor) => {
    setInputs({ ...inputs, chapterContent: editor.getHTML() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      inputs.chapterContent.trim() === "" ||
      inputs.chapterTitle.trim() === ""
    ) {
      return setErr("Veuillez remplir tous les champs");
    }

    const chapter = {
      title: inputs.chapterTitle,
      content: inputs.chapterContent,
    };

    const data = {
      chapters: [chapter],
    };

    axios
      .put(
        `http://localhost:9000/books/chapter/edit/${bookId}/${chapterId}`,
        { chapters: [inputs] },
        {
          headers: {
            ...token(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main>
      {message && <span className="success">{message}</span>}
      <section className="section-style2">
        <h2>Modifier un chapitre</h2>
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

export default ChapterUpdate;
