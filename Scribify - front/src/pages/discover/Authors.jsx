import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { NavLink } from "react-router-dom";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9000/users", { headers: token() })
      .then((response) => {
        const allUsers = response.data;
        const authors = allUsers.authors || [];

        setAuthors(authors);
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      });
  }, []);
  return (
    <main>
      <section>
        <h2>Les auteurs</h2>
        {authors.map((oneAuthor, i) => (
          <article key={oneAuthor._id}>
            <NavLink to={`/profil/${oneAuthor._id}`}>
              <p>{oneAuthor.login}</p>
            </NavLink>
            {oneAuthor.image && ( // Vérification si 'image' est défini
              <img
                style={{ width: "200px" }}
                src={`http://localhost:9000/assets/img/${
                  oneAuthor.image.src ?? "default.jpg"
                }`}
                alt={oneAuthor.image.alt ?? "Default Alt Text"}
              />
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default Authors;
