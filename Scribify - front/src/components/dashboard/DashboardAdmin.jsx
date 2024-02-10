import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";

import "../../assets/styles/dashboard/dashboard.css";
import { NavLink, useParams } from "react-router-dom";

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [newRoles, setNewRoles] = useState({});
  const [userBooksCount, setUserBooksCount] = useState({});
  const [message, setMessage] = useState("");
  const [err, setErr] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:9000/users", { headers: token() })
      .then((response) => {
        const data = response.data;
        const allUsers = data.users || [];

        const roles = {};
        allUsers.forEach((user) => {
          roles[user._id] = user.role;

          axios
            .get(`http://localhost:9000/books/my-book/${user._id}`, {
              headers: token(),
            })
            .then((response) => {
              const books = response.data;
              setUserBooksCount((prevCounts) => ({
                ...prevCounts,
                [user._id]: books.length, // Utilisez la longueur du tableau de livres pour obtenir le nombre de livres
              }));
            })
            .catch((error) => {
              console.error(
                "Erreur lors de la récupération des livres de l'utilisateur",
                user.login,
                error
              );
            });
        });

        setNewRoles(roles);
        setUsers(allUsers);
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      });
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:9000/users/edit-role/${userId}`,
        { role: newRole },
        { headers: token() }
      );
      setMessage("Le rôle a bien été mis à jour");
      setNewRoles((prevRoles) => ({ ...prevRoles, [userId]: newRole }));
    } catch (error) {
      console.error(error);
      setErr("Erreur lors de la modification du rôle de l'utilisateur");
    }
  };

  return (
    <>
      <h2>Tableau de Bord Admin</h2>

      <section className="dashboard-admin">
        <article className="dashboard-users">
          <h4>Utilisateurs</h4>
          {users.map((oneUser) => (
            <span key={oneUser._id}>
              <p>
                {oneUser.image && ( // Vérification si 'image' est défini
                  <img
                    style={{ width: "1em" }}
                    src={`http://localhost:9000/assets/img/${
                      oneUser.image.src ?? "default.jpg"
                    }`}
                    alt={oneUser.image.alt ?? "Default Alt Text"}
                  />
                )}
                {oneUser.login}
              </p>
            </span>
          ))}{" "}
        </article>

        <article className="dashboard-roles">
          <h4>Rôles</h4>
          {users.map((oneUser) => (
            <p>
              <select
                value={newRoles[oneUser._id] || oneUser.role} // Par défaut, afficher le rôle actuel
                onChange={(e) => handleRoleChange(oneUser._id, e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </p>
          ))}
        </article>

        <article className="dashboard-books">
          <h4>Livres</h4>
          {users.map((oneUser) => (
            <p key={oneUser._id}>{userBooksCount[oneUser._id] || 0}</p>
          ))}
        </article>

        <article className="dashboard-details">
          <h4>Détails</h4>
          {users.map((oneUser) => (
            <NavLink to={`/profil/${oneUser._id}`}>
              <p>Voir plus</p>
            </NavLink>
          ))}
        </article>
      </section>
    </>
  );
};

export default DashboardAdmin;
