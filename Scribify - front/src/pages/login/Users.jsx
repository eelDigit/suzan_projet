/* A ajouter dans le menu pour les admins  */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [err, setErr] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:9000/users/", { headers: token() })
      .then((res) => {
        console.log(res.data.users);
        setUsers(res.data.users);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  return (
    <main>
      <section>
        <h2>Utilisateurs</h2>
        {users.length > 0 && (
          <>
            {users.map((oneUser, i) => (
              <>
                <article key={oneUser._id}>
                  <p>{oneUser.login}</p>
                  <p>{oneUser.email}</p>
                  {oneUser.image && (
                    <img
                      style={{ width: "200px" }}
                      src={`http://localhost:9000/assets/img/${oneUser.image.src}`}
                      alt={oneUser.image.alt}
                    />
                  )}
                  <span>
                    Utilisateur créé le :
                    {new Date(oneUser.createdAt).toLocaleDateString()}
                  </span>
                </article>
              </>
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default Users;
