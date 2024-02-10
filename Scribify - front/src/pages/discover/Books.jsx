import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [err, setErr] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:9000/books/")
      .then((res) => {
        console.log(res);
        setBooks(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  return (
    <main>
      <h2>Livres</h2>

      {books.map((oneBook) => (
        <section key={oneBook._id} className="b-section">
          <NavLink to={`/livre/${oneBook._id}`}>
            <h3 className="b-title">{oneBook.title}</h3>
          </NavLink>
          <article className="b-article1">
            <img
              className="style-base2"
              src={`http://localhost:9000/assets/img/${oneBook.image.src}`}
              alt={oneBook.image.alt}
            />
            <ul>
              <li className="style-base">{oneBook.description}</li>
              <li className="categories">
                {oneBook.categoryId &&
                  oneBook.categoryId.map((category, index) => (
                    <span key={index}>#{category.name} </span>
                  ))}
              </li>
            </ul>
          </article>

          <article className="b-article-pre">
            <pre>
              Créé le: {new Date(oneBook.createdAt).toLocaleDateString()}
            </pre>
            <pre>
              Modifié le: {new Date(oneBook.updatedAt).toLocaleDateString()}
            </pre>
          </article>
        </section>
      ))}
    </main>
  );
};

export default Books;
