import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { NavLink } from "react-router-dom";

const Readers = () => {
  const [readers, setReaders] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9000/users", { headers: token() })
      .then((response) => {
        const allUsers = response.data;
        const readers = allUsers.readers || [];

        setReaders(readers);
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      });
  }, []);

  return (
    <main>
      <section>
        <h2>Les lecteurs</h2>
        {readers.map((oneReader, i) => (
          <article key={oneReader._id}>
            <NavLink to={`/profil/${oneReader._id}`}>
              <p>{oneReader.login}</p>{" "}
            </NavLink>
            {oneReader.image && ( // Vérification si 'image' est défini
              <img
                style={{ width: "200px" }}
                src={`http://localhost:9000/assets/img/${
                  oneReader.image.src ?? "default.jpg"
                }`}
                alt={oneReader.image.alt ?? "Default Alt Text"}
              />
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default Readers;
