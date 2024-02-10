import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { token } from "../../context/token";
import { useAuth } from "../../context/AuthContext";

import { IoIosSettings } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";

import "../../assets/styles/profile/profile.css";
import DashboardAdmin from "../../components/dashboard/DashboardAdmin";

const MAX_DESCRIPTION_LENGTH = 250;

const Profile = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState();
  const [successMessage, setSuccessMessage] = useState("");

  const auth = useAuth();
  useEffect(() => {
    axios
      .get(`http://localhost:9000/books/my-book/${auth.user.id}`, {
        headers: token(),
      })
      .then((res) => {
        console.log(res);
        setBooks(res.data);
        setCategories(res.data);
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:9000/users`, {
  //       headers: token(),
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       setUsers(res.data); // Mettez à jour l'état des utilisateurs
  //     })
  //     .catch((res) => {
  //       console.log(res);
  //       setErr("Impossible de charger les utilisateurs");
  //     });
  // }, []);

  const handleDeleteBook = (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer le livre ?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:9000/books/delete/${id}`, {
          headers: token(),
        })
        .then((res) => {
          console.log(res.data.message);
          setSuccessMessage("Le livre a été supprimé avec succès");
          setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer l'utilisateur ?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:9000/users/delete/${id}`, {
          headers: token(),
        })
        .then((res) => {
          console.log(res.data.message);
          setSuccessMessage("L'utilisateur a été supprimé avec succès");
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <main>
      {successMessage && <span className="success">{successMessage}</span>}
      <section className="p-section1">
        {auth.user.login && (
          <>
            <article className="p-article1">
              <img
                src={`http://localhost:9000/assets/img/${auth.user.image.src}`}
              />
              <span id="pic2">
                <Link to={`/modifier-utilisateur/${auth.user.id}`}>
                  <IoIosSettings className="profile-icon" />
                </Link>
                <p onClick={() => handleDeleteUser(auth.user.id)}>
                  <MdDelete className="profile-icon" />
                </p>
              </span>
            </article>
            <article className="p-article2">
              <h3>{auth.user.login}</h3>
            </article>
            {auth.user.description &&
            auth.user.description.length > MAX_DESCRIPTION_LENGTH
              ? `${auth.user.description.substring(
                  0,
                  MAX_DESCRIPTION_LENGTH
                )}...`
              : auth.user.description}{" "}
            <p>
              <FaBookOpen />
              {books.length}
            </p>
          </>
        )}
        <></>
      </section>

      {auth.user.role === "admin" && (
        <section>
          <DashboardAdmin />
        </section>
      )}

      <section className="p-section2">
        <h2>Livres publiés</h2>
        {books.map((oneBook, i) => (
          <>
            {oneBook.image && (
              <section key={oneBook._id} className="p-sous-section">
                <article className="p-article3">
                  <img
                    src={`http://localhost:9000/assets/img/${oneBook.image.src}`}
                    alt={oneBook.image.alt}
                  />
                </article>
                <article className="p-article4">
                  <Link to={`/livre/${oneBook._id}`} className="p-title">
                    {oneBook.title}
                  </Link>
                  <pre>15 chapitres en cours d'écriture</pre>
                  <p>{oneBook.description}</p>
                  <p className="categories">
                    {oneBook.categoryId &&
                      oneBook.categoryId.map((category, index) => (
                        <span key={index}>#{category.name} </span>
                      ))}
                  </p>
                </article>

                <article className="p-article5">
                  <pre>
                    Créé le : {new Date(oneBook.createdAt).toLocaleDateString()}
                  </pre>
                  <pre>
                    Modifié le :{" "}
                    {new Date(oneBook.updatedAt).toLocaleDateString()}
                  </pre>
                </article>

                <article className="p-article6">
                  <Link to={`/modifier-livre/${oneBook._id}`}>
                    <IoIosSettings className="profile-icon" id="pic3" />
                  </Link>

                  <span onClick={() => handleDeleteBook(oneBook._id)}>
                    <MdDelete className="profile-icon" id="pic4" />
                  </span>
                </article>
              </section>
            )}
          </>
        ))}
      </section>
    </main>
  );
};

export default Profile;
